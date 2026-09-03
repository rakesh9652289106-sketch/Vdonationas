import { Router, Request, Response } from 'express';
import { pool, memoryStore } from '../db.js';

const router = Router();

// GET /api/v1/recurring/
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT r.*, t.name as temple_name
      FROM recurring_donations r
      LEFT JOIN temples t ON r.temple_id = t.id
      ORDER BY r.created_at DESC
    `);
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch {
    // Fallback
  }
  return res.json(memoryStore.recurring);
});

// POST /api/v1/recurring/
router.post('/', async (req: Request, res: Response) => {
  const {
    templeId,
    temple_id,
    categoryName = 'Nitya Annadanam Seva',
    category_name = 'Nitya Annadanam Seva',
    amount = 501.0,
    interval = 'MONTHLY',
    paymentMethod = 'UPI Autopay',
    payment_method = 'UPI Autopay',
  } = req.body;

  const resolvedTempleId = templeId || temple_id || memoryStore.temples[0].id;
  const resolvedCategory = categoryName || category_name;
  const resolvedAmount = parseFloat(amount) || 501.0;
  const resolvedMethod = paymentMethod || payment_method;

  const subId = `SUB-AUTOPAY-${Math.floor(10000 + Math.random() * 90000)}`;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 30);
  const nextDateStr = nextDate.toISOString().split('T')[0];

  try {
    const result = await pool.query(
      `INSERT INTO recurring_donations (
        subscription_id, temple_id, category_name, amount,
        interval, payment_method, next_deduction_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,
      [
        subId, resolvedTempleId, resolvedCategory, resolvedAmount,
        interval, resolvedMethod, nextDateStr, 'ACTIVE',
      ]
    );

    const saved = result.rows[0];
    saved.subscriptionId = saved.subscription_id;
    saved.categoryName = saved.category_name;
    saved.paymentMethod = saved.payment_method;
    saved.nextDeductionDate = saved.next_deduction_date;
    return res.status(201).json(saved);
  } catch (err) {
    console.warn('PostgreSQL write failed for recurring, using memoryStore:', err);
  }

  // Fallback
  const mockSub = {
    id: `rec-${Date.now()}`,
    subscription_id: subId,
    subscriptionId: subId,
    temple_id: resolvedTempleId,
    templeId: resolvedTempleId,
    temple_name: 'Sri Vasavi Kanyaka Parameswari Matha',
    category_name: resolvedCategory,
    categoryName: resolvedCategory,
    amount: resolvedAmount,
    interval,
    payment_method: resolvedMethod,
    paymentMethod: resolvedMethod,
    next_deduction_date: nextDateStr,
    nextDeductionDate: nextDateStr,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  };

  memoryStore.recurring.unshift(mockSub);
  return res.status(201).json(mockSub);
});

// GET /api/v1/recurring/:subscriptionId/
router.get('/:subscriptionId', async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId as string;
  try {
    const result = await pool.query(
      `SELECT r.*, t.name as temple_name
       FROM recurring_donations r
       LEFT JOIN temples t ON r.temple_id = t.id
       WHERE r.id::text = $1 OR r.subscription_id = $1`,
      [subscriptionId]
    );
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
  } catch {
    // Fallback
  }

  const found = memoryStore.recurring.find(
    (r) => r.id === subscriptionId || r.subscription_id === subscriptionId || r.subscriptionId === subscriptionId
  );
  if (found) {
    return res.json(found);
  }
  return res.status(404).json({ error: 'Subscription not found' });
});

export default router;
