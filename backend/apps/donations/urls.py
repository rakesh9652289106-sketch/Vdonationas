from django.urls import path
from .views import DonationListCreateView, DonationDetailView

urlpatterns = [
    path('', DonationListCreateView.as_view(), name='donation_list_create'),
    path('<str:donation_id>/', DonationDetailView.as_view(), name='donation_detail'),
]
