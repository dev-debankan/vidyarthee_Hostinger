# Bidyarthi Free Coaching Centre

[![CI](https://github.com/YOUR_ORG/bidyarthi-website/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/bidyarthi-website/actions/workflows/ci.yml)

A modern, accessible, mobile-first web platform for **Bidyarthi Free Coaching Centre** (বিদ্যার্থী ফ্রি কোচিং সেন্টার), an educational charity and social welfare organisation based in Simurali, Nadia, West Bengal (established 1987).

The website serves local students, families, and community members, prioritising fast load times and clean presentation even on low-cost Android phones and throttled mobile data connections.

---

## Features

- **Bilingual Experience (Bengali & English):** Seamless localized user interface powered by `next-intl`, with Bengali (`bn`) as the primary locale and English (`en`) as the alternate.
- **Mobile-First & Performance-Focused:** Built for low-end mobile devices and 2G/3G speeds; self-hosted subsetted fonts, minimal JavaScript payload, and responsive layouts.
- **Digital Notice Board:** Immediate publishing of class schedules, admission details, and examination announcements, supporting accessible text and downloadable PDFs.
- **Events & Community Initiatives:** Showcase cultural events, the annual book fair, health clinics, and educational workshops.
- **Photo & Media Gallery:** Fast-loading responsive image galleries optimized with modern image formats and lightboxes.
- **Admin Dashboard:** Streamlined back-office interface for authorized staff and volunteers to post notices, curate events, and view incoming messages.
- **Accessible & Inclusive:** WCAG 2.1 AA compliant design with high-contrast text, keyboard navigation, clear amber focus rings, and screen-reader skip links.

---

## Tech Stack

| Layer            | Technology                | Details                                             |
| ---------------- | ------------------------- | --------------------------------------------------- |
| **Framework**    | Next.js 16 (App Router)   | React Server Components, ISR, Streaming             |
| **Language**     | TypeScript (strict)       | Complete end-to-end type safety                     |
| **Styling**      | Tailwind CSS 4            | Utility-first, zero-runtime CSS                     |
| **Localization** | `next-intl`               | Bengali (`bn`) default + English (`en`)             |
| **Typography**   | Noto Sans Bengali & Inter | Self-hosted woff2 subsets (`font-display: swap`)    |
| **Database**     | Supabase (PostgreSQL)     | Relational data model with Row Level Security (RLS) |
| **Auth**         | Supabase Auth             | Role-based email authentication for admins          |
| **Storage**      | Supabase Storage          | Encrypted cloud buckets for notices and media       |
| **Hosting**      | Vercel                    | Global edge CDN, automatic HTTPS, and CI/CD         |
| **Code Quality** | ESLint, Prettier, Husky   | Strict linting, formatting, and pre-commit checks   |

---

## Prerequisites

Before setting up the project locally, ensure you have:

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher (bundled with Node 20)
- **Git**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORG/bidyarthi-website.git
cd bidyarthi-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the sample environment file to create your local environment configuration:

```bash
cp .env.example .env.local
```

Open `.env.local` and provide your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REVALIDATE_SECRET=your-secret-revalidation-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Available Scripts

The following npm scripts are available in the project:

| Script       | Command              | Purpose                                                         |
| ------------ | -------------------- | --------------------------------------------------------------- |
| `dev`        | `npm run dev`        | Launches the Next.js development server with hot reloading      |
| `build`      | `npm run build`      | Compiles the production build with type and lint checks         |
| `lint`       | `npm run lint`       | Runs ESLint across the codebase with `--max-warnings 0`         |
| `type-check` | `npm run type-check` | Runs the TypeScript compiler (`tsc --noEmit`) to validate types |
| `format`     | `npm run format`     | Automatically formats all source files with Prettier            |

---

## Project Structure

```text
bidyarthi-website/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions quality pipeline
├── docs/                        # Project documentation and specifications
│   ├── ARCHITECTURE.md          # Technical design, data models, and RLS policies
│   ├── DECISIONS.md             # Architecture Decision Records (ADRs)
│   ├── PLAN.md                  # Project goals, scope, and implementation phases
│   ├── SITEMAP.md               # Complete route breakdown and page tree
│   └── TODO.md                  # Phased engineering checklist
├── messages/                    # next-intl translation dictionaries
│   ├── bn.json                  # Bengali UI strings
│   └── en.json                  # English UI strings
├── public/                      # Static assets and self-hosted fonts
│   └── fonts/                   # Noto Sans Bengali & Inter woff2 subsets
├── src/
│   ├── app/
│   │   ├── [locale]/            # Localized App Router routes (layout, pages, 404, 500)
│   │   ├── fonts/               # Font declarations & fallbacks
│   │   ├── globals.css          # Global styling & Tailwind directives
│   │   └── layout.tsx           # Root HTML layout wrapper
│   ├── components/
│   │   └── ui/                  # Accessible UI primitives (Button, Card, Input, etc.)
│   ├── i18n/                    # Routing definitions and message loader
│   ├── lib/                     # Common utilities (cn helper, constants)
│   └── types/                   # TypeScript interfaces and database schemas
├── .env.example                 # Template for required environment variables
├── .lintstagedrc.json           # Pre-commit hook configuration
├── .prettierignore              # Prettier ignore paths
├── .prettierrc                  # Prettier formatting rules
├── eslint.config.mjs            # Flat ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies and script commands
└── tsconfig.json                # TypeScript compiler configuration
```

---

## Deployment

The application is engineered to deploy seamlessly on [Vercel](https://vercel.com/):

1. **Connect Repository:** Link your GitHub repository in the Vercel dashboard.
2. **Configure Environment Variables:** Add all variables defined in `.env.example` into Vercel Project Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REVALIDATE_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain, e.g. `https://bidyarthi.org`)
3. **Build & Deploy:** Every push to `main` triggers a production build. Pull requests generate preview deployments for staging review.

---

## Documentation

Comprehensive project documentation is maintained in the [`docs/`](docs/) directory:

- [docs/PLAN.md](docs/PLAN.md) — Strategic roadmap, audience profiles, and phased milestones
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, database schemas, and security model
- [docs/TODO.md](docs/TODO.md) — Detailed engineering progress checklist
- [docs/DECISIONS.md](docs/DECISIONS.md) — Architecture decision records (ADRs)
- [docs/SITEMAP.md](docs/SITEMAP.md) — Full site information architecture and routes

---

## License

This project is licensed under the [ISC License](LICENSE).
