from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from apps.users.models import User
from apps.temples.models import Temple, DonationCategory, Campaign
import uuid

class Donation(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('UPI', 'UPI / QR'),
        ('CARD', 'Credit / Debit Card'),
        ('NETBANKING', 'Net Banking'),
        ('CASH', 'Cash'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donation_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    temple = models.ForeignKey(Temple, on_delete=models.CASCADE, related_name='donations')
    category = models.ForeignKey(DonationCategory, on_delete=models.SET_NULL, null=True, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('1.00'))])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='UPI')
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUCCESS')
    is_anonymous = models.BooleanField(default=False)
    dedication_msg = models.TextField(blank=True, null=True)
    on_behalf_of = models.CharField(max_length=255, blank=True, null=True)
    donor_name = models.CharField(max_length=255)
    donor_email = models.EmailField()
    donor_phone = models.CharField(max_length=20)
    donor_pan = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.donation_id} - ₹{self.amount} ({self.donor_name})"
