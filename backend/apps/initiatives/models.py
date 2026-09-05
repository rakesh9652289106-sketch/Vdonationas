import uuid
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from apps.users.models import User

class Initiative(models.Model):
    INITIATIVE_TYPE_CHOICES = (
        ('TEMPLE_CONSTRUCTION', 'Temple Construction'),
        ('TEMPLE_RENOVATION', 'Temple Renovation'),
        ('TEMPLE_EXPANSION', 'Temple Expansion'),
        ('MATHA_DEVELOPMENT', 'Matha Development'),
        ('ANNADANAM', 'Annadanam'),
        ('EDUCATION', 'Education'),
        ('SCHOLARSHIPS', 'Scholarships'),
        ('MEDICAL_ASSISTANCE', 'Medical Assistance'),
        ('COMMUNITY_WELFARE', 'Community Welfare'),
        ('EMERGENCY_RELIEF', 'Emergency Relief'),
        ('INFRASTRUCTURE', 'Infrastructure'),
        ('RELIGIOUS_ACTIVITIES', 'Religious Activities'),
        ('CULTURAL_PROGRAMS', 'Cultural Programs'),
        ('DEVOTEE_SUPPORT', 'Devotee Support'),
        ('OTHER', 'Other'),
    )

    PRIORITY_CHOICES = (
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    )

    STAGE_CHOICES = (
        ('PROPOSED', 'Proposed & Planning'),
        ('FOUNDATION', 'Foundation & Bhoomi Pooja'),
        ('STRUCTURE', 'Structural Works'),
        ('FINISHING', 'Finishing & Sanctum'),
        ('COMPLETED', 'Completed & Consecrated'),
    )

    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('UNDER_REVIEW', 'Under Review'),
        ('VERIFIED', 'Verified'),
        ('PUBLISHED', 'Published'),
        ('SCHEDULED', 'Scheduled Release'),
        ('PAUSED', 'Paused'),
        ('COMPLETED', 'Completed'),
        ('CLOSED', 'Closed'),
        ('REJECTED', 'Rejected'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    short_title = models.CharField(max_length=100, blank=True)
    initiative_type = models.CharField(max_length=50, choices=INITIATIVE_TYPE_CHOICES, default='TEMPLE_CONSTRUCTION')
    custom_type = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField()
    objective = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='NORMAL')
    is_urgent = models.BooleanField(default=False)

    # Location
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100, default='India')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    has_physical_location = models.BooleanField(default=True)

    # Financial details
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('1.00'))])
    current_raised = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    donor_count = models.PositiveIntegerField(default=0)
    min_donation = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('100.00'))
    suggested_amounts = models.JSONField(default=list, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    # Media & Assets
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    documents = models.JSONField(default=list, blank=True)

    # Lifecycle & Milestones
    current_stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='PROPOSED')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='DRAFT', db_index=True)
    scheduled_publish_at = models.DateTimeField(null=True, blank=True)
    is_teaser_enabled = models.BooleanField(default=True)
    muhurtham_name = models.CharField(max_length=100, blank=True, null=True)
    broadcast_on_publish = models.BooleanField(default=True)
    excess_funds_policy = models.TextField(
        blank=True,
        default='Excess funds collected will be utilized transparently for continuous Matha Annadanam, devotee welfare, and educational scholarships under the supervision of Sri Vasavi Matha Trust.'
    )

    # Completion
    completion_date = models.DateTimeField(null=True, blank=True)
    final_report = models.TextField(blank=True, null=True)
    completion_images = models.JSONField(default=list, blank=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_initiatives')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} - {self.title} ({self.status})"

    @property
    def percentage_funded(self):
        if self.target_amount > 0:
            return min(round((self.current_raised / self.target_amount) * 100, 1), 100.0)
        return 0.0

    @property
    def total_approved_expenses(self):
        return sum(e.amount for e in self.expenses.filter(status='APPROVED'))

    @property
    def remaining_funds(self):
        return max(self.current_raised - self.total_approved_expenses, Decimal('0.00'))


class InitiativeBreakdownItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiative = models.ForeignKey(Initiative, on_delete=models.CASCADE, related_name='breakdown_items')
    category = models.CharField(max_length=150)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'category']

    def __str__(self):
        return f"{self.category}: ₹{self.target_amount} ({self.initiative.code})"


class InitiativeUpdate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiative = models.ForeignKey(Initiative, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=255)
    message = models.TextField()
    images = models.JSONField(default=list, blank=True)
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-posted_at']

    def __str__(self):
        return f"Update: {self.title} on {self.initiative.code}"


class InitiativeExpense(models.Model):
    EXPENSE_STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiative = models.ForeignKey(Initiative, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=150)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    description = models.TextField()
    invoice_ref = models.CharField(max_length=100, blank=True, null=True)
    receipt_url = models.URLField(max_length=500, blank=True, null=True)
    expense_date = models.DateField()
    status = models.CharField(max_length=20, choices=EXPENSE_STATUS_CHOICES, default='APPROVED')
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='recorded_expenses')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']

    def __str__(self):
        return f"Expense: {self.category} ₹{self.amount} ({self.status})"


class InitiativeAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    initiative = models.ForeignKey(Initiative, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    previous_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} on {self.initiative.code} at {self.timestamp}"
