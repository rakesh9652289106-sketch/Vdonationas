import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    donation_id: id,
    donor_name: 'Devotee Radha Krishna',
    donor_email: 'devotee@gmail.com',
    donor_phone: '9123456789',
    amount: 1001.0,
    payment_method: 'UPI',
    transaction_id: 'TXN-PG-489123',
    status: 'SUCCESS',
    category_name: 'Nitya Annadanam Seva',
    temple_name: 'Sri Vasavi Kanyaka Parameswari Matha Temple',
    created_at: new Date().toISOString(),
  });
}
