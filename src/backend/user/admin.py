from django.contrib import admin
from .models import Employee, Employer, City

admin.site.register(Employee)
# admin.site.register(User)
admin.site.register(Employer)
admin.site.register(City)

# Register your models here.
