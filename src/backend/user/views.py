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
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Employee, Employer, User
from .serializers import EmployeeSerializer, EmployerSerializer, EmployeeUpdateSerializer, EmployerUpdateSerializer, MyTokenObtainPairSerializer
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
                employee = serializer.save()
                
                if 'programming_languages' in request.data:
                    employee.programming_languages.set(request.data['programming_languages'])
                
                if 'skills' in request.data:
                    employee.skills.set(request.data['skills'])
                
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


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
                    <p>Hi {user.first_name},</p>
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
    try:
        logger.info(f"Registration request received. Data: {request.data}")
        data = request.data
        role = str(data.get('role', '')).lower()

        logger.info(f"Processing registration for role: {role}")

        # Validate role
        if role not in ["employee", "employer"]:
            error_msg = f"Invalid role: {role}. Must be either 'employee' or 'employer'."
            logger.warning(error_msg)
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email already exists
        email = data.get('email')
        if User.objects.filter(email=email).exists():
            error_msg = f"User with email {email} already exists."
            logger.warning(error_msg)
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

        # Validate required fields
        common_required = ["first_name", "last_name", "email", "password"]
        role_specific_required = {
            "employee": ["national_id", "city"],
            "employer": ["company_name"]
        }
        
        required_fields = common_required + role_specific_required.get(role, [])
        missing_fields = [f for f in required_fields if not data.get(f)]
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.warning(error_msg)
            return Response(
                {"error": error_msg, "missing_fields": missing_fields},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        logger.info(f"Creating user with email: {email}")
        user = User.objects.create_user(
            username=email,
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=email,
            password=data["password"],
            is_active=False,
        )

        # Create profile based on role
        if role == "employee":
            logger.info(f"Creating employee profile for user: {user.id}")
            Employee.objects.create(
                user=user,
                national_id=data["national_id"],
                city_id=data["city"]  # City is required for employees
            )
        elif role == "employer":
            logger.info(f"Creating employer profile for user: {user.id}")
            employer_data = {
                "user": user,
                "company_name": data["company_name"].strip(),
            }
            # Add city only if provided (optional for employers)
            if "city" in data and data["city"]:
                employer_data["city_id"] = data["city"]
                
            Employer.objects.create(**employer_data)

        # Send activation email
        logger.info(f"Sending activation email to: {email}")
        send_activation_email(user, request)
        
        logger.info(f"Successfully registered user: {email}")
        return Response(
            {"message": "User registered successfully. Please check your email to activate your account."},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        error_msg = f"Error in register_user: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return Response(
            {"error": "An error occurred during registration. Please try again.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        return Response({"error": str(e)}, status=400)


from django.shortcuts import redirect
from django.conf import settings

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def activate_user(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        logger.error(f"Activation error: {str(e)}")
        frontend_url = f"{settings.FRONTEND_BASE_URL}/activate/?status=error&message=Activation link is invalid or has expired"
        return redirect(frontend_url)

    if user is not None and default_token_generator.check_token(user, token):
        if user.is_active:
            frontend_url = f"{settings.FRONTEND_BASE_URL}/activate/?status=already_active"
            return redirect(frontend_url)
        
        user.is_active = True
        user.save()
        
        try:
            employer = Employer.objects.get(user=user)
            employer.verified = True
            employer.save()
        except Employer.DoesNotExist:
            pass
            
        frontend_url = f"{settings.FRONTEND_BASE_URL}/activate/?status=success"
        return redirect(frontend_url)
    
    frontend_url = f"{settings.FRONTEND_BASE_URL}/activate/?status=error&message=Activation link is invalid or has expired"
    return redirect(frontend_url)


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