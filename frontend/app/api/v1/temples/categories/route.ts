import { NextResponse } from 'next/server';

const DEFAULT_CATEGORIES = [
  {
    id: 'cat-001',
    name: 'Nitya Annadanam Seva',
    description: 'Provide sacred food and nourishment to visiting devotees and pilgrims daily.',
    icon: 'Utensils',
    is_active: true,
  },
  {
    id: 'cat-002',
    name: 'Nitya Pooja & Kumkuma Archana',
    description: 'Sponsor daily sacred archana, abhishekam, and sacred offering rituals.',
    icon: 'Flame',
    is_active: true,
  },
  {
    id: 'cat-003',
    name: 'Temple Raja Gopuram & Development',
    description: 'Support the expansion, marble mandapam, and spiritual infrastructure of the temple sanctum.',
    icon: 'Building',
    is_active: true,
  },
  {
    id: 'cat-004',
    name: 'Gomatha Protection & Goshala Seva',
    description: 'Care, medical aid, and green fodder for sacred cows in the temple Goshala.',
    icon: 'Heart',
    is_active: true,
  },
  {
    id: 'cat-005',
    name: 'Veda Pathashala & Vidya Daanam',
    description: 'Educational scholarship and Vedic studies for young scholars and students in need.',
    icon: 'BookOpen',
    is_active: true,
  },
];

export async function GET() {
  return NextResponse.json(DEFAULT_CATEGORIES, { status: 200 });
}
