from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import EmployeeViewSet

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/employees/', EmployeeViewSet.as_view({'get': 'list', 'post': 'create'}), name='employee-list'),
    path('api/employees/<int:pk>/', EmployeeViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='employee-detail'),
]