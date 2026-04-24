# AlgoForge

A **learning-tracker SPA** for algorithm prep and structured study. Create journeys (e.g. DSA, system design), add items (problems/topics), and log submissions with code, complexity, and notes. Built with React, Redux Toolkit Query, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | React 19, Vite 7 |
| **State & API** | Redux Toolkit, RTK Query (with cache tags & invalidation) |
| **Routing** | React Router v7 (nested routes, protected & guest-only) |
| **Styling** | Tailwind CSS v4, Plus Jakarta Sans |
| **UX** | Sonner toasts, theme (light/dark/system), responsive layout |
| **Deploy** | Vercel (SPA rewrites) |

---

## Functionalities

### Authentication
- **Register** – Username, email, password; client-side validation (email format, username rules, password strength, confirm password); password visibility toggle; inline errors and API error display.
- **Login** – Email + password; validation; password visibility toggle; error handling.
- **Session** – JWT in `localStorage`; `RequireAuth` / `GuestOnly` route guards; 401 handling with redirect to login and logout.
- **Auth UI** – Two-column layout (form left, marketing/hero right); app logo; mobile-friendly.

### Dashboard
- **Totals** – Total items, total submissions, current streak, longest streak (from `/auth/dashboard`).
- **Active journey** – Title, status, completed / remaining / target items.
- **Activity** – Today’s and weekly submissions; recent activity list (item title, journey, solving method, timestamp).
- **Loading** – Dashboard skeleton matching the real layout.

### Journeys
- **List** – All user journeys with search, filters (type, status), sort (last activity, title, created, status), and view modes: Tiles, Cards, Detailed, List (table).
- **Create** – Full journey form (title, description, type, status, visibility, category, target items, dates, topic tags, etc.); validation and server-error mapping; success state with “Go to journey” and short how-to.
- **Edit** – Same form pre-filled; update and delete (with confirm); loading skeleton.
- **Detail** – Breadcrumb, title, status/visibility pills, stat cards (items, completed, target, progress %), progress ring, topic tags, metadata; **Items** section (see below) and timeline.
- **Delete** – Confirm dialog; cache invalidation for list and dashboard.
- **Mobile** – Search always visible; filters/sort/layout behind “Filters & sort” toggle.
- **Loading** – Journey list uses card skeletons; journey detail uses a full-page skeleton.

### Items (within a journey)
- **List** – In JourneyDetails via `JourneyItemsSection`: search, filters (type, status, platform, difficulty, tags), sort (order, created, updated, title, status, type, submission count, etc.), view modes (Tiles, Cards, Detailed, List); item count and completed count.
- **Create** – Item form (title, description, type, status, platform, difficulty, tags, notes, resources, flags, etc.); validation; success and link back to journey.
- **Edit** – Same form; update and delete with confirmation.
- **Detail** – Item header (title, description, edit link); **submission form** (left) and **code editor** (right); submission history below.
- **Loading** – Items section uses a dedicated skeleton; item detail uses a split skeleton (form + code area).

### Submissions (per item)
- **Log submission** – Solving method, language (+ version), code (Prism-highlighted editor), time/space complexity, notes (with fullscreen), external URL, result status, tags, star, flag color; required-field validation; “Save submission” with loader.
- **History** – List of past submissions with method, language, complexity, result badge, flag, date; code expand/collapse.
- **Create/Update/Delete** – Mutations with cache invalidation (submissions list, item, dashboard).

### Profile
- **Identity** – Email (read-only), display name, bio.
- **Location** – Country, state, city (with geo data: countries, India states/cities).
- **Work** – Multiple work entries (company, role, period, etc.) with add/remove.
- **Education** – Multiple education entries with add/remove.
- **Skills** – Skill chips (add/remove).
- **Social** – Multiple social links (type + URL) with configurable max.
- **Preview** – Live preview of public profile; edit/preview toggle.
- **Save** – “Save & preview” with loader; toast and optional success state.

### Settings
- **Appearance** – Theme: System / Light / Dark; persisted in `localStorage`; syncs with OS when System.
- **Profile shortcut** – Link to profile editor.

### About
- **App overview** – Interactive flow map (Dashboard → Journeys → Items → Submissions; Profile & Settings); summary and quick-start; feature list and links.

### Global UX
- **Loaders** – Spinner on all main form submit buttons (login, register, create/edit journey, create/edit item, save submission, profile save).
- **Skeletons** – Dashboard, journey list (card skeleton), journey detail, item detail, items section; aligned with real content layout.
- **Toasts** – Success/error for API actions via Sonner.
- **Theme** – Full light/dark support; theme toggle in Settings.
- **Responsive** – Sidebar + mobile nav; responsive tables and grids; collapsible filters on journeys (mobile).
- **Accessibility** – ARIA where relevant; focus management; semantic HTML.

---

## Project Structure

```
src/
├── api/              # RTK Query slice + auth, journeys, items, submissions, dashboard
├── components/       # Shared UI (Sidebar, MobileNav, cards, forms, skeletons, etc.)
├── constants/        # Enums, labels, limits (journey, item, submission, topics, social)
├── context/          # ThemeContext (theme preference + resolved)
├── data/             # Static data (geo, item picklists)
├── features/         # Journey form + state, Item form + state
├── layouts/          # AuthLayout (split), AppLayout (sidebar + outlet)
├── pages/            # Route-level pages (Dashboard, Journeys, Profile, etc.)
├── routes/           # Router with RequireAuth / GuestOnly
├── store/            # Redux store + authSlice
└── utils/            # Toast helpers, validation, constants, avatar, etc.
```

---

## Setup

1. **Env** – Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend (e.g. `http://localhost:5123/api`).
2. **Install** – `npm install`
3. **Dev** – `npm run dev`
4. **Build** – `npm run build` (output in `dist/`)
5. **Lint** – `npm run lint`

Backend must expose REST APIs for auth, journeys, items, submissions, and dashboard (see `src/api/` for expected endpoints and payloads).

### Connecting to a remote backend (e.g. EC2)

When the frontend runs on one origin (e.g. `http://localhost:5173`) and the API on another (e.g. `http://35.154.216.23:5123`), the browser treats it as cross-origin and will block requests unless the **backend** allows it.

1. **Frontend** – In `.env` set:
   ```bash
   VITE_API_URL=http://35.154.216.23:5123/api
   ```
   Restart the dev server after changing `.env`.

2. **Backend** – Enable CORS so the browser allows requests from your frontend origin. In your Node/Express server (e.g. `src/server.js`):
   ```bash
   npm install cors
   ```
   ```js
   const cors = require('cors');
   app.use(cors({ origin: '*', credentials: true }));
   // or simply: app.use(require('cors')());
   ```
   Then restart the backend (e.g. `pm2 restart algoforge`).

Without CORS enabled on the backend, you’ll see `TypeError: Failed to fetch` and “Provisional headers” in the Network tab because the browser blocks the request before it reaches the server.

---

## Resume assessment (3-year fullstack developer)

**Verdict: Yes, this project is good for a 3-year fullstack developer’s resume.**

- **Frontend depth** – React 19, hooks, controlled forms, validation, and RTK Query (cache, tags, invalidation) show solid modern React and state management.
- **UX** – Auth flows, protected routes, loaders on submit, content-matched skeletons, theme, and responsive/mobile patterns are all resume-worthy.
- **Structure** – Clear separation of API, store, features, layouts, and pages; reusable components and constants mirror backend models.
- **Domain** – Non-trivial product (journeys → items → submissions, profile, dashboard) with multiple CRUD flows and list/detail views.
- **Deployment** – Vercel config and SPA rewrites show awareness of production deployment.

To strengthen the resume further: add tests (e.g. Vitest + React Testing Library for critical flows), a short “Tech decisions” or “What I’d improve” section in the README, and if you have a backend repo, link it and briefly describe the fullstack scope (e.g. Node/Express + MongoDB or similar).
