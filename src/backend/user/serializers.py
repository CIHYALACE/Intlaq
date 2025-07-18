from rest_framework import serializers
from .models import Employee, Employer
from core.models import ProgrammingLanguage, Skill

class ProgrammingLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingLanguage
        fields = ['id', 'name']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    programming_languages = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProgrammingLanguage.objects.all(),
        required=False
    )
    skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        required=False
    )
    
    class Meta:
        model = Employee
        fields = [
            'bio', 'city', 'experience_level', 'programming_languages',
            'skills', 'education', 'phone_number', 'profile_picture'
        ]
        extra_kwargs = {
            'profile_picture': {'required': False}
        }

class EmployerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ['company_name']

# Existing serializers (keep these for other views)
class EmployeeSerializer(serializers.ModelSerializer):
    programming_languages = ProgrammingLanguageSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = ['id', 'user', 'resume', 'skills', 'experience_level', 
                 'education', 'programming_languages', 'bio', 'city', 'phone_number']
        read_only_fields = ['user']

class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ['id', 'user', 'company_name', 'created_at', 'verified']
        read_only_fields = ['user', 'created_at', 'verified']
