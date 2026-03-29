from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
import uuid
from .models import User, Company, Notification
from .serializers import (
    RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer, NotificationSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserListView(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return User.objects.filter(company=user.company)
        elif user.role == 'Manager':
            return User.objects.filter(reporting_manager=user)
        return User.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'Admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can create users.")
        new_user = serializer.save(company=user.company)
        new_user.set_password('FinTrack123!')
        new_user.save()

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return User.objects.filter(company=user.company)
        elif user.role == 'Manager':
            return User.objects.filter(reporting_manager=user)
        return User.objects.none()

# Password Reset Views...
class ForgotPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        email = request.data.get('email', '').strip()
        try:
            user = User.objects.get(email=email)
            token = uuid.uuid4()
            user.password_reset_token = token
            user.password_reset_expires = timezone.now() + timedelta(hours=1)
            user.save()
            reset_link = f"http://localhost:5173/reset-password/{token}"
            send_mail('FinTrack Password Reset', f'Reset link: {reset_link}', 'noreply@fintrack.app', [email], fail_silently=True)
            return Response({'message': 'Reset link sent.', 'dev_link': reset_link})
        except User.DoesNotExist:
            return Response({'message': 'If user exists, reset link sent.'})

class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        try:
            user = User.objects.get(password_reset_token=token, password_reset_expires__gt=timezone.now())
            user.set_password(password)
            user.password_reset_token = None
            user.save()
            return Response({'message': 'Password reset success.'})
        except User.DoesNotExist:
            return Response({'error': 'Invalid or expired token.'}, status=400)

class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, token):
        try:
            user = User.objects.get(email_verification_token=token)
            user.email_verified = True
            user.email_verification_token = None
            user.save()
            return Response({'message': 'Verified.'})
        except User.DoesNotExist:
            return Response({'error': 'Invalid token.'}, status=400)

class ResendVerificationView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        # Implementation...
        return Response({'message': 'Resent.'})

# ─── USER INTERCONNECTION ─────────────────────────────────────────────────────

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationBulkReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All marked as read.'})

class CompanyDirectoryView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return User.objects.filter(company=self.request.user.company).exclude(id=self.request.user.id)
# ─── ENTERPRISE DATA INITIALIZATION ──────────────────────────────────────────

class InitializeEnterpriseDataView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        try:
            # Clean existing enterprise initial data
            User.objects.filter(email__endswith='@acme.in').delete()
            Company.objects.filter(name='Acme India Solutions').delete()

            # 1. Create Company
            company = Company.objects.create(name='Acme India Solutions', base_currency='INR')

            # 2. Create Users
            users_data = [
                {'email': 'rajesh@acme.in', 'first_name': 'Rajesh', 'last_name': 'Sharma', 'role': 'Admin', 'dept': 'Executive', 'id': 'EMP-1001'},
                {'email': 'priya@acme.in', 'first_name': 'Priya', 'last_name': 'Gupta', 'role': 'Manager', 'dept': 'Sales', 'id': 'EMP-1002'},
                {'email': 'amit@acme.in', 'first_name': 'Amit', 'last_name': 'Patel', 'role': 'Manager', 'dept': 'Engineering', 'id': 'EMP-1003'},
                {'email': 'suresh@acme.in', 'first_name': 'Suresh', 'last_name': 'Kumar', 'role': 'Employee', 'dept': 'Sales', 'id': 'EMP-2001'},
                {'email': 'anjali@acme.in', 'first_name': 'Anjali', 'last_name': 'Singh', 'role': 'Employee', 'dept': 'Engineering', 'id': 'EMP-2002'},
                {'email': 'vikram@acme.in', 'first_name': 'Vikram', 'last_name': 'Rao', 'role': 'Employee', 'dept': 'Marketing', 'id': 'EMP-2003'},
            ]

            created_users = {}
            for u in users_data:
                user = User.objects.create_user(
                    username=u['email'].split('@')[0],
                    email=u['email'],
                    password='FinTrack123!',
                    first_name=u['first_name'],
                    last_name=u['last_name'],
                    role=u['role'],
                    company=company,
                    department=u['dept'],
                    employee_id=u['id'],
                    email_verified=True
                )
                created_users[u['email']] = user
                
                # Create Welcome Notification
                Notification.objects.create(
                    user=user,
                    title="System Initialized!",
                    message=f"Hi {u['first_name']}, welcome to your enterprise dashboard. All systems active.",
                    type='SYSTEM'
                )

            # 3. Setup Hierarchy
            priya = created_users['priya@acme.in']
            amit = created_users['amit@acme.in']
            rajesh = created_users['rajesh@acme.in']
            
            # Managers report to Rajesh (Admin)
            priya.reporting_manager = rajesh
            priya.save()
            amit.reporting_manager = rajesh
            amit.save()
            
            # Employees report to Managers
            created_users['suresh@acme.in'].reporting_manager = priya
            created_users['suresh@acme.in'].save()
            created_users['vikram@acme.in'].reporting_manager = priya
            created_users['vikram@acme.in'].save()
            created_users['anjali@acme.in'].reporting_manager = amit
            created_users['anjali@acme.in'].save()

            # 4. Populate Expenses
            from expenses.models import Expense
            from approvals.models import ApprovalFlow, AuditLog
            import random
            from datetime import timedelta

            vendors = [
                ('Swiggy', 'Food & Dining'), ('Zomato', 'Food & Dining'), ('Uber India', 'Travel'),
                ('Ola Cabs', 'Travel'), ('Indigo Airlines', 'Travel'), ('Taj Hotels', 'Accommodation'),
                ('Cafe Coffee Day', 'Office Supplies'), ('Amazon India', 'Office Supplies'),
                ('Zoho One', 'Software'), ('Netflix India', 'Subscriptions'), ('Reliance Digital', 'Electronics'),
                ('Midday News', 'Others'), ('Staples India', 'Office Supplies')
            ]

            status_choices = ['Approved', 'Rejected', 'Pending']

            for email, user in created_users.items():
                if user.role != 'Admin':
                    # Create 5-8 expenses for each user
                    for i in range(random.randint(5, 8)):
                        vendor, category = random.choice(vendors)
                        amount = random.randint(500, 25000)
                        status = random.choice(status_choices)
                        
                        expense = Expense.objects.create(
                            user=user,
                            vendor_name=vendor,
                            category=category,
                            amount=amount,
                            currency='INR',
                            description=f"Business transaction for {vendor} - {category}",
                            date=timezone.now() - timedelta(days=random.randint(1, 30)),
                            status=status
                        )
                        
                        # Add Audit Log for every expense
                        AuditLog.objects.create(
                            expense=expense,
                            actor=user,
                            action='Submitted'
                        )

                        # Logic for Approval Flow and result
                        if user.reporting_manager:
                            flow = ApprovalFlow.objects.create(
                                expense=expense,
                                approver=user.reporting_manager,
                                status=status,
                                step_order=1,
                                is_required=True,
                                comments=f"Validated by {user.reporting_manager.first_name}" if status != 'Pending' else ""
                            )
                            if status != 'Pending':
                                AuditLog.objects.create(
                                    expense=expense,
                                    actor=user.reporting_manager,
                                    action=status
                                )
                                # Notify User about outcome
                                Notification.objects.create(
                                    user=user,
                                    title=f"Update: Transaction {status}",
                                    message=f"Your record for {amount} INR have been {status}.",
                                    type='EXPENSE'
                                )

            return Response({
                'message': 'Enterprise Data Initialized!',
                'company': company.name,
                'users': [u['email'] for u in users_data],
                'status': 'Fully Functional'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)
