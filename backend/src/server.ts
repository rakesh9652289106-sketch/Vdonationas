import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import templeRoutes from './routes/temples.routes.js';
import donationRoutes from './routes/donations.routes.js';
import recurringRoutes from './routes/recurring.routes.js';
import receiptsRoutes from './routes/receipts.routes.js';
import userRoutes from './routes/users.routes.js';
import initiativeRoutes from './routes/initiatives.routes.js';

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

// Health check and keep-alive endpoints for Render & Cron-job.org
const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Vasavi Temple Digital Donations API',
  });
};

app.all(['/health', '/api/v1/health', '/cron', '/api/v1/cron'], healthHandler);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Vasavi Temple Digital Donations & SaaS Platform Backend API',
    version: '2.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/temples', templeRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/recurring', recurringRoutes);
app.use('/api/v1/receipts', receiptsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/initiatives', initiativeRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Start Server immediately so Render port binding succeeds instantly (< 5ms)
const server = app.listen(PORT, () => {
  console.log(`🛕 Vasavi Temple Backend API running smoothly on port ${PORT}`);
  console.log(`📡 Ready to serve Vercel frontend requests at /api/v1`);
  console.log(`⏰ Cron keep-alive endpoints available at /health and /cron`);
});

// Asynchronously initialize database in background without blocking port binding or returning 503
initDb().catch((err) => {
  console.warn('⚠️ Non-fatal DB initialization warning (in-memory fallback active):', err?.message || err);
});

