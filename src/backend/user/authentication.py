from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView as BaseTokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_model = get_user_model()
        self.fields['email'] = serializers.EmailField(required=True)
        self.fields['password'] = serializers.CharField(required=True, write_only=True)
        # Remove the default username field
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError({
                "email": "Email is required.",
                "password": "Password is required."
            })
        
        # Find user by email
        try:
            user = self.user_model.objects.get(email=email)
        except self.user_model.DoesNotExist:
            raise serializers.ValidationError({"email": "No user found with this email address."})
        
        # Verify password
        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password."})
        
        # Set username for the parent class validation
        attrs['username'] = user.username
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_employer'] = hasattr(user, 'employer')
        return token

class EmailTokenObtainPairView(BaseTokenObtainPairView):
    """
    Custom token obtain view that uses email instead of username for authentication.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        # The serializer will handle the email field directly
        return super().post(request, *args, **kwargs)
