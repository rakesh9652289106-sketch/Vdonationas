from django.urls import path
from .views import RecurringListCreateView, RecurringDetailView

urlpatterns = [
    path('', RecurringListCreateView.as_view(), name='recurring_list_create'),
    path('<str:subscription_id>/', RecurringDetailView.as_view(), name='recurring_detail'),
]
