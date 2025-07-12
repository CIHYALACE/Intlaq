from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import ProgrammingLanguage, Skill

# Create your models here.

# Custom User model
class User(AbstractUser):
    pass

    def __str__(self):
        return self.username

# Employee model
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    national_id = models.IntegerField(max_length=20, unique=True)
    city = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    programming_languages = models.ManyToManyField(ProgrammingLanguage, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.city}"

# Employer model
class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.company_name

