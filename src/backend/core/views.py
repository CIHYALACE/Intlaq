from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from user.models import Employee
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from user.serializers import EmployeeSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'employer'))

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'employee'))

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    authentication_classes = []
    
    def get_authenticators(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return []
        return super().get_authenticators()

    def get_permissions(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsEmployer()]

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

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related('user')
    serializer_class = EmployeeSerializer
    authentication_classes = []
    
    def get_authenticators(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return []
        return super().get_authenticators()

    def get_permissions(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsEmployer()]

    def get_queryset(self):
        queryset = self.queryset
        
        search = self.request.query_params.get('q', '')
        if search:
            queryset = queryset.filter(
                models.Q(user__username__icontains=search) |
                models.Q(user__first_name__icontains=search) |
                models.Q(user__last_name__icontains=search) |
                models.Q(title__icontains=search)
            )
        
        location = self.request.query_params.get('location', '')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        skills = self.request.query_params.get('skills', '')
        if skills:
            queryset = queryset.filter(skills__name__icontains=skills)
        
        experience = self.request.query_params.get('exp', '')
        if experience:
            queryset = queryset.filter(experience_level=experience)
        
        return queryset

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-applied_at')
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'employee'):
            return Response(
                {"error": "Only users with an employee profile can submit applications."},
                status=status.HTTP_403_FORBIDDEN
            )

        employee_profile = request.user.employee
        
        job_id = request.data.get('job')
        if Application.objects.filter(employee=employee_profile, job_id=job_id).exists():
            return Response(
                {"error": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data['employee'] = employee_profile.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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