from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from apps.users.models import User
from apps.temples.models import Temple
import uuid

class RecurringDonation(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('CANCELLED', 'Cancelled'),
    )

    INTERVAL_CHOICES = (
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='recurring_subscriptions')
    temple = models.ForeignKey(Temple, on_delete=models.CASCADE, related_name='recurring_subscriptions')
    category_name = models.CharField(max_length=255, default='Nitya Annadanam Seva')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('1.00'))])
    interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, default='MONTHLY')
    payment_method = models.CharField(max_length=50, default='UPI Autopay')
    next_deduction_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subscription_id} - ₹{self.amount}/mo ({self.category_name})"
