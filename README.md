# Sri Vasavi Kanyaka Parameswari Temple - Digital Seva & Donation SaaS Platform

A modern, full-stack digital donation, pooja slot scheduling, and multi-tier temple management platform built with **Next.js (App Router)** and **Django REST Framework (DRF)** backed by **PostgreSQL (Supabase)**.

## 🏗️ Architecture

- **Frontend**: Next.js 14+ / React / Tailwind CSS / Lucide Icons / Recharts / Three.js
- **Backend**: Django 5 / Django REST Framework / SimpleJWT / WhiteNoise / Gunicorn
- **Database**: PostgreSQL (Supabase) / SQLite (Local Dev)
- **Deployment**: Vercel (Frontend), Render (Backend), Supabase (Database)

## 📁 Repository Structure

```
├── backend/            # Django REST API Backend
│   ├── apps/           # Django modular apps (users, temples, donations, recurring, receipts)
│   ├── config/         # Settings, URLs, WSGI
│   ├── build.sh        # Production build & migration script for Render
│   └── requirements.txt
├── frontend/           # Next.js App Router Frontend
│   ├── app/            # Devotee, Temple Admin, Finance, Super Admin routes
│   ├── components/     # Reusable UI components
│   └── lib/            # State stores, quota rules, api client
└── .gitignore
```

## 🚀 Local Development

### 1. Backend (Django)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
