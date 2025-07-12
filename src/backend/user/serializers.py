from rest_framework import serializers
from .models import Employee, Employer

# Serializer for Employee model
class EmployeeSerializer(serializers.ModelSerializer):
    programming_languages = serializers.StringRelatedField(many=True)
    skills = serializers.StringRelatedField(many=True)
    class Meta:
        model = Employee
        fields = ['id', 'user', 'resume', 'skills', 'experience_level', 'education', 'programming_languages']
        read_only_fields = ['user']

# Serializer for Employer model
class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ['id', 'user', 'company_name', 'created_at']
        read_only_fields = ['user']
