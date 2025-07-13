from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer

class IsEmployer(permissions.BasePermission):
    """Allow access only to authenticated users who have an employer profile"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'employer'))

class JobViewSet(viewsets.ModelViewSet):
    """CRUD operations for Job postings.

    - Anyone can list or retrieve jobs.
    - Only authenticated employers can create jobs.
    - Only the owner employer can update or delete their jobs.
    """
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Must be employer to modify jobs
            return [permissions.IsAuthenticated(), IsEmployer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Ensure the authenticated user is an employer and assign automatically
        employer = self.request.user.employer
        serializer.save(employer=employer)

    def perform_update(self, serializer):
        # Prevent changing owner
        serializer.save(employer=self.request.user.employer)

    def get_queryset(self):
        # Employers can filter their own jobs using ?mine=true
        mine = self.request.query_params.get('mine')
        if mine == 'true' and hasattr(self.request.user, 'employer'):
            return self.queryset.filter(employer=self.request.user.employer)
        return self.queryset

    def destroy(self, request, *args, **kwargs):
        # Only owner can delete
        job = self.get_object()
        if job.employer.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
