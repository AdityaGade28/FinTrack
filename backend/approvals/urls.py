from django.urls import path
from .views import ApprovalRuleListCreateView, PendingApprovalsView, ApproveRejectActionView, AuditLogListView

urlpatterns = [
    path('rules/', ApprovalRuleListCreateView.as_view(), name='rules-list-create'),
    path('pending/', PendingApprovalsView.as_view(), name='pending-approvals'),
    path('manager-pending/', PendingApprovalsView.as_view(), name='manager-pending-approvals'),
    path('<int:flow_id>/action/', ApproveRejectActionView.as_view(), name='approve-reject-action'),
    path('audit-log/', AuditLogListView.as_view(), name='audit-log'),
]
