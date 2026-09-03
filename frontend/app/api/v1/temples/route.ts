import { NextResponse } from 'next/server';

// Temple Data Store
const DEFAULT_TEMPLES = [
  {
    id: 'tpl-penugonda-001',
    code: 'TPL-PENUGONDA',
    name: 'Sri Vasavi Kanyaka Parameswari Matha Temple',
    deity: 'Sri Vasavi Kanyaka Parameswari',
    description: 'The sacred, historical Mula Kshetram of Sri Vasavi Matha at Penugonda, West Godavari District, Andhra Pradesh.',
    history: 'Penugonda is the birthplace and sacred sanctum of Mother Sri Vasavi Kanyaka Parameswari, revered by the Arya Vysya community worldwide.',
    address: 'Main Temple Road, Penugonda',
    city: 'Penugonda',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    country: 'India',
    contact_phone: '+91 8819 246246',
    contact_email: 'trust@vasavitemple.org',
    website: 'https://vasavitemple.org',
    trust_name: 'Sri Vasavi Kanyaka Parameswari Devasthanam Trust',
    registration_no: 'REG-AP-1984-78921',
    tax_benefit_info: '80G Tax Exemption Eligible (URN: AAATV1234F20214)',
    logo_url: '/images/vasavi_goddess.png',
    banner_url: '/images/vasavi_goddess_hd.png',
    timings: 'Morning: 05:30 AM – 01:00 PM | Evening: 04:00 PM – 09:00 PM',
    verification_status: 'VERIFIED',
    is_active: true,
  },
  {
    id: 'tpl-tirupati-002',
    code: 'TPL-TIRUPATI',
    name: 'Sri Vasavi Dharmashala & Temple Complex',
    deity: 'Sri Vasavi Matha & Sri Venkateswara',
    description: 'Spiritual haven providing Nitya Annadanam, pilgrim lodging, and holy rituals for visiting devotees in Tirupati.',
    address: 'Near Railway Station, G. Car Street',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    pin_code: '517501',
    country: 'India',
    contact_phone: '+91 877 2223344',
    contact_email: 'tirupati@vasavitrust.org',
    trust_name: 'Arya Vysya Tirupati Pilgrims Trust',
    registration_no: 'REG-AP-1992-44102',
    tax_benefit_info: '80G Tax Exemption Eligible',
    timings: '06:00 AM – 09:30 PM',
    verification_status: 'VERIFIED',
    is_active: true,
  }
];

export async function GET() {
  return NextResponse.json(DEFAULT_TEMPLES, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTemple = {
      id: `tpl-${Date.now()}`,
      code: `TPL-${(body.name || 'TEMPLE').toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`,
      verification_status: 'VERIFIED',
      is_active: true,
      ...body,
    };
    return NextResponse.json(newTemple, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
