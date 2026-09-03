from rest_framework import serializers
from .models import RecurringDonation

class RecurringDonationSerializer(serializers.ModelSerializer):
    temple_name = serializers.ReadOnlyField(source='temple.name')

    class Meta:
        model = RecurringDonation
        fields = '__all__'
        read_only_fields = ['id', 'subscription_id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly recurring donation amount must be a positive number (minimum ₹1).")
        return value
