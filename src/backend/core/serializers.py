from rest_framework import serializers
from .models import ProfileView, Job, Application, ProgrammingLanguage
from user.models import User, Employee

# Serializer for ProgrammingLanguage model
class ProgrammingLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingLanguage
        fields = ['id', 'name']

# Serializer for ProfileView model
class ProfileViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileView
        fields = ['id', 'employee', 'employer', 'viewed_at']
        read_only_fields = ['viewed_at']

# Serializer for Job model
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'employer', 'title', 'description', 'city', 'experience_level', 'created_at']
        read_only_fields = ['created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']

# Serializer for Employee model
class EmployeeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    programming_languages = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'national_id', 'city', 'bio', 'phone_number', 
            'experience_level', 'programming_languages', 'skills', 
            'resume', 'education', 'profile_picture', 'created_at'
        ]
        
    def get_user(self, obj):
        user = obj.user
        return {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role
        }
        
    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]
    
    def get_programming_languages(self, obj):
        return [lang.name for lang in obj.programming_languages.all()]

# Serializer for Application model
class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    employee_email = serializers.EmailField(source='employee.user.email', read_only=True)
  
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'employee', 'employee_email', 'cover_letter', 'resume', 'status', 'applied_at']
        read_only_fields = ['applied_at']
        extra_kwargs = {
            'job': {'write_only': True, 'required': False},
            'employee': {'write_only': True, 'required': False},
        }
