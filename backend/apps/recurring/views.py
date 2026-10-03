import random
import calendar
from datetime import date
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import RecurringDonation
from .serializers import RecurringDonationSerializer

def calculate_next_deduction_date(start_date=None, interval='MONTHLY'):
    if start_date is None:
        start_date = date.today()
    interval = (interval or 'MONTHLY').upper()
    months_to_add = 12 if interval == 'YEARLY' else (3 if interval == 'QUARTERLY' else 1)
    
    total_months = (start_date.month - 1) + months_to_add
    target_year = start_date.year + (total_months // 12)
    target_month = (total_months % 12) + 1
    
    max_days = calendar.monthrange(target_year, target_month)[1]
    target_day = min(start_date.day, max_days)
    
    return date(target_year, target_month, target_day)

class RecurringListCreateView(generics.ListCreateAPIView):
    queryset = RecurringDonation.objects.all().order_by('-created_at')
    serializer_class = RecurringDonationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        sub_id = f"SUB-AUTOPAY-{random.randint(10000, 99999)}"
        interval = serializer.validated_data.get('interval', 'MONTHLY')
        next_date = calculate_next_deduction_date(date.today(), interval)
        serializer.save(
            subscription_id=sub_id,
            next_deduction_date=next_date,
            status='ACTIVE'
        )

class RecurringDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecurringDonation.objects.all()
    serializer_class = RecurringDonationSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'subscription_id'
