from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import ProgrammingLanguage, Skill
from user.models import User, Employee
from faker import Faker
import random

fake = Faker()
prefixes = ['010', '012', '011', '015']
prefix = random.choice(prefixes)

phone_number = prefix + str(random.randint(1000000, 9999999))
phone_number = phone_number[:15]


class Command(BaseCommand):
    help = 'Seed 50 fake Employees'

    def handle(self, *args, **kwargs):
        programming_languages = list(ProgrammingLanguage.objects.all())
        skills = list(Skill.objects.all())

        if not programming_languages or not skills:
            self.stdout.write(self.style.ERROR("Run `seed_basics` first to create programming languages and skills."))
            return

        for _ in range(50):
            username = fake.unique.user_name()
            email = fake.unique.email()

            user = User.objects.create_user(username=username, email=email)
            user.set_password("12345678")
            user.save()

            employee = Employee.objects.create(
                user=user,
                national_id=fake.unique.random_int(min=10000000000000, max=99999999999999),
                city=fake.city(),
                bio=fake.paragraph(),
                phone_number=phone_number,
                experience_level=random.choice(['Junior', 'Mid', 'Senior']),
                education=fake.sentence(nb_words=10),
            )

            employee.programming_languages.set(random.sample(programming_languages, random.randint(1, 3)))
            employee.skills.set(random.sample(skills, random.randint(1, 5)))

            employee.save()

        self.stdout.write(self.style.SUCCESS("Successfully created 50 fake Employees."))
