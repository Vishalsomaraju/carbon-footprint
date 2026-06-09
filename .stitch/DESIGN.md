# Design System: CarbonWise

## 1. Visual Theme & Atmosphere
A deep, immersive "Cockpit Dense" (Density 8) dashboard interface with confident asymmetric layouts (Variance 6) and fluid spring-physics motion (Motion 8). The atmosphere is highly technical yet organic—like a state-of-the-art climate research terminal. It feels premium, focused, and data-rich.

## 2. Color Palette & Roles
- **Deep Void** (#020617) — Primary background surface (Slate-950)
- **Charcoal Core** (#0F172A) — Card and container fill, subtle elevation (Slate-900)
- **Canvas White** (#F8FAFC) — Primary text, maximum contrast (Slate-50)
- **Muted Steel** (#94A3B8) — Secondary text, descriptions, metadata (Slate-400)
- **Whisper Border** (#1E293B) — Card borders, 1px structural lines (Slate-800)
- **Bio Emerald** (#10B981) — Single accent for CTAs, active states, focus rings, and positive trends.
- **Alert Amber** (#F59E0B) — Warning states.
- **Critical Crimson** (#EF4444) — Error states.
(Max 1 main accent. No purple/neon glow. Strictly slate/emerald.)

## 3. Typography Rules
- **Display/Headlines:** `Outfit`, sans-serif — Track-tight, controlled scale, weight-driven hierarchy. High contrast.
- **Body:** `Outfit`, sans-serif — Relaxed leading, 65ch max-width, neutral secondary color.
- **Mono:** `JetBrains Mono` or `ui-monospace` — For code, metadata, timestamps, high-density numbers, and carbon metrics.
- **Banned:** Inter, generic system fonts for premium contexts. Serif fonts banned completely in this dashboard.

## 4. Component Stylings
* **Buttons:** Flat, no outer glow. Tactile -1px translate on active (Framer Motion `whileTap={{ y: 1 }}`). Accent fill for primary, ghost/outline with whisper border for secondary. No custom mouse cursors.
* **Cards:** Generously rounded corners (1.5rem / 24px). Diffused inner whisper shadow, no harsh drop shadows. Used only when elevation serves hierarchy. For high-density areas: replace with border-top dividers or negative space.
* **Inputs:** Label above, error below. Focus ring in Bio Emerald. Smooth background transition. No floating labels.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.
* **Empty States:** Composed, beautifully arranged typography and subtle iconography indicating how to populate data — not just "No data" text.

## 5. Layout Principles
- Grid-first responsive architecture using CSS Grid.
- Asymmetric splits for Hero sections (e.g., 60/40 splits).
- Strict single-column collapse below 768px.
- Max-width containment (max-w-7xl).
- No flexbox percentage math (`calc()`).
- No overlapping elements — clean spatial separation always.
- Generous internal padding within cards (p-6 or p-8).

## 6. Motion & Interaction
- Spring physics default for all interactive elements (stiffness: 100, damping: 20).
- Staggered cascade reveals for lists and dashboard metrics.
- Perpetual micro-loops on active dashboard components (e.g., subtle pulsing on live tracking).
- Hardware-accelerated transforms (`translate`, `scale`, `opacity`) only.

## 7. Anti-Patterns (Banned)
- NO emojis anywhere.
- NO `Inter`, `Times New Roman`, `Georgia`, `Garamond`.
- NO pure black (`#000000`).
- NO neon glows, outer glows, or drop-shadow smudges.
- NO 3-column equal grids for features. Use asymmetric or zig-zag layouts.
- NO AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen").
- NO generic placeholder names ("John Doe", "Acme").
- NO filler UI text: "Scroll to explore", "Swipe down", bouncing chevrons.
- NO centered Hero sections on desktop.
