<div align="center">

# 🏠 RentNest — Rental Property Marketplace (Frontend)

A modern, responsive Next.js app that connects **Tenants**, **Landlords**, and **Admins** on one rental property platform — with an AI-powered search and real Stripe payments.

[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=for-the-badge)](https://rentnest-frontend-delta.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-3b82f6?style=for-the-badge)](https://rentnest-backend-iota.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**[Live App](https://rentnest-frontend-delta.vercel.app)** · **[Backend Repo](https://github.com/mdshamim-mern/rentnest-backend)** · **[Report a Bug](https://github.com/mdshamim-mern/rentnest-frontend/issues)**

</div>

---

## 📖 Overview

RentNest is the **frontend** half of a full-stack rental property marketplace. Tenants browse and rent properties, Landlords list and manage them, and Admins moderate the whole platform — all protected by role-based routing. This app is a pure UI/client layer; all data lives behind a separate REST API in the [`rentnest-backend`](https://github.com/mdshamim-mern/rentnest-backend) repository (Node.js, Express, PostgreSQL, Prisma).

| | |
|---|---|
| 🌐 **Live App** | https://rentnest-frontend-delta.vercel.app |
| 🔌 **Live API** | https://rentnest-backend-iota.vercel.app |
| 🗂️ **Backend Source** | https://github.com/mdshamim-mern/rentnest-backend |

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication & Route Protection](#-authentication--route-protection)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Author](#-author)

## ✨ Features

### 🌍 Public
- Responsive property grid with optimized images (`next/image`)
- **Classic filters** — category, price, floor area, beds/baths, amenities, furnished status
- **AI Search** — type a plain sentence (e.g. *"2 bed apartment in Banani under 20000"*) and Gemini extracts the filters for you automatically
- Interactive **Leaflet** map view of property locations
- Full property detail page: image gallery, landlord info, embedded map, similar listings, tenant reviews
- Save a search's filters for quick reuse later
- Static pages: About, Contact, Help, Terms, Privacy

### 🧑‍💼 Tenant Dashboard
- Submit rental or tour requests with a date range
- Track request status end-to-end: `PENDING → APPROVED/REJECTED → ACTIVE → COMPLETED`
- Pay online through **Stripe Checkout** once a request is approved, with dedicated success/cancel pages
- Full payment history table
- Manage saved searches and profile

### 🏢 Landlord Dashboard
- Full CRUD on property listings — multiple images, amenities, map coordinates, pricing
- Approve or reject incoming tour/rental requests
- Overview of earnings, active rentals, and pending requests

### 👑 Admin Dashboard
- Platform-wide stats (users, properties, requests)
- Ban / unban user accounts
- Moderate all properties, rental requests, saved searches, and contact-form messages

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Base UI, `tw-animate-css` |
| Icons | Lucide React |
| Server state | TanStack Query (React Query) |
| Client state | Zustand (persisted auth store) |
| Forms & validation | React Hook Form + Zod |
| HTTP client | Axios (with request/response interceptors) |
| Maps | Leaflet + React Leaflet |
| AI search | Google Generative AI (`gemini-pro`), called from a server-side Route Handler |
| Payments | Stripe Checkout (hosted redirect flow) |
| Notifications | react-hot-toast |
| Deployment | Vercel |

## 📁 Project Structure

```text
src/
├── app/
│   ├── (auth)/login, register/     # Auth pages (route group)
│   ├── about/, contact/, help/ …   # Static & marketing pages
│   ├── api/ai-search/              # Server route that calls Gemini
│   ├── dashboard/
│   │   ├── admin/                  # Admin-only screens
│   │   ├── landlord/               # Landlord-only screens
│   │   └── tenant/                 # Tenant-only screens
│   ├── properties/, properties/[id]/  # Listing + detail page
│   ├── payment/success/, cancel/   # Stripe redirect landing pages
│   ├── layout.tsx, page.tsx        # Root layout & home page
│   └── error.tsx, not-found.tsx, loading.tsx
├── middleware.ts                   # JWT decode + role-based route guard
├── components/                     # Shared UI & shadcn/ui components
├── lib/
│   ├── api/                        # Axios instance + per-feature API calls
│   └── store/authStore.ts          # Zustand auth store
└── types/                          # Shared TypeScript types
```

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, npm, and the [backend](https://github.com/mdshamim-mern/rentnest-backend) running locally or reachable at a URL.

```bash
# 1. Clone the repo
git clone https://github.com/mdshamim-mern/rentnest-frontend.git
cd rentnest-frontend

# 2. Install dependencies
npm install

# 3. Create your environment file (see below), then run the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Base URL of the backend API (no trailing slash)
NEXT_PUBLIC_BACKEND_URL=https://rentnest-backend-iota.vercel.app/api

# Google Gemini key used by the AI Search route.
# Keep this WITHOUT the NEXT_PUBLIC_ prefix — it must stay server-side only.
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** Stripe needs no publishable key on the frontend. Checkout happens on Stripe's own hosted page — the backend creates the session, and the app simply redirects the browser to the URL Stripe returns.

## 🔐 Authentication & Route Protection

- On login/register, the JWT is saved in the Zustand store (persisted to `localStorage` for the React app) **and** mirrored into a plain cookie, because `middleware.ts` runs on the server/edge and can't read `localStorage`.
- `middleware.ts` decodes the JWT payload directly (no extra network call) to read the user's `role`, then allows or redirects requests to `/dashboard/*` and `/payment/*` based on that role — e.g. a tenant trying to open `/dashboard/admin` is redirected back to `/dashboard/tenant`.
- The Axios instance attaches `Authorization: Bearer <token>` to every request automatically, and logs the user out (redirecting to `/login`) whenever a request comes back with a `401`.

## 🔌 API Integration

Every frontend route is mapped to its exact backend endpoint in [`API_INTEGRATION.md`](./API_INTEGRATION.md) — handy if you're wiring up a new page or just want the full request map at a glance.

## 📦 Deployment

Deployed on **Vercel**: https://rentnest-frontend-delta.vercel.app — pushes to `main` trigger a new deployment automatically. Remember to add the environment variables above in the Vercel project settings as well.

## 👤 Author

**Md Shamim**
[LinkedIn](https://www.linkedin.com/in/md-shamim471/) · [Facebook](https://www.facebook.com/share/1HJb2Cwxvt/) · [Telegram](https://t.me/md_shamim71)

---
<div align="center">© 2026 RentNest. Built by Md Shamim.</div>