import { Router, Request, Response } from 'express';
import { pool, memoryStore } from '../db.js';

const router = Router();

// GET /api/v1/temples/categories/ (before :id)
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM donation_categories WHERE is_active = true');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch {
    // Fallback to memoryStore
  }
  return res.json(memoryStore.categories);
});

// GET /api/v1/temples/campaigns/
router.get('/campaigns', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns WHERE status = 'ACTIVE'");
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch {
    // Fallback to memoryStore
  }
  return res.json(memoryStore.campaigns);
});

// GET /api/v1/temples/
router.get('/', async (_req: Request, res: Response) => {
  try {
    const templeResult = await pool.query('SELECT * FROM temples WHERE is_active = true');
    if (templeResult.rows.length > 0) {
      const temples = templeResult.rows;
      for (const t of temples) {
        const catRes = await pool.query('SELECT * FROM donation_categories WHERE temple_id = $1 AND is_active = true', [t.id]);
        const cmpRes = await pool.query("SELECT * FROM campaigns WHERE temple_id = $1 AND status = 'ACTIVE'", [t.id]);
        t.categories = catRes.rows;
        t.campaigns = cmpRes.rows;
        // Provide camelCase aliases for frontend compatibility
        t.pinCode = t.pin_code;
        t.contactPhone = t.contact_phone;
        t.contactEmail = t.contact_email;
        t.trustName = t.trust_name;
        t.registrationNo = t.registration_no;
        t.taxBenefitInfo = t.tax_benefit_info;
        t.logoUrl = t.logo_url;
        t.bannerUrl = t.banner_url;
        t.verificationStatus = t.verification_status;
        t.isActive = t.is_active;
      }
      return res.json(temples);
    }
  } catch {
    // Fallback to memoryStore
  }
  return res.json(memoryStore.temples);
});

// GET /api/v1/temples/:id/
router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const templeResult = await pool.query('SELECT * FROM temples WHERE id = $1 OR code = $1', [id]);
    if (templeResult.rows.length > 0) {
      const t = templeResult.rows[0];
      const catRes = await pool.query('SELECT * FROM donation_categories WHERE temple_id = $1', [t.id]);
      const cmpRes = await pool.query('SELECT * FROM campaigns WHERE temple_id = $1', [t.id]);
      t.categories = catRes.rows;
      t.campaigns = cmpRes.rows;
      t.pinCode = t.pin_code;
      t.contactPhone = t.contact_phone;
      t.contactEmail = t.contact_email;
      t.trustName = t.trust_name;
      t.registrationNo = t.registration_no;
      t.taxBenefitInfo = t.tax_benefit_info;
      t.logoUrl = t.logo_url;
      t.bannerUrl = t.banner_url;
      t.verificationStatus = t.verification_status;
      t.isActive = t.is_active;
      return res.json(t);
    }
  } catch {
    // Fallback
  }

  const found = memoryStore.temples.find((t) => t.id === id || t.code === id);
  if (found) {
    return res.json(found);
  }
  return res.status(404).json({ error: 'Temple not found' });
});

export default router;
