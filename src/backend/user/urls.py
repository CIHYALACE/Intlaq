from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from .views import EmployeeViewSet, EmployerViewSet, register_user, activate_user, MyTokenObtainPairView
from .authentication import EmailTokenObtainPairView

router = routers.DefaultRouter()

router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'employers', EmployerViewSet, basename='employer')

urlpatterns = [
    # Include the router URLs
    path('api/', include(router.urls)),
    
    path('api/employees/me/', EmployeeViewSet.as_view({'get': 'retrieve','put': 'me','patch': 'me'}), name='employee-me'),
    path('api/employers/me/', EmployerViewSet.as_view({'get': 'retrieve','put': 'me','patch': 'me'}), name='employer-me'),
    
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/register/', register_user, name='register_user'),
    path('activate/<uidb64>/<token>/', activate_user, name='activate_user')
]