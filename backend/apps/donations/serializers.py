from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    temple_name = serializers.ReadOnlyField(source='temple.name')
    category_name = serializers.ReadOnlyField(source='category.name', default='General Seva')
    initiative_title = serializers.ReadOnlyField(source='initiative.title')
    initiative_code = serializers.ReadOnlyField(source='initiative.code')

    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['id', 'donation_id', 'transaction_id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Donation amount must be a positive number (minimum ₹1).")
        return value
