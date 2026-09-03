from django.db import models
import uuid

class Temple(models.Model):
    VERIFICATION_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('SUSPENDED', 'Suspended'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    deity = models.CharField(max_length=255)
    description = models.TextField()
    history = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()
    trust_name = models.CharField(max_length=255)
    registration_no = models.CharField(max_length=100)
    tax_benefit_info = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    banner_url = models.URLField(max_length=500, blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='VERIFIED')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.city})"

class DonationCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    temple = models.ForeignKey(Temple, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.temple.name}"

class Campaign(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    temple = models.ForeignKey(Temple, on_delete=models.CASCADE, related_name='campaigns')
    title = models.CharField(max_length=255)
    description = models.TextField()
    banner_url = models.URLField(max_length=500, blank=True, null=True)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, default='ACTIVE')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.temple.name}"
