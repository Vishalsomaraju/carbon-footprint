# Testing Strategy

CarbonWise uses **Vitest** as its test runner and **React Testing Library (RTL)** for component testing.

## Running Tests

- **Run all tests:** `npm run test`
- **Run tests in watch mode:** `npm run test:watch`
- **Run tests with coverage:** `npm run test:coverage`

## Coverage Thresholds

We maintain a strict **≥70%** coverage requirement across all four metrics:

- Statements
- Branches
- Functions
- Lines

If a Pull Request drops coverage below 70%, it will be rejected by CI.

## What We Test

### 1. Unit Tests

- **Calculation Engine (`co2Calculator.ts`)**: We exhaustively test every pure function and calculation boundary (e.g., testing that Walking returns exactly `0` kg CO2).
- **Utility Functions (`errorTracker.ts`, `co2.ts`)**: Basic string formatting and event tracking paths.

### 2. Integration & Component Tests

- **UI Components**: We test that components render correctly given specific props.
- **Pages**: We test full page renders, simulating user clicks, inputs, and form submissions.
- **Hooks**: Custom hooks like `useActivities` and `useAuth` are tested to verify they manage state and caching correctly.

## Mocking Strategy

**Tests must run fully offline.** We never hit live endpoints during tests.

- **Firebase**: Firestore and Auth are mocked at the module level in `src/test/setup.ts` and overridden on a per-test basis.
- **Gemini AI**: The `geminiService` is mocked to return predefined insight strings.
- **Google Maps**: The `mapsService` is mocked to return static distances.
- **Browser Globals**: Global APIs like `ResizeObserver` (used by Recharts) are stubbed in `setup.ts` to prevent jsdom crashes.
