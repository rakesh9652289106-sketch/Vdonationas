import random
import time
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Donation
from .serializers import DonationSerializer
from apps.temples.models import Temple

class DonationListCreateView(generics.ListCreateAPIView):
    queryset = Donation.objects.all().order_by('-created_at')
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        don_id = f"DON-2026-{random.randint(10000, 99999)}"
        tx_id = f"TXN-PG-{random.randint(100000, 999999)}"
        serializer.save(
            donation_id=don_id,
            transaction_id=tx_id,
            status='SUCCESS'
        )

class DonationDetailView(generics.RetrieveAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'donation_id'
