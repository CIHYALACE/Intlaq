from timeit import default_timer
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


EXPERIENCE_LEVEL_CHOICES = [
    ('intern', 'Intern'),
    ('junior', 'Junior'),
    ('mid-level', 'Mid-level'),
    ('senior', 'Senior'),
    ('expert', 'Expert'),
]

egypt_id_validator = RegexValidator(
    regex=r'^(2|3)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{7}$',
    message="Enter a valid 14-digit Egyptian National ID."
)

egypt_phone_validator = RegexValidator(
    regex=r'^01[0125][0-9]{8}$',
    message="Enter a valid 11-digit Egyptian mobile number starting with 010, 011, 012, or 015."
)

# Employee model
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    national_id = models.BigIntegerField(unique=True, validators=[egypt_id_validator])
    city = models.ForeignKey('core.City', on_delete=models.CASCADE, related_name='employees')
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
    city = models.ForeignKey('core.City', on_delete=models.CASCADE, related_name='employers')
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

