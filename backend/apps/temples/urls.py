from django.urls import path
from .views import TempleListView, TempleDetailView, CategoryListView, CampaignListView

urlpatterns = [
    path('', TempleListView.as_view(), name='temple_list'),
    path('<uuid:pk>/', TempleDetailView.as_view(), name='temple_detail'),
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('campaigns/', CampaignListView.as_view(), name='campaign_list'),
]
