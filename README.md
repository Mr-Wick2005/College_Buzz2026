# 🎓 College Buzz — The Pulse of Campus Life & Events

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **College Buzz** is a modern, real-time social event discovery and digital ticketing platform designed for university campuses across India and worldwide. From 48-hour hackathons and robotics symposiums to multi-stage cultural concerts and inter-collegiate esports tournaments, College Buzz connects students directly with campus life.

---

## ⚡ Key Highlights & Design Identity

Inspired by the gold standards in modern social & event web architecture (**Luma**, **Partiful**, **Geneva**, and **Cosmos** on Mobbin):

* **Bespoke Typography Pairing**:
  * **Headlines / Display**: [`Syne`](https://fonts.google.com/specimen/Syne) — heavy, geometric display font bringing vibrant festival energy.
  * **Body / Interface**: [`Plus Jakarta Sans`](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — refined, clean, high-legibility typography.
  * **Metrics & Tokens**: [`Space Grotesk`](https://fonts.google.com/specimen/Space+Grotesk) and [`JetBrains Mono`](https://fonts.google.com/specimen/JetBrains+Mono) — for authentic digital ticket codes, dates, and live indicators.
* **Deep Void Obsidian Palette**: Tactile dark-mode aesthetics (`#07090C`, `#0E1118`, `#121622`) with specular 1px border glows and frosted glass layers (`backdrop-blur-2xl`).
* **Zero Boilerplate**: Dynamic aurora meshes, micro-animations, glowing status badges (`● LIVE NOW`, `⚡ SELLING FAST`), and zero generic AI design patterns.

---

## 🚀 Core Features

### 1. 🔍 Discovery Feed & Event Experience
* **Interactive Search & Campus Filter**: Search by keyword, fest name, speaker, or filter by partner universities (*MIT*, *Stanford*, *IIT Bombay*, *Harvard*, *Berkeley*, *BITS Pilani*).
* **Continuous University Marquee**: Smooth ticker highlighting active collegiate hubs.
* **Campus Hype Reels (Stories)**: Instagram/Partiful-style circular story rings with progress bars, soundcheck teasers, and festival hype updates.
* **Headline Spotlight Fest**: Hero showcase card featuring a live countdown clock (`Days : Hours : Mins : Secs`), attendee facepile, verified college seal, and one-click RSVP.
* **Dual View Mode**:
  * **Card Feed**: Stacked date pills (`MAR / 28`), category badges, animated like bookmarks with real-time toast feedback, and quick share triggers.
  * **Timeline / Calendar View**: Luma-style chronological agenda for planning campus weekends.
* **Event Details Slide-Over Sheet**: Opens detailed itinerary breakdown, guest speakers, auditorium maps, capacity gauges, and instant ticket claim.

### 2. 🎟️ Student Portal & Digital Boarding Pass Wallet
* **Boarding Pass Ticket Aesthetics**: Real-time pass wallet with authentic perforated ticket styling.
* **Verified QR Code Tokens**: Each claimed pass generates a unique cryptographic entry code for instant gate scanning.
* **Offline Pass Storage**: Save passes to local storage for instant presentation at campus auditorium doors without internet latency.
* **Watchlist & Liked Fests**: Bookmark upcoming events to track schedule drops.

### 3. 🏛️ College Host Studio (Organizer Console)
* **Real-Time Attendee Rosters**: View student registrations, contact details, and admission status per event.
* **Live Event Publisher**: Create, edit, and schedule workshops, hackathons, and concerts with image upload to Supabase Storage.
* **KPI Metrics**: Real-time analytics on discovery impressions, active RSVPs, and seat fill rate.

### 4. 🛡️ Supabase Cloud Architecture & Security
* **Authentication**: Email/Password and session management via Supabase GoTrue.
* **PostgreSQL RLS Policies**: Row Level Security safeguards attendee registrations and college admin permissions.
* **Fail-Safe Offline Mode**: Pre-seeded fallback data ensures 100% platform uptime even during edge connectivity drops.

---

## 🏗️ Project Architecture

```text
College_Buzz2026/
├── index.html                 # Vite HTML shell with preconnected Google Fonts
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite 8 config with Tailwind v4 & React plugins
├── vercel.json                # Vercel deployment & SPA routing rewrites
│
├── src/
│   ├── main.tsx               # Application entry point
│   ├── App.tsx                # Base router & ProtectedRoute wrappers
│   ├── index.css              # Tailwind v4 @theme, custom scrollbars, glass tokens
│   │
│   ├── components/
│   │   ├── AnimatedSection.jsx  # Intersection observer micro-animations
│   │   ├── ContactForm.jsx      # Direct campus coordinator email dispatch
│   │   ├── FloatingElements.jsx # Multi-layered ambient aurora mesh glow
│   │   ├── ImageCropper.jsx     # Event cover image cropping tool
│   │   ├── ProtectedRoute.jsx   # Role-based route guard ('student' | 'admin')
│   │   └── Layout/
│   │       ├── Header.jsx       # Floating glass dock with live status & ⌘K search
│   │       ├── Footer.jsx       # Editorial social footer & system status pill
│   │       └── Layout.jsx       # Global page layout container
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Supabase authentication session & profile sync
│   │
│   ├── lib/
│   │   ├── supabase.js          # Supabase API helpers (auth, events, passes, upload)
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client singleton
│   │       └── index.ts
│   │
│   └── pages/
│       ├── Home.jsx             # Public landing page with Mobbin social event feed
│       ├── StudentAuth.jsx      # Student portal login & registration split layout
│       ├── CollegeAuth.jsx      # University organizer onboarding & host sign-in
│       ├── StudentDashboard.jsx # Pass wallet, verified QR badges, and watchlist
│       └── AdminDashboard.jsx   # Organizer studio, attendee roster, and event publisher
│
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql             # Base tables, profiles, RLS
    │   ├── 002_college_buzz_core_schema.sql   # Event relational constraints
    │   └── 003_storage_and_registrations.sql  # Supabase Storage bucket policies
    └── functions/                             # Supabase Edge Functions
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

| Table | Primary Columns | Purpose |
|---|---|---|
| `profiles` | `id` (FK `auth.users`), `role`, `full_name`, `college`, `contact_number` | Stores student and college organizer profiles |
| `events` | `id`, `title`, `description`, `category`, `date`, `time`, `location`, `capacity`, `image_url`, `organizer_id` | Campus festivals, seminars, and hackathons |
| `registrations` | `id`, `event_id`, `student_id`, `qr_code`, `registered_at`, `status` | Student event RSVP passes with verified QR hash |

### Row Level Security (RLS)
* **Public**: Read-only access to published college events.
* **Students**: Can only view and cancel their own event registrations.
* **College Organizers**: Full CRUD permissions on events they created and access to that event's attendee roster.

---

## 🛠️ Getting Started Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm**

### 1. Clone the repository
```bash
git clone https://github.com/Mr-Wick2005/College_Buzz2026.git
cd College_Buzz2026
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **`http://localhost:8443`** in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🌐 Deployment Guide (Vercel)

The repository is configured for one-click deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the project into **Vercel**.
3. In Project Settings → Environment Variables, add:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy! The included [`vercel.json`](file:///d:/All%20Projects/College_Buzz2026/vercel.json) handles automatic client-side SPA routing rewrites.

---

## 🤝 Contributing

Contributions to College Buzz are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/CampusLiveChat`)
3. Commit your Changes (`git commit -m 'feat: Add Campus Live Chat Room'`)
4. Push to the Branch (`git push origin feature/CampusLiveChat`)
5. Open a Pull Request

---

## 📄 License & Credits

Distributed under the **MIT License**.

Crafted with ❤️ for students, creators, and university festival organizers across India and the world.  
**Creator & Maintainer**: [Vedanth Gali](https://www.linkedin.com/in/vedanth-gali-00683328b/) (vedantmgali@gmail.com)
