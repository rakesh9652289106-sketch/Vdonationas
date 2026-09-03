import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const upperCode = code.toUpperCase();
  return NextResponse.json({
    is_verified: true,
    verification_code: upperCode,
    receipt_no: `REC-80G-${upperCode}`,
    donor_name: 'Devotee Radha Krishna',
    amount: 1001.0,
    temple_name: 'Sri Vasavi Kanyaka Parameswari Matha',
    trust_name: 'Sri Vasavi Kanyaka Parameswari Temple Trust',
    status: 'VERIFIED',
    tax_benefit_info: '80G Registered Trust (URN: AAATV1234F20214)',
    issued_at: new Date().toISOString(),
  });
}
