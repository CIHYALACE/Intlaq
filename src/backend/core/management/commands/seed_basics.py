from django.core.management.base import BaseCommand
from core.models import ProgrammingLanguage, Skill, City

class Command(BaseCommand):
    help = 'Seed basic data (cities, programming languages, skills)'

    def handle(self, *args, **kwargs):
        # Egyptian cities
        egyptian_cities = [
            'Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said',
            'Suez', 'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Tanta',
            'Asyut', 'Ismailia', 'Faiyum', 'Zagazig', 'Aswan',
            'Damietta', 'Damanhur', 'Minya', 'Beni Suef', 'Qena'
        ]
        
        # Programming Languages
        programming_languages = [
            'Python', 'JavaScript', 'Java', 'C++', 'Go', 'Ruby', 'TypeScript',
            'PHP', 'Swift', 'Kotlin', 'Rust', 'C#'
        ]
        
        # Skills
        skills = [
            'Django', 'React', 'SQL', 'Node.js', 'AWS', 'Docker',
            'Kubernetes', 'Git', 'Problem Solving', 'Communication',
            'Teamwork', 'Leadership', 'REST API', 'GraphQL', 'MongoDB',
            'PostgreSQL', 'Machine Learning', 'Data Analysis'
        ]

        # Create records
        for city in egyptian_cities:
            City.objects.get_or_create(name=city)
        
        for lang in programming_languages:
            ProgrammingLanguage.objects.get_or_create(name=lang)
            
        for skill in skills:
            Skill.objects.get_or_create(name=skill)

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded:\n"
            f"- {len(egyptian_cities)} Egyptian Cities\n"
            f"- {len(programming_languages)} Programming Languages\n"
            f"- {len(skills)} Skills"
        ))