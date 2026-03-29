from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Sum
from expenses.models import Expense

class AnalyticsDashboardView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        
        # Base query depends on role
        if user.role == 'Admin':
            qs = Expense.objects.filter(user__company=user.company)
        elif user.role == 'Manager':
            qs = Expense.objects.filter(user=user) | Expense.objects.filter(user__reporting_manager=user)
        else:
            qs = Expense.objects.filter(user=user)
            
        # Monthly summaries (very simplified)
        # Category breakdown
        category_breakdown = qs.values('category').annotate(total=Sum('amount'))
        
        # Total per user
        user_totals = qs.values('user__username').annotate(total=Sum('amount'))
        
        # Total overall amounts
        total_amount = qs.aggregate(Sum('amount'))['amount__sum'] or 0
        total_pending = qs.filter(status='Pending').aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'total_expenses': total_amount,
            'total_pending': total_pending,
            'category_breakdown': category_breakdown,
            'user_totals': user_totals,
        }, status=status.HTTP_200_OK)
