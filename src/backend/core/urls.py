from django.urls import path
from .views import JobViewSet

urlpatterns = [
    # Job endpoints
    path('jobs/', JobViewSet.as_view({'get': 'list', 'post': 'create'}), name='job-list'),
    path('jobs/<int:pk>/', JobViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='job-detail'),
]

