from django.db import models
from django.utils import timezone

APPLICATION_STATUS = (
    ('applied', 'Applied'),
    ('interviewed', 'Interviewed'),
    ('hired', 'Hired'),
    ('rejected', 'Rejected')
)

# Programing Language model
class ProgrammingLanguage(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
# Skill model
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# City model
class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

# Profile view model
class ProfileView(models.Model):
    employee = models.ForeignKey("user.Employee", on_delete=models.CASCADE)
    employer = models.ForeignKey("user.Employer", on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(default=timezone.now)

# Job model
class Job(models.Model):
    employer = models.ForeignKey("user.Employer", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    city = models.ForeignKey("core.City", on_delete=models.CASCADE , related_name='jobs')

    experience_level = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Application model
class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    employee = models.ForeignKey("user.Employee", on_delete=models.CASCADE)
    cover_letter = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    status = models.CharField(max_length=50, choices=APPLICATION_STATUS, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.user.username} - {self.job.title}"
