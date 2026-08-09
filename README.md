# RentNest 🏠 - Rental Property Marketplace

RentNest is a modern, responsive, and fully functional frontend application built with Next.js (App Router). It serves as a seamless rental property marketplace connecting Tenants, Landlords, and Administrators. The platform provides a secure environment for listing properties, requesting tours/rentals, handling payments, and overall platform moderation.

🔗 **Live Demo:** [https://rentnest-frontend-delta.vercel.app](https://rentnest-frontend-delta.vercel.app)

---

## 🚀 Key Features

### 🌟 Public Features
- **Responsive Property Grid:** Modern, mobile-first design with optimized images (`next/image`).
- **Advanced Search & Filters:** Filter properties by category, price, area, beds/baths, and amenities. Includes both **Classic Search** and **AI Search** modes.
- **Interactive Map View:** Integrated map view for properties using dynamic geolocation.
- **Property Details:** Comprehensive view with image galleries, landlord details, local area maps, and similar property suggestions.
- **Save Searches:** Users can save their filter configurations for quicker access later.

### 👤 Tenant Features
- **Rental/Tour Requests:** Submit dynamic forms to request property tours or rental agreements.
- **Dashboard Overview:** Track the status of all requests (Pending, Approved, Rejected, Active).
- **Secure Payments:** Integrated **Stripe Checkout** for processing rental payments once a request is approved. Includes custom Success and Cancel pages.
- **Payment History:** Detailed table showing total paid amounts, pending payments, and complete transaction logs.

### 🏢 Landlord Features
- **Property Management:** Full CRUD operations. Add new properties with multiple image uploads, detailed descriptions, and exact map locations.
- **Request Management:** View incoming tenant requests and easily `Approve` or `Reject` them via the dashboard.
- **Earnings Overview:** Track estimated earnings, active rentals, and pending tours.

### 👑 Admin Features
- **Global Dashboard:** View platform-wide statistics (Total Users, Properties, Requests).
- **User Moderation:** Comprehensive user table with the ability to `Ban` or `Unban` users instantly.
- **Content Moderation:** Access to manage and oversee all global properties, requests, saved searches, and contact messages.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling & Animation:** Tailwind CSS, Shadcn UI, Base UI, Tailwind Animate (`tw-animate-css`)
- **Icons:** Lucide React
- **Maps:** Leaflet, React Leaflet
- **AI Integration:** Google Generative AI (`@google/generative-ai` for AI Search)
- **Payment Gateway:** Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **Data Fetching:** Axios, TanStack Query (React Query)
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form, Zod, Hookform Resolvers
- **Toast Notifications:** React Hot Toast
- **Deployment:** Vercel

---

## 📁 API Integration Documentation

A detailed mapping of all frontend routes and their corresponding backend API endpoints is available in the root directory.

👉 **View API Documentation:** [API_INTEGRATION.md](./API_INTEGRATION.md)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

**1. Clone the repository:**
`git clone https://github.com/mdshamim-mern/rentnest-frontend.git`
`cd rentnest-frontend`

**2. Install dependencies:**
`npm install`

**3. Set up environment variables:**
Create a `.env.local` file in the root directory and add the necessary variables:
`NEXT_PUBLIC_API_URL=your_backend_api_url_here`
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here`
`NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here`

**4. Run the development server:**
`npm run dev`

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🎯 Important Notes
- **Consistent UI Feedback:** `react-hot-toast` is used across the application to provide real-time feedback for all CRUD actions and API errors.
- **Role-Based Routing:** Protected routes are managed securely to ensure Tenants, Landlords, and Admins can only access their respective dashboards.
- **Error Handling:** Implemented Next.js `error.tsx` boundaries and custom `404 Not Found` pages for a graceful user experience.

---
© 2026 RentNest. Built by Md Shamim.