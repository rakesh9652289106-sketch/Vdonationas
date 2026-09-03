import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'don-1',
      donation_id: 'DON-2026-89102',
      donor_name: 'Radha Krishna',
      donor_email: 'devotee@gmail.com',
      donor_phone: '9123456789',
      amount: 1001.0,
      payment_method: 'UPI',
      transaction_id: 'TXN-PG-489123',
      status: 'SUCCESS',
      category_name: 'Nitya Annadanam Seva',
      temple_name: 'Sri Vasavi Kanyaka Parameswari Matha Temple',
      created_at: new Date().toISOString(),
    }
  ], { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const donId = `DON-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const txId = `TXN-PG-${Math.floor(100000 + Math.random() * 900000)}`;
    const verifCode = `VRF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonation = {
      id: `don-${Date.now()}`,
      donation_id: donId,
      transaction_id: txId,
      verification_code: verifCode,
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
      ...body,
    };

    return NextResponse.json(newDonation, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 400 });
  }
}
