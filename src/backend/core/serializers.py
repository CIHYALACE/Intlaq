from rest_framework import serializers
from .models import ProfileView, Job, Application, ProgrammingLanguage

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

# Serializer for Application model
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'job', 'employee', 'cover_letter', 'resume', 'status', 'applied_at']
        read_only_fields = ['applied_at']
