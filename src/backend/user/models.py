from timeit import default_timer
from django.db import models
from django.contrib.auth.models import AbstractUser


# Custom User model
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('employee', 'Employee'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=15, choices=USER_TYPE_CHOICES, default='employee')
    email = models.EmailField(unique=True)
    
    # Use email as the USERNAME_FIELD for authentication
    USERNAME_FIELD = 'email'
    # Remove email from REQUIRED_FIELDS since it's now the USERNAME_FIELD
    REQUIRED_FIELDS = ['username']
    
    @property
    def name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email

    def __str__(self):
        return self.email

# Employee model
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    national_id = models.BigIntegerField(unique=True)
    city = models.CharField(max_length=100)
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
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

