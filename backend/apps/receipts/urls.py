from django.urls import path
from .views import ReceiptVerifyView

urlpatterns = [
    path('verify/<str:code>/', ReceiptVerifyView.as_view(), name='receipt_verify'),
]
