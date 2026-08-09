# RentNest Frontend - API Integration Mapping

This document maps all the frontend routes, pages, and components to their corresponding backend API endpoints, fulfilling the mandatory assignment requirement.

---

## 🔐 Authentication & Authorization
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/login` | `/api/auth/login` | `POST` | Authenticates user and returns JWT token. |
| `/register` | `/api/auth/register` | `POST` | Registers a new user with a specific role (Tenant/Landlord). |
| `Middleware (Next.js)` | N/A (Client-side decoding) | N/A | Verifies JWT token to protect routes based on user role. |

---

## 🌍 Public Routes (Properties & Filters)
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/` (Home Page) | `/api/properties?featured=true` | `GET` | Fetches featured/recent properties for the landing page. |
| `/properties` (List & Map View) | `/api/properties` | `GET` | Fetches properties with dynamic query params (AI Search, Category, Price, Beds, Baths, Area). |
| `/properties/[id]` | `/api/properties/:id` | `GET` | Fetches comprehensive details for a single property. |
| `Save Search Button` | `/api/saved-searches` | `POST` | Saves the current filter criteria for logged-in users. |

---

## 👨‍💼 Tenant Dashboard (`/dashboard/tenant`)
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/dashboard/tenant` | `/api/rentals/my-requests` | `GET` | Fetches overall stats (Total, Pending, Approved requests). |
| `/dashboard/tenant/requests` | `/api/rentals/my-requests` | `GET` | Fetches list of all rental/tour requests with status badges. |
| `/dashboard/tenant/requests/new` | `/api/rentals` | `POST` | Submits a new rental or tour request with dates. |
| `/dashboard/tenant/saved-searches`| `/api/saved-searches` | `GET` | Retrieves the tenant's saved search configurations. |
| `/dashboard/tenant/profile` | `/api/users/profile` | `GET`, `PUT` | Fetches and updates tenant's personal and contact information. |

### 💳 Payment Flow (Tenant)
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/dashboard/tenant/requests/[id]/pay` | `/api/payments/create-checkout-session` | `POST` | Initiates Stripe Checkout session and returns session URL. |
| `/payment/success` (Webhook handler) | `/api/payments/webhook` | `POST` | (Backend) Stripe webhook updates DB status to `PAID`/`ACTIVE`. |
| `/dashboard/tenant/payments` | `/api/payments/my-payments` | `GET` | Fetches complete transaction history for the tenant. |

---

## 🏢 Landlord Dashboard (`/dashboard/landlord`)
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/dashboard/landlord` | `/api/landlord/stats` | `GET` | Fetches landlord stats (Properties, Pending Rentals, Earnings). |
| `/dashboard/landlord/properties` | `/api/landlord/properties` | `GET` | Fetches all properties listed by the logged-in landlord. |
| `/dashboard/landlord/properties/new`| `/api/properties` | `POST` | Creates a new property listing with images and map coordinates. |
| `/dashboard/landlord/properties/edit`| `/api/properties/:id` | `PUT` | Updates existing property details and availability. |
| `Delete Property Action` | `/api/properties/:id` | `DELETE` | Removes a property listing from the platform. |
| `/dashboard/landlord/requests` | `/api/landlord/requests` | `GET` | Fetches incoming rental requests from tenants. |
| `Approve/Reject Action` | `/api/rentals/:id/status` | `PATCH` | Updates request status to `APPROVED` or `REJECTED`. |
| `/dashboard/landlord/saved-searches`| `/api/saved-searches` | `GET` | Retrieves the landlord's saved search configurations. |
| `/dashboard/landlord/profile` | `/api/users/profile` | `GET`, `PUT` | Fetches and updates landlord's personal and contact information. |

---

## 👑 Admin Dashboard (`/dashboard/admin`)
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `/dashboard/admin` | `/api/admin/stats` | `GET` | Fetches global platform metrics (Users, Properties, Requests). |
| `/dashboard/admin/users` | `/api/admin/users` | `GET` | Fetches a complete list of all registered users. |
| `Ban/Unban User Action` | `/api/admin/users/:id/status`| `PATCH` | Toggles user account status (`ACTIVE` / `BANNED`). |
| `/dashboard/admin/properties` | `/api/properties` | `GET` | Fetches all properties across the platform for moderation. |
| `/dashboard/admin/requests` | `/api/rentals/all` | `GET` | Fetches all rental requests across the platform. |
| `/dashboard/admin/saved-searches` | `/api/admin/saved-searches` | `GET` | Views saved searches categorized by Tenant/Landlord/Admin. |
| `/dashboard/admin/messages` | `/api/contact-messages` | `GET` | Retrieves contact form submissions. |
| `Delete Message Action` | `/api/contact-messages/:id` | `DELETE`| Deletes a resolved contact message. |
| `/dashboard/admin/profile` | `/api/users/profile` | `GET`, `PUT` | Fetches and updates admin's personal information. |

---

## ✉️ Other Integrations
| Frontend Route / Action | Backend API Endpoint | HTTP Method | Purpose |
| :--- | :--- | :--- | :--- |
| `Contact Form Submission` | `/api/contact-messages` | `POST` | Sends user inquiries from the `/contact` page to the admin. |