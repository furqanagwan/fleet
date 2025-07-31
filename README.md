# fleet

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typeScript-5.x-blue)
![Dockerized](https://img.shields.io/badge/docker-ready-blue)
![Monorepo](https://img.shields.io/badge/monorepo-yes-purple)

---

**fleet** is a modern, full-stack TypeScript app for managing fleet jobs with role-based dashboards (Admin & Driver), secure JWT auth, and a clean, scalable monorepo structure. Built with **Next.js**, **NestJS**, **ShadCN UI**, and **Prisma**, it supports instant local dev and is fully deployable to the cloud.

---

## 🚀 Tech Stack

* **Frontend**: Next.js App Router + ShadCN UI + TailwindCSS
* **Backend**: NestJS + Prisma + PostgreSQL
* **Auth**: JWT-based with login and role-based access control
* **Styling**: ShadCN UI components & themes
* **Deployment**: Docker-ready
* **Structure**: Monorepo with `fleet-frontend/` and `fleet-backend/`

---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/furqanagwan/fleet.git
cd fleet
```

### 2. Set up `.env` files for both frontend and backend

**fleet-backend/.env**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fleet
JWT_SECRET=your_jwt_secret
```

**fleet-frontend/.env** *(if needed)*

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run the backend

```bash
cd fleet-backend
npm install
npx prisma migrate dev
npm run start:dev
```

### 4. Run the frontend

```bash
cd ../fleet-frontend
npm install
npm run dev
```

Frontend: [http://localhost:3001](http://localhost:3001)
Backend API: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Auth Roles

* **Admin**: Can create jobs, assign them to drivers, and view all jobs.
* **Driver**: Can accept, reject, and complete assigned jobs.

---

## 🖥️ Dashboards

### Admin Dashboard `/admin`

* View all drivers and jobs
* Create jobs with optional assignment
* Manage job statuses

### Driver Dashboard `/driver`

* View assigned jobs
* Accept / Complete them with one-click

---

## 🧪 Features

* 🔒 **JWT Auth** with login and persistent session
* 🧑‍💼 **Role-based UI** and route protection
* 🧰 **API-first** backend using NestJS
* 🖼️ **ShadCN UI** styled components
* 📦 **Prisma** ORM for PostgreSQL
* 🚀 **Monorepo** structure for easy deployment and dev

---

## 🗂️ Folder Structure

```
fleet/
├── fleet-frontend/        # Next.js 14 App Router frontend
│   ├── app/               # Pages (login, admin, driver)
│   ├── components/        # UI & context
│   ├── lib/               # Utility functions
│   └── ...
│
├── fleet-backend/         # NestJS backend
│   ├── src/
│   │   ├── auth/          # JWT auth logic
│   │   ├── users/         # Driver/admin users
│   │   ├── jobs/          # Job creation & assignment
│   │   └── ...
│   ├── prisma/            # Schema & migrations
│   └── ...
└── README.md
```

---

## 🐳 Docker Support

Coming soon! Dockerfile + docker-compose setup for full-stack deployment.

---

## 💬 Contributing

Pull requests welcome! For major changes, open an issue first to discuss what you’d like to change.

1. Fork it
2. Create your feature branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -am 'Add something'`
4. Push to the branch: `git push origin my-feature`
5. Open a pull request

---

## 📄 License

MIT

---
