from django.db import models
from apps.donations.models import Donation
import uuid

class Receipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receipt_no = models.CharField(max_length=100, unique=True)
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='receipt')
    verification_code = models.CharField(max_length=50, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Receipt #{self.receipt_no} (Code: {self.verification_code})"
