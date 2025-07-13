from django.contrib import admin
from .models import Employee, User, Employer

admin.site.register(Employee)
admin.site.register(User)
admin.site.register(Employer)
# Register your models here.
