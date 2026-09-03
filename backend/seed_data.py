import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.temples.models import Temple, DonationCategory, Campaign

def seed():
    print("Clearing other temples...")
    # Delete any temple that is not Penugonda
    deleted_count, _ = Temple.objects.exclude(code='TPL-VASAVI-01').delete()
    if deleted_count:
        print(f"Removed {deleted_count} non-Penugonda temple records.")

    print("Seeding Sri Vasavi Kanyaka Parameswari Matha Penugonda...")
    temple1, created = Temple.objects.get_or_create(
        code='TPL-VASAVI-01',
        defaults={
            'name': 'Sri Vasavi Kanyaka Parameswari Matha',
            'deity': 'Sri Vasavi Kanyaka Parameswari Ammavaru',
            'description': 'Sacred shrine and international headquarters of Sri Vasavi Matha at Penugonda.',
            'history': 'Originating from Penugonda, Andhra Pradesh, Sri Vasavi Matha sacrificed her mortal form to uphold righteousness, peace, and community dignity.',
            'address': 'Penugonda Devasthanam, West Godavari',
            'city': 'Penugonda',
            'state': 'Andhra Pradesh',
            'pin_code': '534320',
            'country': 'India',
            'contact_phone': '+91 8819 246789',
            'contact_email': 'seva@vasavimatha.org',
            'trust_name': 'Sri Vasavi Kanyaka Parameswari Temple Trust',
            'registration_no': 'REG-AP-1082/2021',
            'tax_benefit_info': '80G Registered Trust (URN: AAATV1234F20214)',
            'logo_url': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
            'banner_url': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
            'verification_status': 'VERIFIED',
            'is_active': True,
        }
    )

    if created:
        print(f"Created Temple: {temple1.name}")

    categories = [
        ('Annadanam Seva', 'Offer daily food to visiting pilgrims', '🪔'),
        ('Pushpa Seva', 'Offer scented flowers to Goddess Vasavi Matha', '🌺'),
        ('Matha Development', 'Support temple expansion and gopuram gilding', '🛕'),
        ('Pooja Seva', 'Daily Archana and Kumkumarchana', '📿'),
        ('Community Development', 'Arya Vysya youth skills & micro-grants', '🏛️'),
        ('Education', 'Scholarships and hostel facilities', '📚'),
        ('Social Service', 'Free medical camps and senior care', '🏥'),
    ]

    for cat_name, desc, icon in categories:
        c, c_created = DonationCategory.objects.get_or_create(
            temple=temple1,
            name=cat_name,
            defaults={'description': desc, 'icon': icon, 'is_active': True}
        )
        if c_created:
            print(f"Created Category: {cat_name}")

    print("Data seeding completed successfully! Only Sri Vasavi Kanyaka Parameswari Matha, Penugonda is active.")

if __name__ == '__main__':
    seed()
