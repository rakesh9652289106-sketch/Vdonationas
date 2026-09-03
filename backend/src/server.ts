import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import templeRoutes from './routes/temples.routes.js';
import donationRoutes from './routes/donations.routes.js';
import recurringRoutes from './routes/recurring.routes.js';
import receiptsRoutes from './routes/receipts.routes.js';
import userRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for Vercel, localhost, and all origins
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Normalize trailing slashes so /api/v1/temples and /api/v1/temples/ both match cleanly
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const newPath = req.path.slice(0, -1);
    req.url = newPath + (req.url.slice(req.path.length) || '');
  }
  next();
});

// Health check endpoints for Render
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Vasavi Temple Digital Donations & SaaS Platform Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/temples', templeRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/recurring', recurringRoutes);
app.use('/api/v1/receipts', receiptsRoutes);
app.use('/api/v1/users', userRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Start Server & Auto-Initialize Supabase Tables
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🛕 Vasavi Temple Backend API running smoothly on port ${PORT}`);
    console.log(`📡 Ready to serve Vercel frontend requests at /api/v1`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
