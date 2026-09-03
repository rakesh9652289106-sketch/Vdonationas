from rest_framework import generics, permissions
from .models import Temple, DonationCategory, Campaign
from .serializers import TempleSerializer, DonationCategorySerializer, CampaignSerializer

class TempleListView(generics.ListCreateAPIView):
    queryset = Temple.objects.filter(is_active=True)
    serializer_class = TempleSerializer
    permission_classes = [permissions.AllowAny]

class TempleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Temple.objects.all()
    serializer_class = TempleSerializer
    permission_classes = [permissions.AllowAny]

class CategoryListView(generics.ListCreateAPIView):
    queryset = DonationCategory.objects.filter(is_active=True)
    serializer_class = DonationCategorySerializer
    permission_classes = [permissions.AllowAny]

class CampaignListView(generics.ListCreateAPIView):
    queryset = Campaign.objects.filter(status='ACTIVE')
    serializer_class = CampaignSerializer
    permission_classes = [permissions.AllowAny]
