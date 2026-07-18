import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Expense
from .serializers import ExpenseSerializer
from .ocr_service import extract_receipt_data
from approvals.models import ApprovalFlow, ApprovalRule

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Expense.objects.filter(user__company=user.company)
        elif user.role == 'Manager':
            # Manager sees their own and their team's expenses
            return Expense.objects.filter(user=user) | Expense.objects.filter(user__reporting_manager=user)
        return Expense.objects.filter(user=user)

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user, status='Pending')
        # Currency conversion logic would go here
        expense.base_amount = expense.amount # mock for now
        
        # Auto-trigger workflow instead of trapping as 'Draft'
        self.trigger_approval_workflow(expense)

    def trigger_approval_workflow(self, expense):
        user = expense.user
        company = user.company
        
        # Get specific rule for this user, or any rule for company
        rule = ApprovalRule.objects.filter(target_user=user).first()
        if not rule:
            rule = ApprovalRule.objects.filter(company=company).first()
            
        step = 1
        flows = []
        
        if rule:
            # First, manager approval if checkbox ticked
            if rule.is_manager_approver and rule.manager:
                flows.append(ApprovalFlow(
                    expense=expense,
                    approver=rule.manager,
                    status='Pending' if step == 1 else 'Draft',
                    step_order=step,
                    is_required=True
                ))
                if rule.approvers_sequence:
                    step += 1
            
            # Next, list of approvers
            rule_approvers = rule.approvers.all().order_by('sequence_order')
            for ra in rule_approvers:
                flows.append(ApprovalFlow(
                    expense=expense,
                    approver=ra.user,
                    status='Pending' if not rule.approvers_sequence or step == 1 else 'Draft',
                    step_order=step,
                    is_required=ra.required
                ))
                if rule.approvers_sequence:
                    step += 1
                    
            if flows:
                ApprovalFlow.objects.bulk_create(flows)
                expense.status = 'Pending'
                expense.save()
                return
                
        # Default Fallback (Critical Connection Logic)
        if user.reporting_manager:
            approver = user.reporting_manager
        elif user.role != 'Admin':
            # E.g. Manager without reporting manager goes to Admin
            from accounts.models import User
            company_admin = User.objects.filter(company=company, role='Admin').first()
            approver = company_admin or user
        else:
            # Admin who has no manager will self-approve
            approver = user
            
        from accounts.models import Notification
        ApprovalFlow.objects.create(
            expense=expense,
            approver=approver,
            status='Pending',
            step_order=1,
            is_required=True
        )
        Notification.objects.create(
            user=approver,
            title="New Approval Request",
            message=f"{user.first_name} has submitted a new expense for {expense.amount} {expense.currency}.",
            type='APPROVAL'
        )
        expense.status = 'Pending'
            
        expense.save()

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Expense.objects.filter(user__company=user.company)
        elif user.role == 'Manager':
            return Expense.objects.filter(user=user) | Expense.objects.filter(user__reporting_manager=user)
        return Expense.objects.filter(user=user)

class ReceiptOCRView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'receipt' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
            
        receipt_file = request.FILES['receipt']
        # Temporarily save file to disk for OCR processing
        temp_path = f"tmp_{receipt_file.name}"
        with open(temp_path, 'wb+') as destination:
            for chunk in receipt_file.chunks():
                destination.write(chunk)
                
        # Extract data
        ocr_data = extract_receipt_data(temp_path)
        
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if ocr_data:
            return Response(ocr_data, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to extract data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
