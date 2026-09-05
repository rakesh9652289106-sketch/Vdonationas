import dns from 'node:dns';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Enforce IPv4 lookup first to prevent IPv6 network unreachable errors on cloud hosting (Render)
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in older runtimes
}

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl && !databaseUrl.includes('localhost') ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// Fallback in-memory cache for graceful dev offline operation
export const memoryStore = {
  temples: [
    {
      id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210',
      code: 'TPL-VASAVI-01',
      name: 'Sri Vasavi Kanyaka Parameswari Matha',
      deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
      description: 'Sacred shrine and international headquarters of Sri Vasavi Matha at Penugonda.',
      history: 'Originating from Penugonda, Andhra Pradesh, Sri Vasavi Matha sacrificed her mortal form to uphold righteousness, peace, and community dignity.',
      address: 'Penugonda Devasthanam, West Godavari',
      city: 'Penugonda',
      state: 'Andhra Pradesh',
      pin_code: '534320',
      pinCode: '534320',
      country: 'India',
      contact_phone: '+91 8819 246789',
      contactPhone: '+91 8819 246789',
      contact_email: 'seva@vasavimatha.org',
      contactEmail: 'seva@vasavimatha.org',
      trust_name: 'Sri Vasavi Kanyaka Parameswari Temple Trust',
      trustName: 'Sri Vasavi Kanyaka Parameswari Temple Trust',
      registration_no: 'REG-AP-1082/2021',
      registrationNo: 'REG-AP-1082/2021',
      tax_benefit_info: '80G Registered Trust (URN: AAATV1234F20214)',
      taxBenefitInfo: '80G Registered Trust (URN: AAATV1234F20214)',
      logo_url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
      logoUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
      banner_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
      bannerUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
      verification_status: 'VERIFIED',
      verificationStatus: 'VERIFIED',
      is_active: true,
      isActive: true,
      categories: [] as any[],
      campaigns: [] as any[],
      created_at: new Date().toISOString(),
    },
  ],
  categories: [
    { id: 'cat-1', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Annadanam Seva', description: 'Offer daily food to visiting pilgrims', icon: '🪔', is_active: true, isActive: true },
    { id: 'cat-2', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Pushpa Seva', description: 'Offer scented flowers to Goddess Vasavi Matha', icon: '🌺', is_active: true, isActive: true },
    { id: 'cat-3', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Matha Development', description: 'Support temple expansion and gopuram gilding', icon: '🛕', is_active: true, isActive: true },
    { id: 'cat-4', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Pooja Seva', description: 'Daily Archana and Kumkumarchana', icon: '📿', is_active: true, isActive: true },
    { id: 'cat-5', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Community Development', description: 'Arya Vysya youth skills & micro-grants', icon: '🏛️', is_active: true, isActive: true },
    { id: 'cat-6', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Education', description: 'Scholarships and hostel facilities', icon: '📚', is_active: true, isActive: true },
    { id: 'cat-7', temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210', name: 'Social Service', description: 'Free medical camps and senior care', icon: '🏥', is_active: true, isActive: true },
  ],
  campaigns: [
    {
      id: 'cmp-1',
      temple_id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210',
      templeId: '9f8e7d6c-5b4a-3210-fedc-ba9876543210',
      title: 'Sri Vasavi Golden Vimana Gopuram Renovation',
      description: 'Gilding and architectural preservation of the historic Penugonda temple sanctum.',
      banner_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      goal_amount: 5000000,
      current_raised: 2845000,
      status: 'ACTIVE',
      is_featured: true,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
    },
  ],
  donations: [] as any[],
  recurring: [] as any[],
  receipts: [] as any[],
  users: [] as any[],
  initiatives: [] as any[],
};

// Initialize Supabase PostgreSQL Tables Automatically (Zero Manual Migration Errors)
export async function initDb() {
  if (!databaseUrl) {
    console.log('ℹ️  No DATABASE_URL configured. Running with in-memory database fallback.');
    return;
  }

  try {
    const client = await pool.connect();
    try {
      console.log('🔄 Connected to Supabase PostgreSQL. Initializing tables...');

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          mobile VARCHAR(50),
          role VARCHAR(50) DEFAULT 'DEVOTEE',
          is_two_factor BOOLEAN DEFAULT FALSE,
          language VARCHAR(10) DEFAULT 'en',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS temples (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          deity VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          history TEXT,
          address VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          pin_code VARCHAR(20) NOT NULL,
          country VARCHAR(100) DEFAULT 'India',
          contact_phone VARCHAR(50) NOT NULL,
          contact_email VARCHAR(255) NOT NULL,
          trust_name VARCHAR(255) NOT NULL,
          registration_no VARCHAR(100) NOT NULL,
          tax_benefit_info VARCHAR(255),
          logo_url TEXT,
          banner_url TEXT,
          verification_status VARCHAR(50) DEFAULT 'VERIFIED',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS donation_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
          name VARCHAR(150) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS campaigns (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          banner_url TEXT,
          goal_amount NUMERIC(12, 2) NOT NULL,
          current_raised NUMERIC(12, 2) DEFAULT 0,
          start_date TIMESTAMPTZ NOT NULL,
          end_date TIMESTAMPTZ NOT NULL,
          status VARCHAR(50) DEFAULT 'ACTIVE',
          is_featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS donations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          donation_id VARCHAR(100) UNIQUE NOT NULL,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
          category_id UUID REFERENCES donation_categories(id) ON DELETE SET NULL,
          campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
          amount NUMERIC(12, 2) NOT NULL,
          payment_method VARCHAR(50) DEFAULT 'UPI',
          transaction_id VARCHAR(100) UNIQUE NOT NULL,
          status VARCHAR(50) DEFAULT 'SUCCESS',
          is_anonymous BOOLEAN DEFAULT FALSE,
          dedication_msg TEXT,
          on_behalf_of VARCHAR(255),
          donor_name VARCHAR(255) NOT NULL,
          donor_email VARCHAR(255) NOT NULL,
          donor_phone VARCHAR(50) NOT NULL,
          donor_pan VARCHAR(50),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS recurring_donations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subscription_id VARCHAR(100) UNIQUE NOT NULL,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
          category_name VARCHAR(255) DEFAULT 'Nitya Annadanam Seva',
          amount NUMERIC(12, 2) NOT NULL,
          interval VARCHAR(50) DEFAULT 'MONTHLY',
          payment_method VARCHAR(50) DEFAULT 'UPI Autopay',
          next_deduction_date DATE NOT NULL,
          status VARCHAR(50) DEFAULT 'ACTIVE',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS receipts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          receipt_no VARCHAR(100) UNIQUE NOT NULL,
          donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
          verification_code VARCHAR(50) UNIQUE NOT NULL,
          issued_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Check if temple data exists, if not, auto-seed Sri Vasavi Matha Penugonda!
      const templeRes = await client.query(`SELECT COUNT(*) FROM temples WHERE code = 'TPL-VASAVI-01'`);
      if (parseInt(templeRes.rows[0].count, 10) === 0) {
        console.log('🌱 Seeding initial Sri Vasavi Kanyaka Parameswari Matha, Penugonda temple data...');
        const tpl = memoryStore.temples[0];
        const ins = await client.query(
          `INSERT INTO temples (code, name, deity, description, history, address, city, state, pin_code, country, contact_phone, contact_email, trust_name, registration_no, tax_benefit_info, logo_url, banner_url, verification_status, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
           RETURNING id;`,
          [
            tpl.code, tpl.name, tpl.deity, tpl.description, tpl.history,
            tpl.address, tpl.city, tpl.state, tpl.pin_code, tpl.country,
            tpl.contact_phone, tpl.contact_email, tpl.trust_name, tpl.registration_no,
            tpl.tax_benefit_info, tpl.logo_url, tpl.banner_url, tpl.verification_status, tpl.is_active,
          ]
        );

        const newTempleId = ins.rows[0].id;
        for (const cat of memoryStore.categories) {
          await client.query(
            `INSERT INTO donation_categories (temple_id, name, description, icon, is_active)
             VALUES ($1, $2, $3, $4, $5);`,
            [newTempleId, cat.name, cat.description, cat.icon, cat.is_active]
          );
        }

        const cmp = memoryStore.campaigns[0];
        await client.query(
          `INSERT INTO campaigns (temple_id, title, description, banner_url, goal_amount, current_raised, start_date, end_date, status, is_featured)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [
            newTempleId, cmp.title, cmp.description, cmp.banner_url, cmp.goal_amount,
            cmp.current_raised, cmp.start_date, cmp.end_date, cmp.status, cmp.is_featured,
          ]
        );
        console.log('✅ Temple and categories seeded successfully into Supabase!');
      }

      console.log('✅ Supabase PostgreSQL Database ready and synced!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️  Could not connect to Supabase PostgreSQL at startup. Falling back to in-memory store:', err);
  }
}
