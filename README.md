# College Buzz 🎓

**A full-stack campus event discovery, registration, and management platform built for students, organizers, and college administrators.**

CHECK OUT: https://college-buzz2026.vercel.app/


College Buzz provides a centralized platform for discovering and managing university events such as workshops, hackathons, cultural programs, technical events, sports activities, and student-led initiatives.

The platform combines a responsive React frontend with Supabase-powered authentication, PostgreSQL data management, Row Level Security, and cloud storage.

---

## ✨ Features

### 🎓 Student Experience

* Discover upcoming college events
* Search and filter events by category, college, date, and keywords
* View detailed event information
* Register for events
* Generate digital QR-based entry passes
* Prevent duplicate registrations
* Track registered and saved events

### 🏫 Organizer & Administrator Experience

* Create and publish events
* Edit and manage event details
* Upload event banners and media
* Manage event registrations
* Monitor attendee information
* Manage events according to role-based permissions

### 🔐 Security

* Supabase Authentication
* PostgreSQL Row Level Security (RLS)
* Role-based access control
* User-specific data access policies
* Database-level authorization for protected operations
* Secure Supabase Storage policies

---

## 🏗️ Architecture

```text
                         College Buzz
                              │
                              ▼
                    ┌──────────────────┐
                    │   React + Vite   │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                    Supabase Client
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
        Supabase Auth    PostgreSQL       Supabase Storage
             │               │                │
             │          Row Level Security    │
             └───────────────┼────────────────┘
                             │
                             ▼
                     Secure Data Layer
```

The application uses Supabase as the backend platform for authentication, PostgreSQL database operations, storage, and authorization.

---

## 🛠️ Technology Stack

| Layer            | Technologies                  |
| ---------------- | ----------------------------- |
| Frontend         | React 19, TypeScript          |
| Styling          | Tailwind CSS v4               |
| Routing          | React Router v7               |
| Icons            | Lucide React                  |
| Backend Platform | Supabase                      |
| Database         | PostgreSQL                    |
| Authentication   | Supabase Auth                 |
| Storage          | Supabase Storage              |
| Authorization    | PostgreSQL Row Level Security |
| API Layer        | Supabase PostgREST            |
| Build Tool       | Vite 8                        |
| Deployment       | Vercel                        |

---

## 📂 Project Structure

```text
college-buzz/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── ...
│
├── supabase/
│   └── migrations/
│
├── public/
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd college-buzz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` or `.env.local` file using `.env.example` as a template.

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Never commit `.env` or `.env.local` to the repository.

### 4. Configure the database

Apply the migrations located in:

```text
supabase/migrations/
```

These migrations define the College Buzz database schema, constraints, storage configuration, and Row Level Security policies.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown by Vite.

---

## 📦 Production Build

Create an optimized production build:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

The application can be deployed using platforms such as Vercel, Netlify, or Cloudflare Pages.

---

## 🔐 Environment & Security

College Buzz uses environment variables for Supabase configuration.

Only the following client-side configuration is required:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Privileged Supabase credentials must never be exposed in frontend code or committed to source control.

Database access is protected using PostgreSQL Row Level Security policies.

---

## 🗄️ Database

The application uses PostgreSQL through Supabase.

The database is managed through version-controlled migrations under:

```text
supabase/migrations/
```

The schema includes data relationships for users, colleges, events, registrations, and related platform functionality.

Database constraints and RLS policies are used to enforce data integrity and authorization at the database layer.

---

## 🚀 Deployment

The production architecture is designed around:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
React + Vite
   │
   ▼
Supabase
 ┌─┴──────────────┐
 │                │
Auth          PostgreSQL
 │                │
 └───────┬────────┘
         │
      Storage
```

For production deployment:

1. Connect the GitHub repository to Vercel.
2. Configure the required Supabase environment variables.
3. Build using:

```bash
npm run build
```

4. Deploy the generated application.
5. Configure the production URL in Supabase Authentication.
6. Verify authentication, database access, storage, and RLS policies in production.

---

## 🎯 Project Objective

College Buzz was designed to address the fragmented way students discover and manage campus activities.

The platform provides a centralized digital ecosystem where:

**Students discover → Register → Receive entry passes**

while:

**Organizers create → Publish → Manage → Track events**

---

## 📌 Project Status

**Production-ready full-stack application**

The project is actively developed with a focus on scalable architecture, secure database access, role-based authorization, and deployment-ready infrastructure.

---

## 📄 License

MIT License
