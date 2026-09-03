import random
from datetime import date, timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import RecurringDonation
from .serializers import RecurringDonationSerializer

class RecurringListCreateView(generics.ListCreateAPIView):
    queryset = RecurringDonation.objects.all().order_by('-created_at')
    serializer_class = RecurringDonationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        sub_id = f"SUB-AUTOPAY-{random.randint(10000, 99999)}"
        next_date = date.today() + timedelta(days=30)
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
