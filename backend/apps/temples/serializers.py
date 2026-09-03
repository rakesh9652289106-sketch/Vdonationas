from rest_framework import serializers
from .models import Temple, DonationCategory, Campaign

class DonationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCategory
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

class TempleSerializer(serializers.ModelSerializer):
    categories = DonationCategorySerializer(many=True, read_only=True)
    campaigns = CampaignSerializer(many=True, read_only=True)

    class Meta:
        model = Temple
        fields = '__all__'
