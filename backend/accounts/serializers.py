from rest_framework import serializers
from .models import User, Company, Notification
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    reporting_manager_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'company', 'department', 'employee_id', 'reporting_manager', 'reporting_manager_details', 'email_verified')
        read_only_fields = ('email_verified', 'reporting_manager_details')

    def get_reporting_manager_details(self, obj):
        if obj.reporting_manager:
            return {
                'id': obj.reporting_manager.id,
                'first_name': obj.reporting_manager.first_name,
                'last_name': obj.reporting_manager.last_name,
                'role': obj.reporting_manager.role,
                'email': obj.reporting_manager.email
            }
        return None

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    country = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False, default='Admin')
    company_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'country', 'role', 'company_name')

    def create(self, validated_data):
        country = validated_data.pop('country', 'India')
        role = validated_data.pop('role', 'Admin')
        company_name_input = validated_data.pop('company_name', None)
        email = validated_data.get('email')
        first_name = validated_data.get('first_name', '')
        
        # Auto-generate unique username from email
        base_username = email.split('@')[0] if email else first_name.lower().replace(" ", "")
        username = base_username
        import uuid
        if User.objects.filter(username=username).exists():
            username = f"{base_username}_{str(uuid.uuid4())[:4]}"
            
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            role=role,
        )
        
        # Use provided company name or default
        company_name = company_name_input if company_name_input else f"{first_name}'s Company"
        from .utils import get_currency_for_country
        base_currency = get_currency_for_country(country)
        
        company, created = Company.objects.get_or_create(
            name=company_name, 
            defaults={'base_currency': base_currency}
        )
        user.company = company
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
