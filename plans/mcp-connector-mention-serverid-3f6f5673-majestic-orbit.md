# Context

The user has an existing full-stack project called **CollegeBuzz** (GitHub: `Mr-Wick2005/CB_react`) — a college event management platform — and wants to bring the frontend into this Figma Make workspace to continue developing it here.

The frontend is React 18 + Vite + Tailwind CSS v3 + React Router v7. The Figma Make environment is React 19 + Vite + Tailwind CSS **v4** — fully compatible with a few minor adaptations.

The backend (Node/Express/MySQL) cannot run here, so API calls will be pointed at the deployed backend URL or mocked with static data during UI development.

---

## What's in the repo

**Pages** (`frontend/src/pages/`):
- `Home.jsx` (23 KB) — Landing page with animated sections, features, contact form
- `StudentAuth.jsx` (14 KB) — Student login/register with Google OAuth
- `CollegeAuth.jsx` (19 KB) — College admin login/register
- `AdminDashboard.jsx` (48 KB) — Event management for colleges
- `StudentDashboard.jsx` (17 KB) — Student event browsing & registration

**Components** (`frontend/src/components/`):
- `Layout/` — Navbar + Outlet wrapper
- `AnimatedSection.jsx` — Scroll-reveal wrapper
- `ContactForm.jsx` — EmailJS-powered contact form
- `FloatingElements.jsx` — Decorative background animations
- `ImageCropper.jsx` — Profile picture crop tool (uses `react-image-crop`)

**Routing** (`App.jsx`): React Router v7 with protected routes using `localStorage.getItem("token")`.

**Dependencies needed** (not in current Figma Make project):
- `react-router-dom` ^7
- `lucide-react` ^0.344
- `@react-oauth/google` ^0.12
- `jwt-decode` ^4
- `react-image-crop` ^11
- `emailjs-com` ^3.2

---

## Implementation Plan

### Step 1 — Install missing dependencies
```
pnpm add react-router-dom lucide-react @react-oauth/google jwt-decode react-image-crop emailjs-com
```

### Step 2 — Port source files
Copy all files from the GitHub repo into `src/`:

- `src/App.jsx` — Replace current `src/App.tsx` with the CollegeBuzz App.jsx (rename/adapt to .tsx or keep .jsx)
- `src/pages/Home.jsx`
- `src/pages/StudentAuth.jsx`
- `src/pages/CollegeAuth.jsx`
- `src/pages/AdminDashboard.jsx`
- `src/pages/StudentDashboard.jsx`
- `src/components/Layout/` (fetch and copy Layout.jsx + any sub-files)
- `src/components/AnimatedSection.jsx`
- `src/components/ContactForm.jsx`
- `src/components/FloatingElements.jsx`
- `src/components/ImageCropper.jsx`

### Step 3 — Adapt Tailwind v3 → v4
The original uses Tailwind v3 (`@tailwind base/components/utilities` directives). Figma Make uses v4 (`@import 'tailwindcss'`). The existing `src/index.css` already has the correct v4 import — no change needed there. The utility classes used in the components are compatible; no class-level changes required.

### Step 4 — Adapt `src/main.tsx`
Wrap the app with `GoogleOAuthProvider` (required by `@react-oauth/google`):
```tsx
import { GoogleOAuthProvider } from '@react-oauth/google'
// ...
root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
    <App />
  </GoogleOAuthProvider>
)
```

### Step 5 — Environment variable
Add `VITE_API_BASE` to point at the backend (deployed Render URL or localhost). For now, default to the Render production URL if one exists, or a placeholder that gracefully fails so the UI still renders.

### Step 6 — Fetch Layout sub-components
Before writing files, fetch `frontend/src/components/Layout/` directory listing and copy all files within it (likely `Layout.jsx`, `Navbar.jsx`, `Footer.jsx`).

---

## Key files to modify
- `src/App.tsx` → replaced with ported `App.jsx` content
- `src/main.tsx` → add GoogleOAuthProvider wrapper
- `src/index.css` → unchanged (already Tailwind v4)
- All new files created under `src/pages/` and `src/components/`

## Reuse
- Existing `src/index.css` Tailwind import is correct as-is
- Existing `vite.config.ts` and `index.html` require no changes

## Verification
1. Dev server hot-reloads — app should render the CollegeBuzz home page
2. Navigate to `/student-auth` and `/college-auth` — auth forms appear
3. Check browser console for any missing env var warnings (expected if no backend configured)
4. Protected routes (`/admin-dashboard`, `/student-dashboard`) redirect correctly when no token in localStorage
