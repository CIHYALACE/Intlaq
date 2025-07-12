from rest_framework import serializers
from .models import Employee, Employer

# Serializer for Employee model
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'user', 'resume', 'skills', 'experience', 'education']
        read_only_fields = ['user']

# Serializer for Employer model
class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ['id', 'user', 'company_name', 'created_at']
        read_only_fields = ['user']
