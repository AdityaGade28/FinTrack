from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, CustomTokenObtainPairView, CurrentUserView,
    UserListView, UserDetailView,
    ForgotPasswordView, ResetPasswordView, VerifyEmailView, ResendVerificationView,
    NotificationListView, NotificationBulkReadView, CompanyDirectoryView, SeedIndianDataView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', CurrentUserView.as_view(), name='current_user'),

    # User Management
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Password Reset
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),

    # Email Verification
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend_verification'),
    
    # User Interconnection
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/read-all/', NotificationBulkReadView.as_view(), name='notification-read-all'),
    path('directory/', CompanyDirectoryView.as_view(), name='company-directory'),
    path('initialize-enterprise-data/', InitializeEnterpriseDataView.as_view(), name='initialize-enterprise-data'),
]
