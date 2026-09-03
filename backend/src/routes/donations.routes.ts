import { Router, Request, Response } from 'express';
import { pool, memoryStore } from '../db.js';

const router = Router();

// GET /api/v1/donations/
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT d.*, t.name as temple_name, c.name as category_name
      FROM donations d
      LEFT JOIN temples t ON d.temple_id = t.id
      LEFT JOIN donation_categories c ON d.category_id = c.id
      ORDER BY d.created_at DESC
    `);
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch {
    // Fallback
  }
  return res.json(memoryStore.donations);
});

// POST /api/v1/donations/
router.post('/', async (req: Request, res: Response) => {
  const {
    templeId,
    temple_id,
    categoryId,
    category_id,
    campaignId,
    campaign_id,
    amount,
    paymentMethod = 'UPI',
    payment_method = 'UPI',
    donorName,
    donor_name,
    donorEmail,
    donor_email,
    donorPhone,
    donor_phone,
    donorPan,
    donor_pan,
    isAnonymous = false,
    is_anonymous = false,
    dedicationMsg,
    dedication_msg,
    onBehalfOf,
    on_behalf_of,
  } = req.body;

  const resolvedTempleId = templeId || temple_id || memoryStore.temples[0].id;
  const resolvedCategoryId = categoryId || category_id || null;
  const resolvedCampaignId = campaignId || campaign_id || null;
  const resolvedDonorName = donorName || donor_name || 'Anonymous Devotee';
  const resolvedDonorEmail = donorEmail || donor_email || 'devotee@vasavimatha.org';
  const resolvedDonorPhone = donorPhone || donor_phone || '9123456789';
  const resolvedDonorPan = donorPan || donor_pan || '';
  const resolvedAmount = parseFloat(amount) || 1001.0;
  const resolvedMethod = paymentMethod || payment_method;

  const donationId = `DON-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const transactionId = `TXN-PG-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNo = `REC-80G-${Math.floor(100000 + Math.random() * 900000)}`;
  const verificationCode = `VRF-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    const donationRes = await pool.query(
      `INSERT INTO donations (
        donation_id, temple_id, category_id, campaign_id, amount,
        payment_method, transaction_id, status, is_anonymous,
        dedication_msg, on_behalf_of, donor_name, donor_email,
        donor_phone, donor_pan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;`,
      [
        donationId, resolvedTempleId, resolvedCategoryId, resolvedCampaignId,
        resolvedAmount, resolvedMethod, transactionId, 'SUCCESS',
        isAnonymous || is_anonymous, dedicationMsg || dedication_msg || '',
        onBehalfOf || on_behalf_of || '', resolvedDonorName, resolvedDonorEmail,
        resolvedDonorPhone, resolvedDonorPan,
      ]
    );

    const saved = donationRes.rows[0];

    // Automatically generate Receipt
    await pool.query(
      `INSERT INTO receipts (receipt_no, donation_id, verification_code)
       VALUES ($1, $2, $3);`,
      [receiptNo, saved.id, verificationCode]
    );

    saved.receipt_no = receiptNo;
    saved.receiptNo = receiptNo;
    saved.verification_code = verificationCode;
    saved.verificationCode = verificationCode;
    saved.donationId = saved.donation_id;
    saved.donorName = saved.donor_name;
    saved.donorEmail = saved.donor_email;
    saved.donorPhone = saved.donor_phone;
    saved.paymentMethod = saved.payment_method;
    saved.transactionId = saved.transaction_id;

    return res.status(201).json(saved);
  } catch (err) {
    console.warn('PostgreSQL write failed, storing in memory:', err);
  }

  // In-memory fallback
  const mockDonation = {
    id: `don-${Date.now()}`,
    donation_id: donationId,
    donationId,
    temple_id: resolvedTempleId,
    templeId: resolvedTempleId,
    temple_name: 'Sri Vasavi Kanyaka Parameswari Matha',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    amount: resolvedAmount,
    payment_method: resolvedMethod,
    paymentMethod: resolvedMethod,
    transaction_id: transactionId,
    transactionId,
    status: 'SUCCESS',
    donor_name: resolvedDonorName,
    donorName: resolvedDonorName,
    donor_email: resolvedDonorEmail,
    donorEmail: resolvedDonorEmail,
    donor_phone: resolvedDonorPhone,
    donorPhone: resolvedDonorPhone,
    donor_pan: resolvedDonorPan,
    donorPan: resolvedDonorPan,
    receipt_no: receiptNo,
    receiptNo,
    verification_code: verificationCode,
    verificationCode,
    created_at: new Date().toISOString(),
  };

  memoryStore.donations.unshift(mockDonation);
  memoryStore.receipts.unshift({
    receipt_no: receiptNo,
    donation_id: mockDonation.id,
    verification_code: verificationCode,
    issued_at: new Date().toISOString(),
    donation: mockDonation,
  });

  return res.status(201).json(mockDonation);
});

// GET /api/v1/donations/:id/
router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const result = await pool.query(
      `SELECT d.*, r.receipt_no, r.verification_code, t.name as temple_name
       FROM donations d
       LEFT JOIN receipts r ON r.donation_id = d.id
       LEFT JOIN temples t ON d.temple_id = t.id
       WHERE d.id::text = $1 OR d.donation_id = $1 OR d.transaction_id = $1`,
      [id]
    );
    if (result.rows.length > 0) {
      const d = result.rows[0];
      d.donationId = d.donation_id;
      d.donorName = d.donor_name;
      d.receiptNo = d.receipt_no;
      d.verificationCode = d.verification_code;
      return res.json(d);
    }
  } catch {
    // Fallback
  }

  const found = memoryStore.donations.find(
    (d) => d.id === id || d.donation_id === id || d.donationId === id || d.transaction_id === id
  );
  if (found) {
    return res.json(found);
  }
  return res.status(404).json({ error: 'Donation not found' });
});

export default router;
