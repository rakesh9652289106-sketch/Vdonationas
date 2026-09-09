import { Router, Request, Response } from 'express';
import { memoryStore } from '../db.js';

const router = Router();

// Default seed data for backend initiatives
const DEFAULT_INITIATIVES = [
  {
    id: 'ini-001',
    code: 'VD-INI-2026-0001',
    title: 'Sri Vasavi Maha Gopuram & Temple Construction',
    short_title: 'Vijayawada Maha Gopuram',
    initiative_type: 'TEMPLE_CONSTRUCTION',
    description: 'Grand construction of a 7-tier traditional Dravidian style Rajagopuram and dedicated inner sanctum for Sri Vasavi Kanyaka Parameswari Matha in Vijayawada.',
    objective: 'Erect a 63-foot sacred Rajagopuram with gold-gilded Kalashams, sanctum vimana, and marble parikrama for 5,000 pilgrims daily.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Indrakeeladri Foothills, Canal Road',
    city: 'Vijayawada',
    district: 'NTR District',
    state: 'Andhra Pradesh',
    pin_code: '520001',
    country: 'India',
    target_amount: 5000000,
    current_raised: 3450000,
    donor_count: 428,
    min_donation: 100,
    current_stage: 'STRUCTURE',
    status: 'PUBLISHED',
    is_teaser_enabled: true,
    broadcast_on_publish: true,
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'ini-007',
    code: 'VD-INI-2026-0007',
    title: 'Sri Vasavi Veda Agama Gurukulam & Swarna Mandiram',
    short_title: 'Swarna Mandiram & Gurukulam',
    initiative_type: 'TEMPLE_CONSTRUCTION',
    description: 'Divine construction of a traditional 3-tier Veda Agama Gurukulam and Swarna Mandiram dedicated to Sri Vasavi Kanyaka Parameswari Matha. Free boarding, Agamic training, and Vedic scripture preservation for 108 young scholars.',
    objective: 'Erect an Agamic Gurukulam complex and gold-plated inner shrine adhering strictly to ancient Shilpa Shastras.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Penugonda Devasthanam Grounds, Near Godavari Ghat',
    city: 'Penugonda',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    country: 'India',
    target_amount: 10000000,
    current_raised: 0,
    donor_count: 0,
    min_donation: 501,
    current_stage: 'PROPOSED',
    status: 'SCHEDULED',
    scheduled_publish_at: '2026-09-06T04:30',
    muhurtham_name: 'Brahma Muhurtham (04:30 AM - 06:00 AM)',
    is_teaser_enabled: true,
    broadcast_on_publish: true,
    created_at: '2026-09-05T12:00:00Z',
  },
];

// Ensure memoryStore has initial data
function ensureInitiatives() {
  if (!memoryStore.initiatives || memoryStore.initiatives.length === 0) {
    memoryStore.initiatives = [...DEFAULT_INITIATIVES];
  }
}

// GET /api/v1/initiatives
router.get('/', (req: Request, res: Response) => {
  ensureInitiatives();
  let list = [...memoryStore.initiatives];

  const status = req.query.status as string | undefined;
  const type = req.query.type as string | undefined;
  const search = req.query.search as string | undefined;

  // Auto-flip SCHEDULED whose time has passed
  const now = Date.now();
  list.forEach((item) => {
    if (item.status === 'SCHEDULED' && item.scheduled_publish_at) {
      if (new Date(item.scheduled_publish_at).getTime() <= now) {
        item.status = 'PUBLISHED';
      }
    }
  });

  if (status && status !== 'ALL') {
    if (status === 'PUBLISHED') {
      const now = Date.now();
      list = list.filter((i) => {
        if (i.status === 'PUBLISHED') return true;
        if (i.status === 'SCHEDULED' && i.is_teaser_enabled) {
          if (i.teaser_start_at && new Date(i.teaser_start_at).getTime() > now) {
            return false;
          }
          return true;
        }
        return false;
      });
    } else {
      list = list.filter((i) => i.status === status);
    }
  }

  if (type && type !== 'ALL') {
    list = list.filter((i) => i.initiative_type === type);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (i) =>
        i.title?.toLowerCase().includes(q) ||
        i.code?.toLowerCase().includes(q) ||
        i.city?.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// GET /api/v1/initiatives/:code
router.get('/:code', (req: Request, res: Response) => {
  ensureInitiatives();
  const code = req.params.code;
  const item = memoryStore.initiatives.find((i: any) => i.code === code || i.id === code);

  if (!item) {
    return res.status(404).json({ error: 'Initiative not found' });
  }

  res.json(item);
});

// POST /api/v1/initiatives
router.post('/', (req: Request, res: Response) => {
  ensureInitiatives();
  const payload = req.body;
  const code = payload.code || `VD-INI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInitiative = {
    ...payload,
    id: payload.id || `ini-${Date.now()}`,
    code,
    current_raised: payload.current_raised || 0,
    donor_count: payload.donor_count || 0,
    created_at: new Date().toISOString(),
  };

  memoryStore.initiatives.unshift(newInitiative);
  res.status(201).json(newInitiative);
});

// POST /api/v1/initiatives/:code/status
router.post('/:code/status', (req: Request, res: Response) => {
  ensureInitiatives();
  const code = req.params.code;
  const { status } = req.body;

  const item = memoryStore.initiatives.find((i: any) => i.code === code || i.id === code);
  if (!item) {
    return res.status(404).json({ error: 'Initiative not found' });
  }

  item.status = status;
  res.json({ success: true, initiative: item });
});

// PATCH /api/v1/initiatives/:code (for updating urgent status, priority, and details)
router.patch('/:code', (req: Request, res: Response) => {
  ensureInitiatives();
  const code = req.params.code;

  const item = memoryStore.initiatives.find((i: any) => i.code === code || i.id === code);
  if (!item) {
    return res.status(404).json({ error: 'Initiative not found' });
  }

  Object.assign(item, req.body, { updated_at: new Date().toISOString() });
  res.json({ success: true, initiative: item });
});

// PUT /api/v1/initiatives/:code
router.put('/:code', (req: Request, res: Response) => {
  ensureInitiatives();
  const code = req.params.code;

  const item = memoryStore.initiatives.find((i: any) => i.code === code || i.id === code);
  if (!item) {
    return res.status(404).json({ error: 'Initiative not found' });
  }

  Object.assign(item, req.body, { updated_at: new Date().toISOString() });
  res.json({ success: true, initiative: item });
});

export default router;
