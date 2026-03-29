from django.db import models
from accounts.models import User, Company
from expenses.models import Expense

class ApprovalRule(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    description = models.CharField(max_length=255, default="Approval Rule")
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='specific_rules', null=True, blank=True)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_rules')
    
    # Complex Configuration
    is_manager_approver = models.BooleanField(default=False)
    approvers_sequence = models.BooleanField(default=False)
    min_approval_percentage = models.IntegerField(default=100)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rule: {self.description} ({self.company.name})"

class RuleApprover(models.Model):
    rule = models.ForeignKey(ApprovalRule, related_name='approvers', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    required = models.BooleanField(default=False)
    sequence_order = models.IntegerField(default=1)

    class Meta:
        ordering = ['sequence_order']

    def __str__(self):
        return f"{self.user.username} for Rule {self.rule.id}"

class ApprovalFlow(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='approvals')
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pending_approvals')
    status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Draft', 'Draft'),
        ('Closed/Skipped', 'Closed/Skipped'),
    ], default='Pending')
    step_order = models.IntegerField(default=1)
    is_required = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.expense.description} - {self.approver.username} ({self.status})"

class AuditLog(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='audit_logs')
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.actor} - {self.action}"
