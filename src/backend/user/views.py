# Rest Framework imports
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import permission_classes
from .models import Employee, Employer, User
from .serializers import EmployeeSerializer, EmployerSerializer, EmployeeUpdateSerializer, EmployerUpdateSerializer
# Django imports
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.shortcuts import redirect
from django.contrib.auth.tokens import default_token_generator
from django.utils.html import strip_tags
# Logging imports
import logging
import traceback

logger = logging.getLogger(__name__)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request, *args, **kwargs):
        try:
            employee = Employee.objects.get(user=request.user)
            partial = request.method == 'PATCH'
            serializer = EmployeeUpdateSerializer(
                employee, 
                data=request.data, 
                partial=partial
            )
            
            if serializer.is_valid():
                # Handle many-to-many fields
                employee = serializer.save()
                
                # Update programming_languages if provided
                if 'programming_languages' in request.data:
                    employee.programming_languages.set(request.data['programming_languages'])
                
                # Update skills if provided
                if 'skills' in request.data:
                    employee.skills.set(request.data['skills'])
                
                # Get the updated instance with related fields
                updated_employee = Employee.objects.get(id=employee.id)
                return Response(EmployeeSerializer(updated_employee).data)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    def get_object(self):
        if 'me' in self.request.path:
            return self.get_queryset().get(user=self.request.user)
        return super().get_object()
        
    def retrieve(self, request, *args, **kwargs):
        if 'me' in request.path:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info(f'Received POST request to create trainer profile. Data: {request.data}')
        
        required_fields = ['first_name', 'last_name', 'email', 'national_id', 'city']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            logger.error(f'Missing required fields: {missing_fields}')
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f'Error creating trainer profile: {str(e)}\n{traceback.format_exc()}')
            return Response(
                {'error': 'Failed to create trainer profile', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


def send_activation_email(user, request):
    print(f"DEBUG: send_activation_email called for {user.email}")
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    activation_link = request.build_absolute_uri(
        reverse('activate_user', kwargs={'uidb64': uid, 'token': token})
    )
    subject = 'Activate Your Account'
    message = f"""
                <html>
                <body>
                    <p>Hi {user.name},</p>
                    <p>Please click the link below to activate your Intlaq account:</p>
                    <p><a href="{activation_link}">Activate Account</a></p>
                    <p>If you didn’t request this, you can ignore this email.</p>
                </body>
                </html>
            """
    from_email = f"Intlaq Team <{settings.EMAIL_HOST_USER}>"
    try:
        email = EmailMultiAlternatives(
            subject,
            strip_tags(message),
            from_email,
            [user.email]
        )
        email.attach_alternative(message, "text/html")
        email.send()
    except Exception as e:
        logger.error(f"Failed to send activation email to {user.email}: {str(e)}\n{traceback.format_exc()}")


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user (Employee or Employer).

    Expected payload for Employee:
        {
            "role": "employee",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "secret",
            "national_id": "1234567890",
            "city": "Riyadh"
        }

    Expected payload for Employer:
        {
            "role": "employer",
            "first_name": "Acme",
            "last_name": "Inc",
            "email": "hr@acme.com",
            "password": "secret",
            "company_name": "Acme Corporation"
        }
    """
    data = request.data
    role = str(data.get('role', '')).lower()

    if role not in ["employee", "employer"]:
        return Response({"error": "Role must be either 'employee' or 'employer'."}, status=status.HTTP_400_BAD_REQUEST)

    common_required = ["first_name", "last_name", "email", "password"]
    missing_common = [f for f in common_required if f not in data or data[f] in ["", None]]

    if role == "employee":
        specific_required = ["national_id", "city"]
    else: 
        specific_required = ["company_name"]

    missing_specific = [f for f in specific_required if f not in data or data[f] in ["", None]]

    if missing_common or missing_specific:
        return Response(
            {"error": f"Missing required fields: {', '.join(missing_common + missing_specific)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.create(
            username=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            password=make_password(data["password"]),
            is_active=False,
        )

        if role == "employee":
            Employee.objects.create(
                user=user,
                national_id=data["national_id"],
                city=data["city"],
            )
        else:
            from django.utils import timezone 
            Employer.objects.create(
                user=user,
                company_name=data["company_name"],
                created_at=timezone.now(),
            )

        send_activation_email(user, request)
        return Response({"message": "User registered successfully. Please check your email to activate the account."}, status=201)

    except Exception as e:
        logger.error(f"Error in register_user: {str(e)}\n{traceback.format_exc()}")
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def activate_user(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        logger.error(f"Activation error: {str(e)}")
        return Response(
            {'error': 'Activation link is invalid or has expired'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if user is not None and default_token_generator.check_token(user, token):
        if user.is_active:
            return Response(
                {'message': 'Account is already activated'}, 
                status=status.HTTP_200_OK
            )
        
        user.is_active = True
        user.save()
        
        
        try:
            employer = Employer.objects.get(user=user)
            employer.verified = True
            employer.save()
        except Employer.DoesNotExist:
            pass
            
        return Response(
            {'message': 'Account activated successfully'}, 
            status=status.HTTP_200_OK
        )
    
    return Response(
        {'error': 'Activation link is invalid or has expired'}, 
        status=status.HTTP_400_BAD_REQUEST
    )


class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request, *args, **kwargs):
        try:
            employer = Employer.objects.get(user=request.user)
            partial = request.method == 'PATCH'
            serializer = EmployerUpdateSerializer(
                employer, 
                data=request.data, 
                partial=partial
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(EmployerSerializer(employer).data)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Employer.DoesNotExist:
            return Response(
                {"error": "Employer profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    def get_object(self):
        if 'me' in self.request.path:
            return self.get_queryset().get(user=self.request.user)
        return super().get_object()
        
    def retrieve(self, request, *args, **kwargs):
        if 'me' in request.path:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return super().retrieve(request, *args, **kwargs)