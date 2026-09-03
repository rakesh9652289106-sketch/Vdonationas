import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'sub-1',
      subscription_id: 'SUB-AUTOPAY-89102',
      devotee_name: 'Radha Krishna',
      amount: 501.0,
      interval: 'MONTHLY',
      next_deduction_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE',
      temple_name: 'Sri Vasavi Kanyaka Parameswari Matha Temple',
      category_name: 'Nitya Annadanam Seva',
    }
  ], { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subId = `SUB-AUTOPAY-${Math.floor(10000 + Math.random() * 90000)}`;
    const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newSub = {
      id: `sub-${Date.now()}`,
      subscription_id: subId,
      next_deduction_date: nextDate,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      ...body,
    };

    return NextResponse.json(newSub, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create autopay subscription' }, { status: 400 });
  }
}
