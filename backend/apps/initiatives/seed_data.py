import os
import sys
import django
from decimal import Decimal
from django.utils import timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.initiatives.models import (
    Initiative,
    InitiativeBreakdownItem,
    InitiativeUpdate,
    InitiativeExpense,
    InitiativeAuditLog
)

def run_seed():
    print("Seeding Initiatives...")

    # 1. Vijayawada Gopuram & Temple Construction
    init1, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0001",
        defaults={
            "title": "Sri Vasavi Maha Gopuram & Temple Construction",
            "short_title": "Vijayawada Maha Gopuram",
            "initiative_type": "TEMPLE_CONSTRUCTION",
            "description": "Grand construction of a 7-tier traditional Dravidian style Rajagopuram and dedicated inner sanctum for Sri Vasavi Kanyaka Parameswari Matha in Vijayawada. Designed by traditional Shilpis conforming strictly to Agama Shastras.",
            "objective": "Erect a 63-foot sacred Rajagopuram with gold-gilded Kalashams, sanctum vimana, and marble parikrama for 5,000 pilgrims daily.",
            "priority": "HIGH",
            "is_urgent": False,
            "address": "Indrakeeladri Foothills, Canal Road",
            "city": "Vijayawada",
            "district": "NTR District",
            "state": "Andhra Pradesh",
            "pin_code": "520001",
            "has_physical_location": True,
            "latitude": Decimal("16.516700"),
            "longitude": Decimal("80.616700"),
            "target_amount": Decimal("5000000.00"),
            "current_raised": Decimal("3450000.00"),
            "donor_count": 428,
            "min_donation": Decimal("100.00"),
            "suggested_amounts": [501, 1001, 2501, 5001, 10001, 25001],
            "start_date": timezone.now() - timezone.timedelta(days=120),
            "end_date": timezone.now() + timezone.timedelta(days=245),
            "cover_image": "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80",
            "gallery_images": [
                "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80"
            ],
            "documents": [
                {"name": "Architectural Agamic Plan.pdf", "size": "4.2 MB", "type": "PDF Blueprint"},
                {"name": "Structural Engineering Assessment.pdf", "size": "2.8 MB", "type": "Government Approval"}
            ],
            "current_stage": "STRUCTURE",
            "status": "PUBLISHED",
            "excess_funds_policy": "Any excess contributions above ₹50 Lakhs will be transferred to the permanent Nitya Deeparadhana and Annadanam Endowment Corpus."
        }
    )

    if created:
        InitiativeBreakdownItem.objects.create(initiative=init1, category="Bhoomi Pooja & Deep Foundation", target_amount=Decimal("800000.00"), description="Reinforced stone foundation and Vedic consecration", order=0)
        InitiativeBreakdownItem.objects.create(initiative=init1, category="Gopuram Stone Carving & Pillars", target_amount=Decimal("2200000.00"), description="Granite stone carving by Master Sculptors from Kanchipuram", order=1)
        InitiativeBreakdownItem.objects.create(initiative=init1, category="Gold-Gilded Kalasham & Vimanam", target_amount=Decimal("1200000.00"), description="7 Brass Kalashams plated with 24K gold foil", order=2)
        InitiativeBreakdownItem.objects.create(initiative=init1, category="Prakaram Marble Flooring & Electrification", target_amount=Decimal("800000.00"), description="Cooling Makrana marble and architectural devotional lighting", order=3)

        InitiativeUpdate.objects.create(
            initiative=init1,
            title="Tier-4 Granite Pillars Installed Successfully",
            message="With the grace of Sri Vasavi Matha, all 16 monolithic carved granite pillars for Tier 4 were safely hoisted and locked by master artisans today.",
            images=["https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80"]
        )

        InitiativeExpense.objects.create(
            initiative=init1,
            category="Granite Stone Materials",
            amount=Decimal("650000.00"),
            description="Procurement of Phase-2 Krishna district black granite blocks",
            invoice_ref="INV-BLG-2026-088",
            expense_date=timezone.now().date() - timezone.timedelta(days=20),
            status="APPROVED"
        )
        InitiativeExpense.objects.create(
            initiative=init1,
            category="Sculptor Artisan Dakshina",
            amount=Decimal("420000.00"),
            description="Milestone payment for 12 artisan sculptors on Tier-3 iconography",
            invoice_ref="VCH-ART-2026-104",
            expense_date=timezone.now().date() - timezone.timedelta(days=10),
            status="APPROVED"
        )

    # 2. Penugonda Matha Renovation
    init2, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0002",
        defaults={
            "title": "Penugonda Sri Vasavi Matha Moola Sthana Renovation",
            "short_title": "Penugonda Heritage Renovation",
            "initiative_type": "TEMPLE_RENOVATION",
            "description": "Comprehensive conservation and heritage renovation of the sanctum sanctorum at the sacred birthplace and Moola Sthanam of Sri Vasavi Kanyaka Parameswari Matha in Penugonda, West Godavari.",
            "objective": "Preserve 1,000-year-old historic stone architecture, restore teak wood carvings, and modernize rainwater drainage without altering sacred antiquity.",
            "priority": "HIGH",
            "is_urgent": False,
            "address": "Moola Sthana Devasthanam, Temple Street",
            "city": "Penugonda",
            "district": "West Godavari",
            "state": "Andhra Pradesh",
            "pin_code": "534320",
            "has_physical_location": True,
            "latitude": Decimal("16.666700"),
            "longitude": Decimal("81.733300"),
            "target_amount": Decimal("2500000.00"),
            "current_raised": Decimal("1925000.00"),
            "donor_count": 312,
            "min_donation": Decimal("100.00"),
            "suggested_amounts": [501, 1001, 2116, 5001, 11116],
            "start_date": timezone.now() - timezone.timedelta(days=90),
            "end_date": timezone.now() + timezone.timedelta(days=120),
            "cover_image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
            "current_stage": "STRUCTURE",
            "status": "PUBLISHED",
        }
    )

    if created:
        InitiativeBreakdownItem.objects.create(initiative=init2, category="Sacred Teak Wood Carving Restoration", target_amount=Decimal("900000.00"), description="Burma teak preservation & organic herbal polishing", order=0)
        InitiativeBreakdownItem.objects.create(initiative=init2, category="Sub-Surface Water Barrier & Drainage", target_amount=Decimal("700000.00"), description="Preventing dampness in ancient sanctum foundations", order=1)
        InitiativeBreakdownItem.objects.create(initiative=init2, category="Copper Conduit Vedic Lighting", target_amount=Decimal("500000.00"), description="Concealed heritage electrical safety upgrades", order=2)
        InitiativeBreakdownItem.objects.create(initiative=init2, category="Silver Door Foil Replating", target_amount=Decimal("400000.00"), description="Replating 99.9% fine silver door cladding", order=3)

    # 3. Nitya Annadanam Bhavan
    init3, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0003",
        defaults={
            "title": "Nitya Annadanam Bhavan & Pilgrim Mega Kitchen",
            "short_title": "Annadanam Mega Kitchen",
            "initiative_type": "ANNADANAM",
            "description": "Establishment of a modern eco-friendly solar-powered mega kitchen capable of serving wholesome satvik meals to 10,000 devotees and hungry pilgrims every single day.",
            "objective": "Zero hunger for any devotee visiting Sri Vasavi Matha shrines, with fully automated roti makers, steam boilers, and hygienic stainless steel dining.",
            "priority": "URGENT",
            "is_urgent": True,
            "address": "Arya Vysya Pilgrim Complex, Ring Road",
            "city": "Penugonda",
            "district": "West Godavari",
            "state": "Andhra Pradesh",
            "pin_code": "534320",
            "has_physical_location": True,
            "latitude": Decimal("16.671000"),
            "longitude": Decimal("81.738000"),
            "target_amount": Decimal("3500000.00"),
            "current_raised": Decimal("2890000.00"),
            "donor_count": 645,
            "min_donation": Decimal("50.00"),
            "suggested_amounts": [251, 501, 1001, 2501, 5001, 10001],
            "start_date": timezone.now() - timezone.timedelta(days=60),
            "end_date": timezone.now() + timezone.timedelta(days=90),
            "cover_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
            "current_stage": "FINISHING",
            "status": "PUBLISHED",
        }
    )

    # 4. Vidya Nidhi Scholarships
    init4, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0004",
        defaults={
            "title": "Sri Vasavi Vidya Nidhi Merit & Higher Education Scholarship",
            "short_title": "Vidya Nidhi Scholarship 2026",
            "initiative_type": "SCHOLARSHIPS",
            "description": "Annual scholarship fund providing financial assistance to deserving and underprivileged students from the Arya Vysya community pursuing Engineering, Medicine, CA, and IAS examinations.",
            "objective": "Sponsor complete tuition fees, books, and laptops for 200 meritorious students for the academic year 2026-27.",
            "priority": "HIGH",
            "is_urgent": False,
            "address": "Vasavi Educational Trust Central Secretariat",
            "city": "Hyderabad",
            "district": "Hyderabad",
            "state": "Telangana",
            "pin_code": "500001",
            "has_physical_location": False,
            "target_amount": Decimal("2000000.00"),
            "current_raised": Decimal("1420000.00"),
            "donor_count": 280,
            "min_donation": Decimal("500.00"),
            "suggested_amounts": [1001, 2501, 5001, 10001, 25001],
            "start_date": timezone.now() - timezone.timedelta(days=30),
            "end_date": timezone.now() + timezone.timedelta(days=60),
            "cover_image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
            "current_stage": "STRUCTURE",
            "status": "PUBLISHED",
        }
    )

    # 5. Vasavi Arogya Mobile Healthcare
    init5, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0005",
        defaults={
            "title": "Vasavi Arogya Seva Mobile Clinic & Free Dialysis Center",
            "short_title": "Arogya Seva Mobile Clinic",
            "initiative_type": "MEDICAL_ASSISTANCE",
            "description": "Procurement of 2 state-of-the-art mobile healthcare vans and setup of 4 free dialysis machines for rural families and elderly devotees suffering from renal disorders.",
            "objective": "Deliver free preventive screening, medication, and dialysis to 15,000 rural residents annually.",
            "priority": "URGENT",
            "is_urgent": True,
            "address": "Vasavi Hospital Complex",
            "city": "Guntur",
            "district": "Guntur",
            "state": "Andhra Pradesh",
            "pin_code": "522002",
            "has_physical_location": True,
            "latitude": Decimal("16.306700"),
            "longitude": Decimal("80.436500"),
            "target_amount": Decimal("4000000.00"),
            "current_raised": Decimal("3100000.00"),
            "donor_count": 510,
            "min_donation": Decimal("250.00"),
            "suggested_amounts": [501, 1001, 2501, 5001, 15001],
            "start_date": timezone.now() - timezone.timedelta(days=45),
            "end_date": timezone.now() + timezone.timedelta(days=75),
            "cover_image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
            "current_stage": "FINISHING",
            "status": "PUBLISHED",
        }
    )

    # 6. Cyclone Devotee Relief Fund
    init6, created = Initiative.objects.get_or_create(
        code="VD-INI-2026-0006",
        defaults={
            "title": "Coastal Andhra Devotee Emergency Cyclone & Flood Relief Fund",
            "short_title": "Emergency Cyclone Relief",
            "initiative_type": "EMERGENCY_RELIEF",
            "description": "Emergency rapid response relief fund providing dry rations, tarpaulins, drinking water, medical kits, and temporary shelter rehabilitation for devotee families affected by coastal storm surges.",
            "objective": "Distribute 5,000 emergency relief kits and rebuild roof structures for 150 damaged devotee homes within 30 days.",
            "priority": "URGENT",
            "is_urgent": True,
            "address": "Emergency Relief Camp, Port Road",
            "city": "Machilipatnam",
            "district": "Krishna",
            "state": "Andhra Pradesh",
            "pin_code": "521001",
            "has_physical_location": True,
            "latitude": Decimal("16.180000"),
            "longitude": Decimal("81.130000"),
            "target_amount": Decimal("1500000.00"),
            "current_raised": Decimal("1280000.00"),
            "donor_count": 390,
            "min_donation": Decimal("100.00"),
            "suggested_amounts": [501, 1001, 2001, 5001, 10001],
            "start_date": timezone.now() - timezone.timedelta(days=15),
            "end_date": timezone.now() + timezone.timedelta(days=20),
            "cover_image": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
            "current_stage": "STRUCTURE",
            "status": "PUBLISHED",
        }
    )

    print("Initiatives successfully seeded into database!")

if __name__ == '__main__':
    run_seed()
