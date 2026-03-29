from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import ApprovalRule, ApprovalFlow, AuditLog
from expenses.models import Expense
from .serializers import ApprovalRuleSerializer, ApprovalFlowSerializer, AuditLogSerializer

class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return AuditLog.objects.filter(expense__user__company=user.company).order_by('-timestamp')
        elif user.role == 'Manager':
            return AuditLog.objects.filter(expense__user__reporting_manager=user).order_by('-timestamp')
        return AuditLog.objects.filter(expense__user=user).order_by('-timestamp')

class ApprovalRuleListCreateView(generics.ListCreateAPIView):
    serializer_class = ApprovalRuleSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return ApprovalRule.objects.filter(company=user.company).order_by('-created_at')
        return ApprovalRule.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'Admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can manage rules.")
        serializer.save(company=user.company)

class PendingApprovalsView(generics.ListAPIView):
    serializer_class = ApprovalFlowSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # Admin can view all pending approvals, Manager views those assigned to them
        user = self.request.user
        if user.role == 'Admin':
            return ApprovalFlow.objects.filter(expense__user__company=user.company, status='Pending')
        elif user.role == 'Manager':
            return ApprovalFlow.objects.filter(approver=user, status='Pending')
        return ApprovalFlow.objects.none()

class ApproveRejectActionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, flow_id):
        flow = get_object_or_404(ApprovalFlow, id=flow_id)
        user = request.user
        
        # Check permissions
        if user != flow.approver and user.role != 'Admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        action_status = request.data.get('status') # 'Approved' or 'Rejected'
        comments = request.data.get('comments', '')
        
        if action_status not in ['Approved', 'Rejected']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
        expense = flow.expense
        
        if action_status == 'Approved':
            flow.status = 'Approved'
            flow.comments = comments
            flow.save()
            
            AuditLog.objects.create(
                expense=expense,
                actor=user,
                action='Approved',
            )

            # Rule 1: Specific Approver Override
            if flow.is_required:
                expense.status = 'Approved'
                expense.save()
                
                # Close all other pending/draft flows gracefully
                ApprovalFlow.objects.filter(expense=expense, status__in=['Pending', 'Draft']).exclude(id=flow.id).update(status='Closed/Skipped', comments='Overridden by mandatory approver.')
                
                
                # Notify User
                from accounts.models import Notification
                Notification.objects.create(
                    user=expense.user,
                    title="Expense Fully Approved",
                    message=f"Your expense for {expense.amount} {expense.currency} has been fully approved by {user.first_name}.",
                    type='EXPENSE'
                )
                
                return Response({'message': 'Mandatory Approver Override applied. Expense Approved.'}, status=status.HTTP_200_OK)

            # Prepare Percentage Checks
            current_step_flows = ApprovalFlow.objects.filter(expense=expense, step_order=flow.step_order)
            total_in_step = current_step_flows.count()
            approved_in_step = current_step_flows.filter(status='Approved').count()
            
            rule = ApprovalRule.objects.filter(target_user=expense.user).first()
            if not rule:
                rule = ApprovalRule.objects.filter(company=expense.user.company).first()
                
            min_percentage = rule.min_approval_percentage if rule else 100
            passed_percentage = (approved_in_step / total_in_step) * 100
            
            # Rule 2: Flow Sequence and Percentage Calculation
            next_flows = ApprovalFlow.objects.filter(
                expense=expense, 
                step_order__gt=flow.step_order,
                status='Draft'
            ).order_by('step_order')
            
            if next_flows.exists():
                # Sequential Flow
                if passed_percentage >= min_percentage:
                    next_step = next_flows.first().step_order
                    flows_to_activate = ApprovalFlow.objects.filter(expense=expense, step_order=next_step)
                    flows_to_activate.update(status='Pending')
                    
                    # Notify Next Approvers
                    from accounts.models import Notification
                    for flow_notif in flows_to_activate:
                        Notification.objects.create(
                            user=flow_notif.approver,
                            title="Approval Request",
                            message=f"A new expense from {expense.user.first_name} requires your review (Step {next_step}).",
                            type='APPROVAL'
                        )
                    
                    # Close off anyone else in the current step since we passed
                    current_step_flows.filter(status='Pending').update(status='Closed/Skipped')
                    return Response({'message': 'Step passed percentage requirement. Moved to next sequence.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Approved successfully. Awaiting more approvals for this step.'}, status=status.HTTP_200_OK)
            else:
                # Parallel Flow / Final Step
                if passed_percentage >= min_percentage:
                    expense.status = 'Approved'
                    expense.save()
                    
                    # Notify User
                    from accounts.models import Notification
                    Notification.objects.create(
                        user=expense.user,
                        title="Expense Fully Approved",
                        message=f"Congratulations! Your expense for {expense.amount} {expense.currency} has been approved.",
                        type='EXPENSE'
                    )
                    
                    current_step_flows.filter(status='Pending').update(status='Closed/Skipped')
                    return Response({'message': 'Threshold met. Expense Approved.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Approved successfully. Awaiting more approvals.'}, status=status.HTTP_200_OK)
            
        elif action_status == 'Rejected':
            flow.status = 'Rejected'
            flow.comments = comments
            flow.save()
            
            expense.status = 'Rejected'
            expense.save()
            
            # Mark all remaining draft/pending as rejected
            ApprovalFlow.objects.filter(
                expense=expense,
                status__in=['Pending', 'Draft']
            ).exclude(id=flow.id).update(status='Rejected', comments='Auto-rejected due to sequence')
            
            AuditLog.objects.create(
                expense=expense,
                actor=user,
                action='Rejected',
            )
            
            # Notify User
            from accounts.models import Notification
            Notification.objects.create(
                user=expense.user,
                title="Expense Rejected",
                message=f"Your expense for {expense.amount} {expense.currency} has been rejected by {user.first_name}.",
                type='EXPENSE'
            )
            
            return Response({'message': 'Rejected successfully'}, status=status.HTTP_200_OK)
