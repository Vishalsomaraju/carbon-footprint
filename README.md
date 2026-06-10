# 🌍 Carbon Footprint Tracker

> **Track your impact. Make smarter choices. Live sustainably.**

A production-ready Progressive Web App (PWA) that empowers individuals to measure, understand, and reduce their personal carbon footprint — powered by AI insights, real-time route analysis, and beautiful data visualizations.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-143%20passing-4edea3)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)

---

## ✨ Features

### 📊 Personal Dashboard
- **7-day emission trend chart** — area chart showing your CO2 output over the past week
- **Weekly summary cards** — total emissions vs. your personal weekly goal
- **Streak tracking** — milestones at 3, 7, 14, 30, 60, and 90 consecutive days of logging
- **Regional comparison** — see how you compare to averages in the US, UK, EU, India, and globally
- **Daily progress indicator** — benchmarked against the 1.5°C-aligned target of 6.3 kg CO2/day

### 📝 Activity Logger
- **Multi-step guided form** — step-by-step flow for Transport, Food, Energy, and Shopping categories
- **CO2 auto-calculation** — all emission factors are science-backed (IPCC-aligned)
- **Validation & error states** — full Zod schema validation with per-field messages
- **Confirmation step** — review before you save to Firestore

### 🚗 Commute Analyser
- **Google Maps integration** — autocomplete address search powered by the Places API
- **Route CO2 comparison** — calculates emissions for driving, public transit, cycling, and walking side-by-side
- **Annual projection chart** — bar chart projecting yearly savings if you switch transport modes
- **Distance calculation** — real routing geometry via the Maps JavaScript API

### 💡 AI Insights (Gemini)
- **Personalised weekly tips** — Gemini 1.5 Flash analyses your activity log and generates tailored reduction tips
- **Insight chat** — an interactive AI chat window to ask sustainability questions in real time
- **Rate-limited generation** — 60-second cooldown prevents excessive API calls

### 👤 Profile & Goals
- **Google Sign-In** — one-tap Firebase Auth login
- **Weekly CO2 goal slider** — set your personal weekly target (20–150 kg CO2)
- **Settings persistence** — goal and region preferences synced to Firestore in real time

### ⚡ PWA & Performance
- **Offline-first** — service worker via Workbox caches all assets for offline use
- **Installable** — add to your home screen on Android and iOS
- **Code splitting** — route-level lazy loading for fast initial load
- **Gzip budget** — main bundle under 133 KB gzipped

---

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components (domain-organised)
│   ├── auth/            # ProtectedRoute, sign-in gate
│   ├── commute/         # CommuteForm, CommuteResults, PlaceSearch
│   ├── dashboard/       # WeeklyChart, SummaryCard, StreakBadge
│   ├── insights/        # InsightCard, InsightChat, TipsDisplay
│   ├── landing/         # FeatureCard, HeroSection
│   ├── log/             # ActivityForm, ConfirmationStep, steps
│   ├── profile/         # GoalSlider, RegionSelector
│   └── ui/              # Button, Input, LoadingSpinner, Toast, ErrorBoundary
├── constants/           # All emission factors, routes, thresholds (no magic values)
├── contexts/            # AuthContext (React Context + Firebase Auth)
├── hooks/               # Custom data hooks (useActivities, useInsights, useCommute, …)
├── layouts/             # AppLayout (navigation shell)
├── lib/                 # Firebase initialisation, env validation
├── pages/               # Route-level page components
├── services/            # API boundary layer (Firestore, Gemini, Maps, Auth)
├── types/               # Shared TypeScript interfaces
└── utils/               # CO2 calculator, validation schemas, tips engine, errorTracker
```

### Key Design Decisions

| Concern | Choice | Reason |
|---|---|---|
| State | Custom hooks + React Context | Lightweight; no Redux overhead needed |
| Forms | react-hook-form + Zod | Best-in-class DX, zero re-renders on input |
| Data | Firebase Firestore | Real-time, offline persistence, free tier |
| Charts | Recharts | Composable, tree-shakeable, SSR-friendly |
| Auth | Firebase Auth (Google) | One-tap, secure, no passwords to manage |
| AI | Google Gemini 1.5 Flash | Fast inference, generous free tier |
| Maps | Google Maps JS API | Best autocomplete and routing quality |
| Styling | Tailwind CSS v3 | Utility-first, design tokens in config |
| Testing | Vitest + Testing Library | Native ESM, fast, React 19 compatible |
| PWA | vite-plugin-pwa + Workbox | Zero-config service worker generation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Firebase** project with Firestore and Google Auth enabled
- A **Google Gemini** API key ([get one here](https://aistudio.google.com/))
- A **Google Maps** API key with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Directions API

### 1. Clone the Repository

```bash
git clone https://github.com/Vishalsomaraju/carbon-footprint.git
cd carbon-footprint
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Configure Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

```dotenv
# .env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_MAPS_API_KEY=your_maps_key_here
```

### 4. Set up Firestore Security Rules

Deploy the included Firestore rules so users can only access their own data:

```bash
firebase deploy --only firestore:rules
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

The test suite contains **143 tests** across **34 test files**, covering services, hooks, components, and pages.

### Run All Tests

```bash
npm test
```

### Run with Coverage Report

```bash
npm run test:coverage
```

Coverage thresholds are enforced at **70%** for lines, functions, branches, and statements.

### Test Stack

| Tool | Purpose |
|---|---|
| Vitest | Test runner (native ESM, Vite-integrated) |
| @testing-library/react | Component rendering and interaction |
| @testing-library/user-event | Realistic browser event simulation |
| @testing-library/jest-dom | Extended DOM matchers |
| jsdom | Browser environment emulation |
| @vitest/coverage-v8 | V8-native code coverage |

---

## 🔍 Code Quality

All quality gates run automatically and must pass with **zero** warnings or errors.

### Lint

```bash
npm run lint
```

Uses **ESLint v10** flat config with the following plugins:

- `typescript-eslint` — strict TypeScript rules, no `any`, explicit return types
- `eslint-plugin-react` + `react-hooks` — React best practices
- `eslint-plugin-import` — import order and resolution
- `eslint-plugin-jsx-a11y` — accessibility linting
- `eslint-config-prettier` — formatting conflict prevention

### Format

```bash
npm run format
```

Prettier is configured for consistent code style across the entire `src/` directory.

### Type Check

Type checking is run as part of the build:

```bash
npm run build
```

`tsc` runs in strict mode with `noImplicitAny`, `strictNullChecks`, and `noUnusedLocals` enabled.

---

## 🏗️ Production Build

```bash
npm run build
```

Produces an optimised production bundle in `dist/` with:

- **Route-level code splitting** — each page loads only what it needs
- **PWA service worker** — `dist/sw.js` + `dist/workbox-*.js` for offline support
- **Asset fingerprinting** — cache-busting hashes on all chunks
- **Gzip-optimised** — total main chunk is under 133 KB gzipped

To preview the production build locally:

```bash
npm run preview
```

---

## 🌱 Emission Factors

All CO2 emission calculations use peer-reviewed, science-backed emission factors:

| Category | Source |
|---|---|
| **Transport** | IPCC AR6, DEFRA 2023 |
| **Food** | Our World in Data / Poore & Nemecek (2018) |
| **Energy** | BEIS UK Grid Intensity, IEA 2023 |
| **Shopping** | Carbon Trust product lifecycle estimates |

The global average target of **6.3 kg CO2/day** (≈ 2.3 tonnes/year) is aligned with the IPCC 1.5°C pathway.

---

## 📡 Data & Privacy

- All user data is stored in your own **Firebase Firestore** instance — you own it entirely.
- Authentication is handled by **Firebase Auth** (Google OAuth) — no passwords are stored.
- AI insights are sent to the **Gemini API** for processing. Only your aggregated activity summaries (no PII) are transmitted.
- No third-party analytics or tracking libraries are included.

---

## 📁 Project Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check + production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint (0 warnings, 0 errors) |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |
| `npm test` | Run full test suite |
| `npm run test:coverage` | Run tests with V8 coverage |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on code style, commit conventions, and how to run the project locally for development.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built with ❤️ for a greener planet · Powered by React, Firebase & Gemini AI
</p>
