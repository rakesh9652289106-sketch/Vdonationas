from rest_framework import serializers
from .models import (
    Initiative,
    InitiativeBreakdownItem,
    InitiativeUpdate,
    InitiativeExpense,
    InitiativeAuditLog
)

class InitiativeBreakdownItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InitiativeBreakdownItem
        fields = '__all__'
        read_only_fields = ['id', 'initiative']


class InitiativeUpdateSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.ReadOnlyField(source='posted_by.full_name', default='Temple Administrator')

    class Meta:
        model = InitiativeUpdate
        fields = '__all__'
        read_only_fields = ['id', 'initiative', 'posted_at']


class InitiativeExpenseSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.ReadOnlyField(source='recorded_by.full_name', default='Finance Admin')
    approved_by_name = serializers.ReadOnlyField(source='approved_by.full_name', default='Super Admin')

    class Meta:
        model = InitiativeExpense
        fields = '__all__'
        read_only_fields = ['id', 'initiative', 'created_at']


class InitiativeAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.full_name', default='System')

    class Meta:
        model = InitiativeAuditLog
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']


class InitiativeListSerializer(serializers.ModelSerializer):
    percentage_funded = serializers.ReadOnlyField()
    total_approved_expenses = serializers.ReadOnlyField()
    remaining_funds = serializers.ReadOnlyField()

    class Meta:
        model = Initiative
        fields = [
            'id',
            'code',
            'title',
            'short_title',
            'initiative_type',
            'custom_type',
            'priority',
            'is_urgent',
            'city',
            'state',
            'target_amount',
            'current_raised',
            'donor_count',
            'min_donation',
            'cover_image',
            'current_stage',
            'status',
            'scheduled_publish_at',
            'is_teaser_enabled',
            'muhurtham_name',
            'broadcast_on_publish',
            'percentage_funded',
            'total_approved_expenses',
            'remaining_funds',
            'created_at',
        ]


class InitiativeDetailSerializer(serializers.ModelSerializer):
    breakdown_items = InitiativeBreakdownItemSerializer(many=True, read_only=True)
    updates = InitiativeUpdateSerializer(many=True, read_only=True)
    expenses = InitiativeExpenseSerializer(many=True, read_only=True)
    audit_logs = InitiativeAuditLogSerializer(many=True, read_only=True)
    percentage_funded = serializers.ReadOnlyField()
    total_approved_expenses = serializers.ReadOnlyField()
    remaining_funds = serializers.ReadOnlyField()
    created_by_name = serializers.ReadOnlyField(source='created_by.full_name', default='Super Admin')

    class Meta:
        model = Initiative
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
