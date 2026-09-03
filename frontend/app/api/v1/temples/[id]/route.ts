import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    code: 'TPL-PENUGONDA',
    name: 'Sri Vasavi Kanyaka Parameswari Matha Temple',
    deity: 'Sri Vasavi Kanyaka Parameswari',
    description: 'The sacred, historical Mula Kshetram of Sri Vasavi Matha at Penugonda, West Godavari District, Andhra Pradesh.',
    address: 'Main Temple Road, Penugonda',
    city: 'Penugonda',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    contact_phone: '+91 8819 246246',
    contact_email: 'trust@vasavitemple.org',
    trust_name: 'Sri Vasavi Kanyaka Parameswari Devasthanam Trust',
    registration_no: 'REG-AP-1984-78921',
    tax_benefit_info: '80G Tax Exemption Eligible (URN: AAATV1234F20214)',
    timings: 'Morning: 05:30 AM – 01:00 PM | Evening: 04:00 PM – 09:00 PM',
    verification_status: 'VERIFIED',
    is_active: true,
  });
}
