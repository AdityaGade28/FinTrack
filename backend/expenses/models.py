from django.db import models
from accounts.models import User

class Expense(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    base_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Converted to company currency
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    notes = models.TextField(null=True, blank=True)
    date = models.DateField()
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    
    vendor_name = models.CharField(max_length=100, null=True, blank=True) # From OCR
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} {self.currency} ({self.status})"
