from django.core.management.base import BaseCommand
from core.models import ProgrammingLanguage, Skill

class Command(BaseCommand):
    help = 'Seed Programming Languages and Skills'

    def handle(self, *args, **kwargs):
        programming_languages = [
            'Python', 'JavaScript', 'Java', 'C++', 'Go', 'Ruby'
        ]
        skills = [
            'Django', 'React', 'SQL', 'Node.js', 'AWS', 'Docker',
            'Kubernetes', 'Git', 'Problem Solving', 'Communication',
            'Teamwork', 'Leadership'
        ]

        for lang in programming_languages:
            ProgrammingLanguage.objects.get_or_create(name=lang)

        for skill in skills:
            Skill.objects.get_or_create(name=skill)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(programming_languages)} ProgrammingLanguages and {len(skills)} Skills."
        ))
