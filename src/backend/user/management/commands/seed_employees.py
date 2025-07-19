from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import ProgrammingLanguage, Skill, City
from user.models import Employee
from faker import Faker
import random
import re

fake = Faker()

# Define experience level choices as they appear in your model
EXPERIENCE_LEVEL_CHOICES = [
    ('intern', 'Intern'),
    ('junior', 'Junior'),
    ('mid-level', 'Mid-level'),
    ('senior', 'Senior'),
    ('expert', 'Expert'),
]

class Command(BaseCommand):
    help = 'Seed 50 fake Employees with valid Egyptian data'

    def generate_valid_egyptian_national_id(self):
        """Generate national ID matching the exact regex pattern"""
        while True:
            century = random.choice(['2', '3'])
            year = f"{random.randint(0, 99):02d}"
            month = f"{random.randint(1, 12):02d}"
            day = f"{random.randint(1, 31):02d}"
            random_digits = f"{random.randint(0, 9999999):07d}"
            national_id = f"{century}{year}{month}{day}{random_digits}"
            
            if re.match(r'^(2|3)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{7}$', national_id):
                return national_id

    def generate_valid_egyptian_phone_number(self):
        """Generate phone number matching the exact regex pattern"""
        prefixes = ['010', '011', '012', '015']
        while True:
            prefix = random.choice(prefixes)
            number = f"{prefix}{random.randint(0, 99999999):08d}"  # Ensure 8 digits after prefix
            if re.match(r'^01[0125][0-9]{8}$', number):
                return number

    def handle(self, *args, **kwargs):
        # Check prerequisites
        programming_languages = list(ProgrammingLanguage.objects.all())
        skills = list(Skill.objects.all())
        cities = list(City.objects.all())

        if not programming_languages or not skills or not cities:
            self.stdout.write(self.style.ERROR(
                "Run `seed_basics` first to create programming languages, skills, and cities."
            ))
            return

        for _ in range(50):
            # Generate valid credentials
            national_id = self.generate_valid_egyptian_national_id()
            phone_number = self.generate_valid_egyptian_phone_number()

            # Create user
            username = fake.unique.user_name()
            email = fake.unique.email()
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password="12345678"
            )

            # Create employee
            employee = Employee.objects.create(
                user=user,
                national_id=national_id,
                city=random.choice(cities),
                bio=fake.paragraph(),
                phone_number=phone_number,
                experience_level=random.choice([x[0] for x in EXPERIENCE_LEVEL_CHOICES]),
                education=fake.sentence(nb_words=10),
            )

            # Add random skills
            employee.programming_languages.set(
                random.sample(programming_languages, random.randint(1, 3))
            )
            employee.skills.set(
                random.sample(skills, random.randint(3, 5))
            )

        self.stdout.write(self.style.SUCCESS(
            "Successfully created 50 fake Employees with valid Egyptian data:\n"
            "- National IDs matching: ^(2|3)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{7}$\n"
            "- Phone numbers matching: ^01[0125][0-9]{8}$"
        ))