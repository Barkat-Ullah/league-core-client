<div align="center">

# ⚽ LeagueCore — Tournament Management System (Client)

**A full-featured frontend platform for competitive soccer tournaments**  
*Create · Register · Compete · Track — All in One Place*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitives-161618?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

---
<a href="https://github.com/Barkat-Ullah/league-core-client" target="_blank">
  <img src="https://img.shields.io/badge/%F0%9F%93%81%20GitHub%20Repository-181717?style=for-the-badge&logo=github&logoColor=white" height="52" alt="GitHub Repository"/>
</a>

</div>

---

## 📖 Overview

**LeagueCore** is a comprehensive **Soccer Tournament Management System** designed for competitive leagues at all age levels. The platform enables admins to create and manage multi-division tournaments across three competitive stages (Proving, Crown, Royal), while coaches can register teams, manage rosters, and track their standings in real time.

This repository is the **client-side application**, built with Next.js and Redux Toolkit. It consumes the LeagueCore backend API and provides the complete tournament lifecycle experience — from tournament browsing and team registration to match scheduling views, live scoring, player age verification, waiver signing, referee assignment, and series points tracking — all backed by Stripe-powered payment processing.

---

## 🏗️ System Architecture

\`\`\`
src/
├── app/
│   ├── (auth)/               # Login, register, OTP verification pages
│   ├── (dashboard)/
│   │   ├── admin/            # Admin dashboard routes
│   │   ├── coach/            # Coach dashboard routes
│   │   ├── manager/          # Manager dashboard routes
│   │   └── player/           # Player dashboard routes
│   ├── (public)/              # Public tournament listing, landing pages
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Reusable UI primitives (Radix-based)
│   ├── shared/                 # Shared layout components (navbar, footer, etc.)
│   └── modules/                # Feature-specific components (tournament, team, match, etc.)
├── redux/
│   ├── api/                    # RTK Query API slices per module
│   ├── features/               # Redux slices (auth, user, cart, etc.)
│   ├── store.ts
│   └── provider.tsx
├── hooks/                       # Custom React hooks
├── lib/                          # Utility functions, helpers
├── types/                        # Shared TypeScript types/interfaces
├── constants/                     # App-wide constants
├── config/                         # Site config, env config
└── middleware.ts                   # Route protection / role-based redirects
\`\`\`

> **Modular Pattern:** Each feature (tournament, team, match, referee, etc.) has its own component folder and Redux API slice — keeping UI and state management cleanly separated per module.

---

## 👥 Role-Based Access Control

| Role | Responsibilities |
|------|-----------------|
| **ADMIN** | Create & manage tournaments, divisions, referees, series fees, age verification, global dashboard |
| **COACH** | Register teams, add players, manage roster, pay registration fees, view schedules |
| **MANAGER** | Assist coach in team management, view team roster and match schedule |
| **PLAYER** | View assigned team, sign waivers, track match schedule and standings |

---

## ✨ Features

### 🔐 Auth & User Management
- JWT-based authentication with refresh token support
- OTP-based email verification flow
- Role-specific onboarding flows (Coach, Manager, Player)
- Protected routes via middleware based on user role
- User status handling: Active / Inactive / Suspended / Blocked
- Notification preference settings (match reminder, waiver alert, team update, email)

### 🏆 Tournament Management *(Admin)*
- Create/edit tournaments with full metadata: name, dates, location, map link, registration deadline, number of fields, notes
- Game format selection: \`7v7\`, \`9v9\`, \`11v11\`
- Tournament stages view: **Proving → Crown → Royal** (series progression)
- Tournament status pipeline UI: \`DRAFT → OPEN → LIVE → COMPLETED → CANCELLED\`
- Configurable youth & adult registration fee inputs
- Roster size cap configuration (default: 12 players)
- Tournament logo upload (Cloudinary/S3-backed)
- Total registered teams counter dashboard

### 📂 Division Management *(Admin)*
- Multiple age/gender divisions per tournament:
  - Youth: U9–U10, U11–U12, U13–U14, U15–U16, U17–U18 (Boys & Girls)
  - High School: HS Boys / HS Girls
  - Adult: Men's Div 1/2/3, Women's, Co-Ed
- Per-division max teams, slots remaining, revenue tracking view
- Division status control: \`PENDING → READY → ACTIVE → INACTIVE\`
- Fee override per division
- Schedule readiness flag toggle

### 🧑‍🤝‍🧑 Team Registration *(Coach)*
- Register a team into a specific tournament + division
- Team name, image upload, and division assignment
- Payment status tracking per registration (\`PENDING → PAID\`)
- Max players cap and registered player count display
- Multi-manager assignment per team

### 👨‍👩‍👧 Roster & Player Management *(Coach / My Contribution)*
- Add players to registered teams
- Per-player waiver status view: \`Pending → Signed\`
- E-waiver: player name sign + timestamp
- Per-player age verification status: \`Check_in_required → Pending → Verified → Rejected\`
- Soft-delete support for removed players
- Duplicate player entry prevention per team registration

### 🧾 Waiver & Age Verification *(Admin / My Contribution)*
- Admin-level age verification dashboard
- Review and approve/reject player age status
- Waiver signing tracked with signature name and date
- Alert triggers based on notification preferences

### 🎯 Match Scheduling *(Admin)*
- Schedule matches per tournament division
- Assign home and away teams, field number, date/time
- Referee assignment per match
- Match stage tabs: \`GROUP → QUARTER_FINAL → SEMI_FINAL → FINAL\`
- Match status control: \`SCHEDULED → PUBLISHED → COMPLETED → CANCELLED\`
- Score entry UI (home score / away score)
- Round tracking view
- Publish/unpublish schedule control

### 🟨 Referee Management *(Admin / My Contribution)*
- Create and manage referee profiles (name, email, phone)
- Assign referees to individual matches
- Referee list dashboard for admin

### 📊 Series Points & Standings
- Points ledger view per team, per tournament, per division
- Tournament placement display: \`WINNER / RUNNER_UP / SEMI_FINALIST / QUARTER_FINALIST / PARTICIPANT\`
- Base points + win points = total points formula display
- Series-wide leaderboard across all three tournament stages
- Per-team discount display for series bundle registrations

### 💳 Bundle Credit System *(My Contribution)*
- Coach-level bundle purchasing UI (\`Youth\` / \`Adult\`)
- Bundle credits used to register teams into tournaments
- \`hasBundle\`, \`totalBundle\` (max 4) display at user level
- Series fee display: youth fee + adult fee per stage

### 💰 Payment & Billing
- Stripe Elements-powered checkout (\`@stripe/react-stripe-js\`, \`@stripe/stripe-js\`)
- Saved payment method display per user
- Tournament-linked and registration-linked payment flows
- Payment status tracking: \`PENDING → AUTHORIZED → PAID → CANCELLED → FAILED\`
- Card brand and cardholder name display per transaction

### 💬 Real-Time Chat
- Room-based direct messaging UI between users
- Image sharing support in chat
- Read/unread status indicators

### 🔔 Notifications
- Per-user in-app notification center
- Read/unread tracking UI
- Toast notifications (\`sonner\`) for real-time feedback
- Per-user notification toggle settings: match reminder, waiver alert, team update, email notify

### 📋 Activity Logs
- Per-user activity log trail view (title + content)
- Admin-accessible audit/review panel

---

## 📦 Tech Stack & Packages

### Core
| Package | Purpose |
|---------|---------|
| \`next\` | React framework — routing, SSR/SSG, App Router |
| \`react\` / \`react-dom\` | UI library |
| \`typescript\` | Type safety across the codebase |
| \`tailwindcss\` + \`@tailwindcss/postcss\` | Utility-first styling |
| \`babel-plugin-react-compiler\` | React Compiler optimizations |

### State Management
| Package | Purpose |
|---------|---------|
| \`@reduxjs/toolkit\` | Global state management & RTK Query API layer |
| \`react-redux\` | React bindings for Redux |
| \`redux-persist\` | Persisting Redux state across sessions |

### UI & Components
| Package | Purpose |
|---------|---------|
| \`radix-ui\` + \`@radix-ui/react-dialog\` + \`@radix-ui/react-slot\` | Accessible headless UI primitives |
| \`class-variance-authority\` | Component variant styling |
| \`clsx\` + \`tailwind-merge\` | Conditional & merged className handling |
| \`tw-animate-css\` | Tailwind-based animations |
| \`lucide-react\` + \`react-icons\` | Icon libraries |
| \`motion\` | Animations & transitions |
| \`swiper\` | Carousel/slider components |
| \`@lottiefiles/dotlottie-react\` | Lottie animation rendering |

### Forms & Validation
| Package | Purpose |
|---------|---------|
| \`react-hook-form\` | Form state management & validation |

### Payments
| Package | Purpose |
|---------|---------|
| \`@stripe/react-stripe-js\` + \`@stripe/stripe-js\` | Stripe Elements checkout integration |

### Auth & Utilities
| Package | Purpose |
|---------|---------|
| \`js-cookie\` | Client-side cookie/token handling |
| \`sonner\` | Toast notifications |
| \`sweetalert2\` | Confirmation & alert modals |

### SEO & Build
| Package | Purpose |
|---------|---------|
| \`next-sitemap\` | Automatic sitemap & robots.txt generation |
| \`eslint\` + \`eslint-config-next\` | Linting & code quality |
| \`autoprefixer\` | CSS vendor prefixing |

---

## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/Barkat-Ullah/league-core-client.git
cd league-core-client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start

# Lint the project
npm run lint
\`\`\`

---

## 🧩 Tournament Flow

\`\`\`
Admin Creates Tournament
        ↓
Admin Adds Divisions (U9, U12, HS Boys, Mens Div1 ...)
        ↓
Coach Registers Team → Pays Fee (Stripe / Bundle Credit)
        ↓
Coach Adds Players → Waiver Signing → Age Verification (Admin)
        ↓
Admin Schedules Matches → Assigns Referees → Publishes Schedule
        ↓
Matches Played → Scores Entered
        ↓
Series Points Calculated → Standings Updated
        ↓
Next Stage Unlocked  (Proving → Crown → Royal)
\`\`\`

---

## 👨‍💻 My Contributions

This is a team project. My personal contributions cover:

- ✅ **Player Dashboard** — Player-facing views: team info, match schedule, waiver signing, standings
- ✅ **Coach Dashboard** — Team creation, roster management, registration payment, bundle credit usage
- ✅ **Referee Management** — Admin CRUD UI for referee profiles, match-level referee assignment
- ✅ **Player Age Verification** — Admin review flow for verifying/rejecting player age status transitions
- ✅ **Waiver Management** — Player e-waiver signing UI with name and timestamp, status tracking per player
- ✅ **Bundle Credit System** — Youth/Adult bundle purchasing UI, credit tracking per coach, usage on registration

---

## 🏅 Divisions Supported

| Category | Divisions |
|----------|-----------|
| **Youth Boys** | U9–U10, U11–U12, U13–U14, U15–U16, U17–U18 |
| **Youth Girls** | U9–U10, U11–U12, U13–U14, U15–U16, U17–U18 |
| **High School** | HS Boys, HS Girls |
| **Adult** | Men's Div 1, Men's Div 2, Men's Div 3, Women's, Co-Ed |

## 📄 License

MIT License — see \`package.json\` for details.

---

<div align="center">
  <sub>Built with ❤️ by the LeagueCore Team</sub>
</div>