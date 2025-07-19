from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import City
from user.models import Employer
from faker import Faker
import random

fake = Faker()

class Command(BaseCommand):
    help = 'Seed 10 fake Employers with valid Egyptian data'

    def handle(self, *args, **kwargs):
        # Check prerequisites
        cities = list(City.objects.all())
        
        if not cities:
            self.stdout.write(self.style.ERROR(
                "Run `seed_basics` first to create cities."
            ))
            return

        for _ in range(10):
            # Create user
            username = fake.unique.user_name()
            email = fake.unique.email()
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password="12345678"
            )

            # Create employer
            Employer.objects.create(
                user=user,
                company_name=fake.company(),
                city=random.choice(cities),
                verified=random.choice([True, False])
            )

        self.stdout.write(self.style.SUCCESS(
            "Successfully created 10 fake Employers with company data."
        ))