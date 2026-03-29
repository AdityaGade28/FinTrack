from rest_framework import serializers
from .models import Expense
from accounts.serializers import UserSerializer

class ExpenseSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('user', 'status', 'base_amount', 'created_at', 'updated_at', 'vendor_name')

class ReceiptUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('receipt',)
