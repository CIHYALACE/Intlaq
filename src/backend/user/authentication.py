from rest_framework_simplejwt.views import TokenObtainPairView as BaseTokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Change 'username' to 'email' for authentication
        attrs['username'] = attrs.get('email', attrs.get('username', ''))
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['is_employer'] = hasattr(user, 'employer')
        return token

class EmailTokenObtainPairView(BaseTokenObtainPairView):
    """
    Custom token obtain view that uses email instead of username
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        # Make sure we're using email in the request data
        if 'email' in request.data and 'username' not in request.data:
            request.data['username'] = request.data['email']
        return super().post(request, *args, **kwargs)
