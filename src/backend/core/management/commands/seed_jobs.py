from django.core.management.base import BaseCommand
from core.models import City, Job
from user.models import Employer
from faker import Faker
import random

fake = Faker()

EXPERIENCE_LEVELS = ['intern', 'junior', 'mid-level', 'senior', 'expert']

class Command(BaseCommand):
    help = 'Seed 50 fake Jobs with valid data'

    def handle(self, *args, **kwargs):
        # Check prerequisites
        employers = list(Employer.objects.all())
        cities = list(City.objects.all())
        
        if not employers or not cities:
            self.stdout.write(self.style.ERROR(
                "Run `seed_basics` and `seed_employers` first to create cities and employers."
            ))
            return

        # Common job titles by category
        job_titles = {
            'tech': [
                'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
                'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
                'Mobile Developer', 'QA Engineer', 'Software Architect'
            ],
            'business': [
                'Business Analyst', 'Project Manager', 'Product Manager',
                'Marketing Specialist', 'Sales Executive', 'HR Manager'
            ]
        }

        # Job descriptions templates
        descriptions = {
            'tech': "Looking for a {title} with {experience} experience in {skills}. "
                   "Requirements include {requirements}.",
            'business': "Seeking a {title} with {experience} experience. "
                      "Responsibilities include {responsibilities}."
        }

        for _ in range(50):
            employer = random.choice(employers)
            city = random.choice(cities)
            job_type = random.choice(['tech', 'business'])
            title = random.choice(job_titles[job_type])
            experience = random.choice(EXPERIENCE_LEVELS)
            
            # Generate appropriate description
            if job_type == 'tech':
                skills = random.sample(['Python', 'Django', 'JavaScript', 'React', 'AWS'], 3)
                requirements = random.sample([
                    'bachelor\'s degree in Computer Science',
                    '3+ years of relevant experience',
                    'strong problem-solving skills',
                    'experience with agile methodologies'
                ], 2)
                description = descriptions['tech'].format(
                    title=title,
                    experience=experience,
                    skills=', '.join(skills),
                    requirements=', '.join(requirements)
                )
            else:
                responsibilities = random.sample([
                    'managing team projects',
                    'analyzing business metrics',
                    'developing marketing strategies',
                    'coordinating between departments'
                ], 3)
                description = descriptions['business'].format(
                    title=title,
                    experience=experience,
                    responsibilities=', '.join(responsibilities)
                )

            # Create job
            Job.objects.create(
                employer=employer,
                title=title,
                description=description,
                city=city,
                experience_level=experience
            )

        self.stdout.write(self.style.SUCCESS(
            "Successfully created 50 fake Jobs with realistic data."
        ))