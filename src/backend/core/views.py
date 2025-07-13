from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'employer'))

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'employee'))

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsEmployer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        employer = self.request.user.employer
        serializer.save(employer=employer)

    def perform_update(self, serializer):
        serializer.save(employer=self.request.user.employer)

    def get_queryset(self):
        mine = self.request.query_params.get('mine')
        if mine == 'true' and hasattr(self.request.user, 'employer'):
            return self.queryset.filter(employer=self.request.user.employer)
        return self.queryset

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.employer.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-applied_at')
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'employee'):
            job_id = serializer.validated_data['job'].id
            if Application.objects.filter(
                employee=self.request.user.employee,
                job_id=job_id
                ).exists():
                raise ValidationError({'job': 'You have already applied to this job'})

            serializer.save(employee=self.request.user.employee)
        else:
            raise PermissionDenied("Only employees can submit applications")

    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.request.query_params.get('mine') == 'true':
            if hasattr(self.request.user, 'employer'):
                return queryset.filter(job__employer=self.request.user.employer)
            elif hasattr(self.request.user, 'employee'):
                return queryset.filter(employee=self.request.user.employee)
        
        return queryset

    def perform_update(self, serializer):
        application = self.get_object()
        
        # Only allow employer who owns the job to update the status
        if hasattr(self.request.user, 'employer') and application.job.employer == self.request.user.employer:
            if 'status' in serializer.validated_data:
                serializer.save()
            else:
                raise ValidationError({'detail': 'Only the status field can be updated by employers'})
        else:
            raise PermissionDenied("You don't have permission to update this application")

    def destroy(self, request, *args, **kwargs):
        application = self.get_object()

        if (hasattr(request.user, 'employee') and application.employee == request.user.employee) or \
           (hasattr(request.user, 'employer') and application.job.employer == request.user.employer):
            return super().destroy(request, *args, **kwargs)
        return Response(
            {'detail': 'You do not have permission to delete this application.'},
            status=status.HTTP_403_FORBIDDEN
        )