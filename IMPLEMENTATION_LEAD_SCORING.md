# Implementation Plan — Dynamic Lead Scoring & Qualification System

## Overview

A fully **frontend-only** interactive lead scoring tool for a business that builds and constructs websites for cryptocurrency startups. The application asks four targeted qualification questions, scores the answers, classifies the lead into a quality tier (Low / Medium / High), and presents a contextual Call-To-Action (CTA) based on that tier.

No backend, no database, no API calls. All logic lives in the browser.

---

## Project Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Vanilla CSS (no Tailwind) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — `Inter` |
| Hosting | Static file (open `index.html` in browser) |

**Entry point:** `index.html`  
**Files:** `index.html`, `styles.css`, `app.js`

---

## The Four Qualification Questions

Each question is chosen to surface the true complexity and scope of the website project the lead requires.

### Q1 — Number of Pages
> *"How many pages does your website need?"*

| Answer | Points |
|--------|--------|
| 1–3 pages (simple landing page) | 1 |
| 4–8 pages (standard multi-page site) | 2 |
| 9–15 pages (large content site) | 3 |
| 16+ pages / web app with dynamic routes | 4 |

**Rationale:** Page count is the single strongest predictor of build hours and scope.

---

### Q2 — Copy & Content Creation
> *"Who will provide the website copy and content?"*

| Answer | Points |
|--------|--------|
| We have all copy and assets ready | 1 |
| We have rough copy — needs light editing | 2 |
| We need help writing most of the copy | 3 |
| We need full content strategy + copywriting | 4 |

**Rationale:** Content production dramatically increases project scope and therefore lead value.

---

### Q3 — Integrations & Third-Party APIs
> *"What integrations or special functionality does your site require?"*

| Answer | Points |
|--------|--------|
| None — static informational site | 1 |
| Basic (contact form, analytics, live chat) | 2 |
| Moderate (wallet connect, token price feeds, CMS) | 3 |
| Complex (DEX integration, on-chain data, custom API) | 4 |

**Rationale:** Crypto-specific integrations (Web3 wallets, DeFi feeds, smart contract reads) are high-effort and signal a premium engagement.

---

### Q4 — Timeline & Launch Urgency
> *"When do you need the website launched?"*

| Answer | Points |
|--------|--------|
| Flexible — 3+ months | 1 |
| 6–12 weeks | 2 |
| 3–6 weeks | 3 |
| ASAP — within 2 weeks | 4 |

**Rationale:** Rush timelines command premium rates and indicate a motivated buyer — a strong positive signal for lead quality.

---

## Scoring Model

**Total possible score:** 4 (minimum) — 16 (maximum)

### Score Thresholds & Lead Tiers

| Score Range | Lead Tier | Colour |
|------------|-----------|--------|
| 4 – 7 | 🟡 Low Quality | Amber / Yellow |
| 8 – 11 | 🔵 Medium Quality | Blue |
| 12 – 16 | 🟢 High Quality | Green |

---

## CTA Mapping Per Tier

| Tier | CTA Headline | CTA Description | CTA Button |
|------|-------------|-----------------|-----------|
| **Low** | "Let's Point You in the Right Direction" | "Your project sounds like a great starting point. Check out our starter packages and resources to get clarity on scope before booking a call." | Browse Starter Packages |
| **Medium** | "You're a Strong Fit — Let's Talk" | "Your project has solid scope. We'd love to learn more and put together a tailored proposal for your crypto website." | Book a Discovery Call |
| **High** | "You're Our Ideal Client — Let's Build" | "Your project is high-scope and right in our wheelhouse. Let's jump on a priority call and get started on your proposal immediately." | Book a Priority Strategy Call |

---

## Application Flow

```
┌─────────────────────────────────────┐
│          Landing / Intro Screen      │
│   Headline + brief value prop        │
│   "Start Qualification" button       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Question Screen (1 of 4)    │
│   Progress bar                       │
│   Question text                      │
│   Answer options (radio / buttons)   │
│   "Next" button (disabled until      │
│    answer selected)                  │
└──────────────┬──────────────────────┘
               │  (repeat for Q2, Q3, Q4)
               ▼
┌─────────────────────────────────────┐
│          Results Screen              │
│   Lead tier badge (Low/Med/High)     │
│   Score display                      │
│   Tier description paragraph         │
│   CTA headline + description         │
│   CTA button (action varies by tier) │
│   "Start Over" link                  │
└─────────────────────────────────────┘
```

---

## File Structure

```
dynamic-lead-scoring/
├── index.html               # Single HTML file, all screens rendered via JS
├── styles.css               # Full design system, animations, responsive layout
├── app.js                   # Quiz logic, scoring engine, CTA rendering
├── GITHUB_ISSUES_GUIDE.md   # (existing)
└── IMPLEMENTATION_LEAD_SCORING.md  # (this file)
```

---

## UI / Design Spec

### Visual Theme
- **Background:** Deep dark (`#0a0d14`) — crypto/tech aesthetic
- **Accent:** Electric violet / neon purple (`#7c3aed`) with glowing effects
- **Cards:** Glassmorphism panels with `backdrop-filter: blur`
- **Typography:** `Inter` from Google Fonts; headlines bold & large
- **Progress bar:** Animated fill from left to right as questions advance
- **Transitions:** Smooth fade + slide between screens (~300ms)

### Screens
1. **Intro Screen** — full-height hero with headline, sub-copy, and CTA button
2. **Question Screen** — centred card, progress bar top, question + answer option buttons, Next CTA
3. **Results Screen** — tier badge with glow effect matching tier colour, score readout, CTA block

### Responsive
- Fully responsive — mobile-first layout
- Cards stack and padding adjusts at `≤768px`

---

## JavaScript Logic Spec (`app.js`)

### Data Structure

```js
const questions = [
  {
    id: 1,
    question: "How many pages does your website need?",
    answers: [
      { label: "1–3 pages (simple landing page)", points: 1 },
      { label: "4–8 pages (standard multi-page site)", points: 2 },
      { label: "9–15 pages (large content site)", points: 3 },
      { label: "16+ pages / web app with dynamic routes", points: 4 },
    ],
  },
  // ... Q2, Q3, Q4
];

const tiers = [
  {
    min: 4, max: 7,
    label: "Low Quality",
    colour: "#f59e0b",
    ctaHeadline: "Let's Point You in the Right Direction",
    ctaBody: "...",
    ctaButton: "Browse Starter Packages",
    ctaLink: "#",
  },
  {
    min: 8, max: 11,
    label: "Medium Quality",
    colour: "#3b82f6",
    ctaHeadline: "You're a Strong Fit — Let's Talk",
    ctaBody: "...",
    ctaButton: "Book a Discovery Call",
    ctaLink: "#",
  },
  {
    min: 12, max: 16,
    label: "High Quality",
    colour: "#10b981",
    ctaHeadline: "You're Our Ideal Client — Let's Build",
    ctaBody: "...",
    ctaButton: "Book a Priority Strategy Call",
    ctaLink: "#",
  },
];
```

### Core Functions

| Function | Responsibility |
|----------|---------------|
| `renderIntro()` | Display the intro/landing screen |
| `renderQuestion(index)` | Render the question card for a given question index |
| `selectAnswer(points)` | Store selected points, enable Next button |
| `nextQuestion()` | Advance index or trigger scoring if last question |
| `calculateScore()` | Sum all stored point values |
| `getTier(score)` | Return the matching tier object based on score |
| `renderResults(tier, score)` | Display results screen with tier badge and CTA |
| `resetQuiz()` | Clear state, return to intro screen |

### State

```js
let state = {
  currentQuestion: 0,
  answers: [],       // array of point values, one per question answered
};
```

---

## Verification Plan

### Manual Testing Checklist
- [ ] All 4 questions render in correct order with correct answer options
- [ ] Progress bar advances correctly (25% → 50% → 75% → 100%)
- [ ] "Next" button is disabled until an answer is selected
- [ ] Score calculates correctly for all combinations:
  - Score 4 → Low tier
  - Score 8 → Medium tier
  - Score 12 → High tier
  - Score 16 → High tier
- [ ] Correct CTA headline, body, and button text renders for each tier
- [ ] "Start Over" resets all state and returns to intro
- [ ] Fully usable on mobile (375px viewport)
- [ ] No console errors on load or during quiz flow

### Sample Score Walk-throughs

| Q1 | Q2 | Q3 | Q4 | Total | Expected Tier |
|----|----|----|-----|-------|--------------|
| 1  | 1  | 1  | 1  | 4     | Low          |
| 2  | 2  | 2  | 2  | 8     | Medium       |
| 3  | 3  | 3  | 2  | 11    | Medium       |
| 4  | 4  | 4  | 4  | 16    | High         |
| 2  | 3  | 3  | 4  | 12    | High         |

---

## GitHub Issues to Create Before Implementation

Following the `GITHUB_ISSUES_GUIDE.md` process, the following issues should be created with the `enhancement` label:

| # | Issue Title |
|---|------------|
| 1 | Build HTML scaffold and three-screen layout structure |
| 2 | Implement CSS design system (dark theme, glassmorphism, typography) |
| 3 | Implement quiz logic — question rendering and state management |
| 4 | Implement scoring engine and tier classification |
| 5 | Implement results screen and CTA rendering per tier |
| 6 | QA and responsive testing across screen sizes |

---

*Last updated: 2026-04-28*
