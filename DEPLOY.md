# 🚀 Deployment Guide for Fleet

This guide covers various deployment strategies for the Fleet project, which includes a frontend (`fleet-frontend`) built with Next.js and a backend (`fleet-backend`) powered by NestJS.

---

## 🌐 Deployment Matrix

| Platform           | Frontend               | Backend                | DB                | Ease   | Cost        |
| ------------------ | ---------------------- | ---------------------- | ----------------- | ------ | ----------- |
| Vercel + Render    | Vercel (Next.js)       | Render (NestJS)        | Render PostgreSQL | Easy   | Free Tier ✅ |
| Vercel + Railway   | Vercel (Next.js)       | Railway (NestJS)       | Railway Postgres  | Easy   | Free+ ⚠️    |
| Docker + VPS       | Docker Compose         | Docker Compose         | Local Postgres    | Medium | Low £       |
| Fly.io             | Fly (Fullstack Docker) | Fly (Docker backend)   | Fly Postgres      | Medium | Free/Pay 💸 |
| Azure              | App Service            | App Service            | Azure DB          | Harder | Paid ☁️     |
| Netlify + Supabase | Netlify (frontend)     | Supabase functions/API | Supabase Postgres | Medium | Free        |

---

## ✅ Pre-Deploy Checklist

* [ ] All environment variables in `.env.production`
* [ ] Frontend knows backend URL via `NEXT_PUBLIC_API_URL`
* [ ] Backend CORS allows frontend domain
* [ ] PostgreSQL used in production (not SQLite)
* [ ] `.env` files ignored in Git

---

## 🔹 Option 1: Vercel + Render (Recommended for MVPs)

### Backend (Render)

1. Go to [render.com](https://render.com)
2. Create new Web Service → Connect GitHub → Choose `fleet-backend`
3. Settings:

   * **Build Command**: `npm run build`
   * **Start Command**: `npm run start:prod`
   * **Environment**:

     ```env
     DATABASE_URL=your_postgres_url
     JWT_SECRET=your_secret
     PORT=3000
     ```
4. Choose a free instance type
5. After deploy, get the URL (e.g. `https://fleet-api.onrender.com`)

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import `fleet-frontend` from GitHub
3. Set env:

   ```env
   NEXT_PUBLIC_API_URL=https://fleet-api.onrender.com
   ```
4. Vercel auto-deploys on push to main

---

## 🔸 Option 2: Docker Compose (VPS or Dev)

### Setup Structure

```
fleet/
├── docker-compose.yml
├── fleet-frontend/
│   ├── Dockerfile
├── fleet-backend/
│   ├── Dockerfile
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: ./fleet-backend
    ports:
      - "3000:3000"
    env_file:
      - ./fleet-backend/.env.production
    depends_on:
      - db

  frontend:
    build: ./fleet-frontend
    ports:
      - "3001:3000"
    env_file:
      - ./fleet-frontend/.env.production

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: fleet
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: fleetdb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Commands

```bash
docker-compose up --build
```

---

## 🟣 Option 3: Fly.io (Dockerized Cloud)

### Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### Backend Deploy

```bash
cd fleet-backend
fly launch --name fleet-backend
fly deploy
```

### Frontend Deploy

```bash
cd ../fleet-frontend
fly launch --name fleet-frontend
fly deploy
```

> Note: Add secrets using `fly secrets set KEY=value`

---

## ☁️ Option 4: Azure App Services

### Backend

* Deploy NestJS using App Service or Docker Container
* Use Azure PostgreSQL as DB
* Set env variables in App Settings

### Frontend

* Deploy with Static Web Apps or App Service (Next.js)

### Tools

* Azure CLI
* GitHub Actions for CI/CD

---

## 🧪 Local Dev with Ngrok

```bash
npm run dev             # Frontend
cd fleet-backend && npm run start:dev
ngrok http 3000         # Exposes backend to public
```

Then update `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://xxxxx.ngrok.io
```

---

## 🌐 CORS Setup (NestJS)

```ts
// main.ts
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://your-frontend.vercel.app',
  ],
  credentials: true,
});
```

---

## ✅ Final Tips

* Use `.env.production` or secret managers (Render, Vercel, etc.)
* Add `robots.txt` and metadata for frontend SEO
* Protect `main` branch with GitHub rules
* Set up CI with GitHub Actions (`.github/workflows/ci.yml`)

---

Need help deploying on a specific platform? Let me know and I’ll generate a detailed config for it.

Happy shipping! 🚚✨
