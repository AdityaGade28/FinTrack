from rest_framework import serializers
from .models import ApprovalRule, ApprovalFlow, AuditLog, RuleApprover
from expenses.serializers import ExpenseSerializer
from accounts.serializers import UserSerializer

class RuleApproverSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleApprover
        fields = ('user', 'required', 'sequence_order')

class ApprovalRuleSerializer(serializers.ModelSerializer):
    approvers = RuleApproverSerializer(many=True, required=False)

    class Meta:
        model = ApprovalRule
        fields = '__all__'
        read_only_fields = ('company',)

    def create(self, validated_data):
        approvers_data = validated_data.pop('approvers', [])
        rule = ApprovalRule.objects.create(**validated_data)
        for app_data in approvers_data:
            RuleApprover.objects.create(rule=rule, **app_data)
        return rule

class ApprovalFlowSerializer(serializers.ModelSerializer):
    expense_details = ExpenseSerializer(source='expense', read_only=True)
    approver_details = UserSerializer(source='approver', read_only=True)
    
    class Meta:
        model = ApprovalFlow
        fields = '__all__'
        read_only_fields = ('expense', 'approver', 'step_order', 'updated_at')

class AuditLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='actor', read_only=True)
    expense_details = ExpenseSerializer(source='expense', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ('actor', 'expense', 'action', 'timestamp')
