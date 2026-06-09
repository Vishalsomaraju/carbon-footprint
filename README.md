# CarbonWise – Personal Carbon Footprint Platform

**CarbonWise** is an intelligent, AI-driven platform designed to tackle one of the most pressing global challenges: individual carbon tracking and reduction. While broad climate goals exist, individuals often lack actionable visibility into how their daily activities impact the environment. 

CarbonWise solves this by allowing users to log their daily transport, food, and energy activities, instantly converting them into precise CO2 equivalence (using DESNZ and IPCC data). By leveraging Gemini AI, the platform provides tailored, conversational insights and reduction strategies, empowering users to actively lower their footprint and achieve net-zero goals.

**Live Demo**: [https://carbon-footprint-123.web.app](https://carbon-footprint-123.web.app) _(Placeholder)_

![CarbonWise Screenshot](/placeholder-screenshot.png)

## Tech Stack

- **React 18**
- **TypeScript (Strict Mode)**
- **Vite**
- **Tailwind CSS**
- **Firebase** (Auth, Firestore, Hosting, Analytics)
- **Gemini AI** (Personalized Insights)
- **Google Maps** (Distance Matrix API for Commutes)
- **Recharts** (Data Visualization)

## Google Services Used

This project relies heavily on Google services to deliver a seamless experience:

1. **Firebase Authentication**: Enables secure, passwordless Google Sign-In.
2. **Firebase Firestore**: A NoSQL cloud database storing user profiles, activity logs, and daily summaries.
3. **Firebase Hosting**: Fast and secure global CDN deployment with proper security headers.
4. **Firebase Analytics (GA4)**: Tracks user engagement, feature adoption, and error rates.
5. **Gemini AI (gemini-1.5-flash)**: Provides conversational, context-aware personalized reduction insights based on user activity.
6. **Google Maps (Distance Matrix API)**: Calculates exact commute distances and transit durations for accurate transport emissions.

## Architecture Overview

The application is structured in distinct layers:

- **Presentation Layer**: React components styled with Tailwind CSS.
- **State & Context**: Custom React hooks (`useAuth`, `useActivities`) managing global state and caching.
- **Calculation Engine**: Deterministic pure functions mapping activities to CO2 (kg) based on UK DESNZ and IPCC emission factors.
- **Service Layer**: Dedicated integration wrappers for Firebase, Google Maps, and Gemini.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed diagrams.

## Local Setup

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/carbon-footprint-platform.git
   cd carbon-footprint-platform
   ```

2. **Configure Environment Variables:**

   ```bash
   cp .env.example .env
   ```

   _Fill in your Firebase, Google Maps, and Gemini AI keys inside `.env`._

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable                            | Description                                 |
| ----------------------------------- | ------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Web API Key                        |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain                        |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase Project ID                         |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket                     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID                |
| `VITE_FIREBASE_APP_ID`              | Firebase App ID                             |
| `VITE_FIREBASE_MEASUREMENT_ID`      | GA4 Measurement ID                          |
| `VITE_GOOGLE_MAPS_API_KEY`          | Google Maps API Key for Commute calculation |
| `VITE_GEMINI_API_KEY`               | Gemini AI API Key for Insights              |

## Testing

The application uses Vitest and React Testing Library. **Global test coverage is maintained at 100%** across all business logic, UI components, custom hooks, and service integrations, ensuring absolute reliability.
To run tests and view the coverage report:

```bash
npm run test:coverage
```

## Deployment

The app is configured for Firebase Hosting.

```bash
firebase deploy
```

## Assumptions

- Target footprint default is 50 kg/day.
- Transport emission factors assume average UK/EU passenger vehicles.
- Users authenticate exclusively via Google Sign-In.

## Data Sources

- **Emission Factors**: Interpolated from UK DESNZ (Department for Energy Security and Net Zero) and IPCC guidelines.

## License

MIT License. See [LICENSE](LICENSE) for more details.
