from django.urls import path
from .views import (
    InitiativeListCreateView,
    InitiativeDetailView,
    InitiativeStatusTransitionView,
    InitiativeStageUpdateView,
    InitiativeExpenseListCreateView,
    InitiativeUpdateListCreateView,
    InitiativeStatsView,
)

urlpatterns = [
    path('', InitiativeListCreateView.as_view(), name='initiative-list-create'),
    path('stats/', InitiativeStatsView.as_view(), name='initiative-stats'),
    path('<str:code>/', InitiativeDetailView.as_view(), name='initiative-detail'),
    path('<str:code>/status/', InitiativeStatusTransitionView.as_view(), name='initiative-status'),
    path('<str:code>/stage/', InitiativeStageUpdateView.as_view(), name='initiative-stage'),
    path('<str:code>/expenses/', InitiativeExpenseListCreateView.as_view(), name='initiative-expenses'),
    path('<str:code>/updates/', InitiativeUpdateListCreateView.as_view(), name='initiative-updates'),
]
