from rest_framework import serializers
from .models import Receipt
from apps.donations.serializers import DonationSerializer

class ReceiptSerializer(serializers.ModelSerializer):
    donation = DonationSerializer(read_only=True)

    class Meta:
        model = Receipt
        fields = '__all__'
