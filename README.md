# JP Smart Solutions Academy — Learning Management System (LMS)

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E)](https://supabase.com/)
[![Cloudflare Stream](https://img.shields.io/badge/Cloudflare-Stream_Video-F38020)](https://www.cloudflare.com/products/cloudflare-stream/)
[![Paystack](https://img.shields.io/badge/Paystack-Payments_NGN-00C3F7)](https://paystack.com/)

A modern, high-performance, full-stack Learning Management System designed and engineered for **JP SMART SOLUTIONS LTD**, a premier engineering consultancy and technical training provider headquartered in Port Harcourt, Rivers State, Nigeria.

The platform provides practical, simulation-driven engineering masterclasses in **ETAP software**, **Power System Analysis**, **Relay Protection Coordination**, and **Solar PV System Design**.

---

## 🎨 Brand Design System

Built strictly according to JP Smart Solutions Ltd brand specifications:
- **Primary Brand Blue (`jpblue`):** `#0B63CE`
- **Dark Neutral (`jpdark`):** `#071525`
- **Muted Slate (`jpmuted`):** `#607086`
- **Light Slate Background (`jplight`):** `#F3F7FC`
- **Accent Cyan (`jpcyan`):** `#14B8D4`
- **Typography:** Inter (Google Font)
- **Component Geometry:** 22px card corner radiuses, pill buttons (`border-radius: 999px`), custom elevated card drop-shadows

---

## 🚀 Key Architectural Features

1. **Next.js 15 App Router & Server Components:**
   - Server-first data fetching using `@supabase/ssr` with full cookie session refresh in `middleware.ts`.
   - Dynamic route grouping: `(public)`, `(auth)`, `(student)`, `(instructor)`, `(admin)`.

2. **Ultra-Secure Video Streaming (Cloudflare Stream):**
   - Anti-piracy signed URL token exchange via `/api/video/token` verifying active student enrolment.
   - Dynamic floating watermark overlay showing masked student email (`jo***@example.com`).
   - Resumable video playback with automated position reporting every 30 seconds to `/api/video/progress`.

3. **Nigerian Payment Gateway (Paystack):**
   - Seamless checkout for cards, bank transfer, and USSD in Nigerian Naira (`NGN`).
   - Server-side verification and webhook handler (`/api/payments/webhook`) with HMAC SHA512 signature authentication.
   - Idempotent enrolment creation upon payment confirmation.

4. **Multi-Role RBAC with Database Row Level Security (RLS):**
   - Roles: `student`, `instructor`, `admin`, `super_admin`.
   - Comprehensive Postgres RLS policies ensuring students can only access enrolled videos and their own progress.
   - Administrative and security audit logging (`audit_logs` table).

5. **Dynamic Feature Flags Control Centre:**
   - Platform settings toggleable in runtime: Certificates, Quizzes, Assignments, Discussions, Maintenance Mode.

---

## 📦 Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Frontend:** React 19, TypeScript, Tailwind CSS, shadcn/ui primitives, Radix UI, Lucide Icons
- **Database & Auth:** Supabase PostgreSQL with RLS, GoTrue Auth
- **Video Delivery:** Cloudflare Stream (`@cloudflare/stream-react`)
- **Payments:** Paystack API & Webhooks
- **Email:** Resend API with responsive HTML templates

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js 20.x or 22.x
- npm or pnpm
- A Supabase project

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/BuduTec/LMS-JP-SMART-SOLUTIONS.git
cd LMS-JP-SMART-SOLUTIONS
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials as detailed in the Environment Variables section below.

### 4. Apply Database Migrations
Migrations are stored in `supabase/migrations/`:
- `20261102000001_create_core_schema.sql`
- `20261102000002_enable_rls_and_policies.sql`
- `20261102000003_seed_categories_and_courses.sql`

You can apply them using the Supabase CLI:
```bash
supabase db push
```
Or execute the SQL scripts directly in the **Supabase Dashboard SQL Editor** for project `wloxgtyqwktyksgqiitu`.

### 5. Run Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables Guide

```ini
# ==============================================================================
# Supabase Configuration
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://wloxgtyqwktyksgqiitu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# ==============================================================================
# Paystack Payment Gateway
# ==============================================================================
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_WEBHOOK_SECRET=sk_test_...

# ==============================================================================
# Cloudflare Stream
# ==============================================================================
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_STREAM_API_TOKEN=...
CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN=customer-xxxx.cloudflarestream.com
CLOUDFLARE_STREAM_SIGNING_KEY_ID=...
CLOUDFLARE_STREAM_SIGNING_KEY_JWK=...
NEXT_PUBLIC_CF_STREAM_CUSTOMER_SUBDOMAIN=customer-xxxx.cloudflarestream.com

# ==============================================================================
# Email Service (Resend)
# ==============================================================================
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=academy@jpsmartsolutions.com
RESEND_FROM_NAME=JP Smart Solutions Academy

# ==============================================================================
# Application URL
# ==============================================================================
NEXT_PUBLIC_APP_URL=https://academy.jpsmartsolutions.com
NEXT_PUBLIC_APP_NAME=JP Smart Solutions Academy
```

---

## 👑 First-Run Super Admin Setup

When bootstrapping a fresh deployment, elevate your user account to `super_admin`:

1. Sign up on the platform via `/register`.
2. Open your **Supabase Project SQL Editor** and run:
```sql
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-email@company.com';
```
3. Sign out and sign back in. You will now have full access to `/admin/dashboard`.

---

## 🏢 Company & Support Contact

- **Company:** JP SMART SOLUTIONS LTD
- **Address:** Rumuruji Street, Rumuodara, Port Harcourt, Rivers State, Nigeria
- **Phone:** +234 906 737 4854
- **WhatsApp:** 2349067374854
- **Email:** info@jpsmartsolutions.com / support@jpsmartsolutions.com
