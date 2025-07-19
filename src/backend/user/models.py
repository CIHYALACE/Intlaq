from timeit import default_timer
from django.db import models
from django.contrib.auth.models import User

EXPERIENCE_LEVEL_CHOICES = [
    ('intern', 'Intern'),
    ('junior', 'Junior'),
    ('mid-level', 'Mid-level'),
    ('senior', 'Senior'),
    ('expert', 'Expert'),
]

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Employee model
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    national_id = models.BigIntegerField(unique=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='employees', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    programming_languages = models.ManyToManyField("core.ProgrammingLanguage", blank=True)
    skills = models.ManyToManyField("core.Skill", blank=True)
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
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='employers', null=True, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

