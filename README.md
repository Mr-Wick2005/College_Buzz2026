# College Buzz 🎓🚀

A modern full-stack event discovery and registration platform designed for university campuses, student organizations, and college administrators.

---

## 🌟 Key Features

- **Event Discovery & Catalog**: Explore upcoming campus workshops, cultural fests, hackathons, sports tournaments, and webinars with real-time multi-criteria filtering (category, host college, date, and search keywords).
- **Digital Entry Passes**: Instant QR-coded ticket generation upon event registration with duplicate registration prevention and capacity tracking.
- **Role-Based Access Control**:
  - **Students**: Browse events, claim entry passes, bookmark favorites, and manage registrations.
  - **Administrators / Organizers**: Publish events, upload banners directly to Supabase Storage, modify event details, monitor live analytics, and inspect real-time attendee rosters.
- **Secure Supabase Integration**: PostgreSQL Row Level Security (RLS) guarantees data isolation across users and organizers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, React Router v7
- **Backend & Database**: Supabase (PostgreSQL 15+, GoTrue Auth, Storage CDN, PostgREST)
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v20.x or higher recommended)
- npm / pnpm / yarn

### 2. Installation

Clone the repository and install project dependencies:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 4. Database Setup

Apply the SQL migrations located in `supabase/migrations/` inside your Supabase Project's SQL Editor:
1. `supabase/migrations/002_college_buzz_core_schema.sql` (Tables, Constraints, Indexes, Triggers, RLS Policies)
2. `supabase/migrations/003_storage_and_registrations.sql` (Storage buckets and access policies)

### 5. Running Locally

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8443` (or configured `$PORT`).

---

## 📦 Building for Production

Create an optimized production bundle:

```bash
npm run build
```

The output files will be generated in the `dist/` directory ready for deployment on Vercel, Netlify, or Cloudflare Pages.

---

## 📄 License

MIT License. Built for university communities.
