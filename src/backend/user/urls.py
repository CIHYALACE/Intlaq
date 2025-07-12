from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import EmployeeViewSet, EmployerViewSet, register_user, activate_user
from .authentication import EmailTokenObtainPairView

urlpatterns = [
    # Authentication
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Employee endpoints
    path('api/employees/', EmployeeViewSet.as_view({'get': 'list', 'post': 'create'}), name='employee-list'),
    path('api/employees/<int:pk>/', EmployeeViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='employee-detail'),
    path('api/employees/me/', EmployeeViewSet.as_view({
        'get': 'retrieve',
        'put': 'me',
        'patch': 'me',
    }), name='employee-me'),
    
    # Employer endpoints
    path('api/employers/', EmployerViewSet.as_view({'get': 'list', 'post': 'create'}), name='employer-list'),
    path('api/employers/<int:pk>/', EmployerViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='employer-detail'),
    path('api/employers/me/', EmployerViewSet.as_view({
        'get': 'retrieve',
        'put': 'me',
        'patch': 'me',
    }), name='employer-me'),
    
    # Registration and activation
    path('register/', register_user, name='register_user'),
    path('activate/<uidb64>/<token>/', activate_user, name='activate_user')
]