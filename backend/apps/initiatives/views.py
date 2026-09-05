import random
from decimal import Decimal
from django.db.models import Sum, Q, Count
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    Initiative,
    InitiativeBreakdownItem,
    InitiativeUpdate,
    InitiativeExpense,
    InitiativeAuditLog,
)
from .serializers import (
    InitiativeListSerializer,
    InitiativeDetailSerializer,
    InitiativeBreakdownItemSerializer,
    InitiativeUpdateSerializer,
    InitiativeExpenseSerializer,
    InitiativeAuditLogSerializer,
)

class InitiativeListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InitiativeDetailSerializer
        return InitiativeListSerializer

    def get_queryset(self):
        qs = Initiative.objects.all().prefetch_related('expenses', 'breakdown_items')
        status_param = self.request.query_params.get('status')
        type_param = self.request.query_params.get('type')
        urgent_param = self.request.query_params.get('urgent')
        search_param = self.request.query_params.get('search')

        if status_param and status_param != 'ALL':
            qs = qs.filter(status=status_param.upper())
        if type_param and type_param != 'ALL':
            qs = qs.filter(initiative_type=type_param.upper())
        if urgent_param == 'true':
            qs = qs.filter(is_urgent=True)
        if search_param:
            qs = qs.filter(
                Q(title__icontains=search_param) |
                Q(code__icontains=search_param) |
                Q(city__icontains=search_param) |
                Q(state__icontains=search_param) |
                Q(description__icontains=search_param)
            )
        return qs

    def perform_create(self, serializer):
        year = timezone.now().year
        rand_num = random.randint(1000, 9999)
        code = f"VD-INI-{year}-{rand_num}"
        user = self.request.user if self.request.user.is_authenticated else None

        initiative = serializer.save(
            code=code,
            created_by=user,
        )

        # Handle breakdown items from request body if present
        breakdown_data = self.request.data.get('breakdown_items', [])
        if isinstance(breakdown_data, list):
            for index, item in enumerate(breakdown_data):
                InitiativeBreakdownItem.objects.create(
                    initiative=initiative,
                    category=item.get('category', 'General'),
                    target_amount=Decimal(str(item.get('target_amount', 0))),
                    description=item.get('description', ''),
                    order=index
                )

        # Log creation in audit trail
        InitiativeAuditLog.objects.create(
            initiative=initiative,
            user=user,
            action='INITIATIVE_CREATED',
            previous_value='',
            new_value=f"Created initiative {code} with target ₹{initiative.target_amount} (Status: {initiative.status})"
        )


class InitiativeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Initiative.objects.all().prefetch_related('breakdown_items', 'updates', 'expenses', 'audit_logs')
    serializer_class = InitiativeDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'code'

    def get_object(self):
        lookup = self.kwargs.get('code')
        # Support either UUID id or code
        try:
            return Initiative.objects.get(code=lookup)
        except Initiative.DoesNotExist:
            return Initiative.objects.get(id=lookup)


class InitiativeStatusTransitionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, code):
        try:
            initiative = Initiative.objects.get(code=code)
        except Initiative.DoesNotExist:
            try:
                initiative = Initiative.objects.get(id=code)
            except Initiative.DoesNotExist:
                return Response({'error': 'Initiative not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = dict(Initiative.STATUS_CHOICES).keys()
        if new_status not in valid_statuses:
            return Response({'error': f'Invalid status. Choose from: {list(valid_statuses)}'}, status=status.HTTP_400_BAD_REQUEST)

        prev_status = initiative.status
        initiative.status = new_status

        # If completed, update completion details
        if new_status == 'COMPLETED':
            initiative.completion_date = timezone.now()
            initiative.current_stage = 'COMPLETED'
            if request.data.get('final_report'):
                initiative.final_report = request.data.get('final_report')
            if request.data.get('completion_images'):
                initiative.completion_images = request.data.get('completion_images')

        initiative.save()

        user = request.user if request.user.is_authenticated else None
        InitiativeAuditLog.objects.create(
            initiative=initiative,
            user=user,
            action='STATUS_CHANGED',
            previous_value=prev_status,
            new_value=f"Status changed from {prev_status} to {new_status}"
        )

        return Response(InitiDetailSerializer_safe(initiative))


class InitiativeStageUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, code):
        try:
            initiative = Initiative.objects.get(code=code)
        except Initiative.DoesNotExist:
            try:
                initiative = Initiative.objects.get(id=code)
            except Initiative.DoesNotExist:
                return Response({'error': 'Initiative not found'}, status=status.HTTP_404_NOT_FOUND)

        new_stage = request.data.get('stage')
        valid_stages = dict(Initiative.STAGE_CHOICES).keys()
        if new_stage not in valid_stages:
            return Response({'error': f'Invalid stage. Choose from: {list(valid_stages)}'}, status=status.HTTP_400_BAD_REQUEST)

        prev_stage = initiative.current_stage
        initiative.current_stage = new_stage
        initiative.save()

        user = request.user if request.user.is_authenticated else None
        InitiativeAuditLog.objects.create(
            initiative=initiative,
            user=user,
            action='STAGE_ADVANCED',
            previous_value=prev_stage,
            new_value=f"Construction/Milestone stage changed to {new_stage}"
        )

        return Response(InitiDetailSerializer_safe(initiative))


class InitiativeExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = InitiativeExpenseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        code = self.kwargs.get('code')
        return InitiativeExpense.objects.filter(Q(initiative__code=code) | Q(initiative__id=code))

    def perform_create(self, serializer):
        code = self.kwargs.get('code')
        try:
            initiative = Initiative.objects.get(code=code)
        except Initiative.DoesNotExist:
            initiative = Initiative.objects.get(id=code)

        user = self.request.user if self.request.user.is_authenticated else None
        expense = serializer.save(
            initiative=initiative,
            recorded_by=user,
            status='APPROVED' # Super Admin direct entry defaults to APPROVED
        )

        InitiativeAuditLog.objects.create(
            initiative=initiative,
            user=user,
            action='EXPENSE_RECORDED',
            previous_value='',
            new_value=f"Expense of ₹{expense.amount} for '{expense.category}' recorded (Ref: {expense.invoice_ref})"
        )


class InitiativeUpdateListCreateView(generics.ListCreateAPIView):
    serializer_class = InitiativeUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        code = self.kwargs.get('code')
        return InitiativeUpdate.objects.filter(Q(initiative__code=code) | Q(initiative__id=code))

    def perform_create(self, serializer):
        code = self.kwargs.get('code')
        try:
            initiative = Initiative.objects.get(code=code)
        except Initiative.DoesNotExist:
            initiative = Initiative.objects.get(id=code)

        user = self.request.user if self.request.user.is_authenticated else None
        update_obj = serializer.save(
            initiative=initiative,
            posted_by=user
        )

        InitiativeAuditLog.objects.create(
            initiative=initiative,
            user=user,
            action='UPDATE_POSTED',
            previous_value='',
            new_value=f"Field update posted: '{update_obj.title}'"
        )


class InitiativeStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_initiatives = Initiative.objects.count()
        published_initiatives = Initiative.objects.filter(status='PUBLISHED').count()
        aggregates = Initiative.objects.aggregate(
            total_target=Sum('target_amount'),
            total_raised=Sum('current_raised'),
            total_donors=Sum('donor_count')
        )
        urgent_count = Initiative.objects.filter(is_urgent=True, status='PUBLISHED').count()
        active_construction = Initiative.objects.filter(
            initiative_type__in=['TEMPLE_CONSTRUCTION', 'TEMPLE_RENOVATION', 'TEMPLE_EXPANSION', 'MATHA_DEVELOPMENT'],
            status='PUBLISHED'
        ).count()

        total_target = aggregates['total_target'] or Decimal('0.00')
        total_raised = aggregates['total_raised'] or Decimal('0.00')
        overall_progress = round((total_raised / total_target * 100), 1) if total_target > 0 else 0.0

        return Response({
            'total_initiatives': total_initiatives,
            'published_initiatives': published_initiatives,
            'total_target_amount': total_target,
            'total_funds_raised': total_raised,
            'overall_progress_percentage': overall_progress,
            'total_donors': aggregates['total_donors'] or 0,
            'urgent_initiatives_count': urgent_count,
            'active_construction_projects': active_construction,
        })


def InitiDetailSerializer_safe(instance):
    return InitiativeDetailSerializer(instance).data
