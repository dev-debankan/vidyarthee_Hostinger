# Bidyarthi Free Coaching Centre — Project Context

## About

Production website for **Bidyarthi Free Coaching Centre**, a social welfare
organisation in Simurali, Nadia, West Bengal, India (est. 1987). The site serves
local families and students, many on low-end phones and slow networks.

## Standing Rules

1. **Read first.** Before every task, read:
   - `docs/PLAN.md` — goals, scope, phases
   - `docs/ARCHITECTURE.md` — stack, folder structure, data model
   - `docs/TODO.md` — current task checklist
2. **Update after every task.**
   - Tick completed items in `docs/TODO.md`.
   - Log any decision in `docs/DECISIONS.md`.
3. **Never invent institutional facts** (names, dates, phone numbers, addresses).
   Use clearly marked placeholders in `content/` files, e.g. `{{PHONE}}`, `{{ADDRESS}}`.
4. **Enforce upload limits.** PDFs ≤ 5 MB, images ≤ 2 MB. Validate MIME type
   server-side before writing to Supabase Storage. Resize/compress gallery images
   to ≤ 1200 px wide before upload.
5. **Bengali font loading.** Use Noto Sans Bengali with `font-display: swap`,
   subset to Bengali + Latin glyphs (≤ 80 KB woff2). Always declare a fallback
   stack: `'Noto Sans Bengali', 'Hind Siliguri', sans-serif`.
6. **Error pages required.** Every deployable milestone must include `not-found.tsx`
   (404) and `error.tsx` (500) at the `[locale]` layout level.

## Tech Stack

| Layer     | Choice                                         |
| --------- | ---------------------------------------------- |
| Framework | Next.js 14+ (App Router)                       |
| Language  | TypeScript (strict)                            |
| Styling   | Tailwind CSS 3                                 |
| i18n      | next-intl (Bengali `bn` + English `en`)        |
| Database  | Supabase Postgres                              |
| Auth      | Supabase Auth (email-based admin allowlist)    |
| Storage   | Supabase Storage (notice PDFs, gallery images) |
| Hosting   | Vercel                                         |

## Conventions

- **Branching:** `main` is production. Feature branches: `feat/<slug>`. Bug fixes: `fix/<slug>`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- **Components:** Server Components by default; add `"use client"` only when needed.
- **Naming:** `kebab-case` for files/folders, `PascalCase` for components, `camelCase` for variables/functions.
- **Styles:** Tailwind utility classes. Custom CSS only in rare, justified cases.
- **Images:** Use `next/image` with `width`/`height` or `fill`. Serve WebP/AVIF.
  Gallery uploads must be resized server-side to ≤ 1200 px wide before storage.
- **Accessibility:** Semantic HTML, ARIA where needed, WCAG 2.1 AA compliance.
- **Performance target:** Lighthouse ≥ 90 on all four categories (mobile).
- **Translation files:** `messages/*.json` = UI strings (buttons, labels, nav).
  `content/*` = long-form page copy with `{{PLACEHOLDER}}` markers. Do not mix.

## Useful Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint + TypeScript checks
npm run type-check   # TypeScript only

# Database
npx supabase start   # Local Supabase
npx supabase db push # Push migrations
npx supabase gen types typescript --local > src/types/database.ts

# Testing
npm test             # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```

## Key Files

| File                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `docs/PLAN.md`         | Goals, users, scope, phases                               |
| `docs/ARCHITECTURE.md` | Stack, routes, data model, security                       |
| `docs/TODO.md`         | Phased task checklist                                     |
| `docs/DECISIONS.md`    | Architecture Decision Records                             |
| `docs/SITEMAP.md`      | Full website structure                                    |
| `messages/*.json`      | UI string translations (next-intl) — buttons, labels, nav |
| `content/`             | Long-form page copy with `{{PLACEHOLDER}}` markers        |

## Known Risks

| Risk                                                | Mitigation                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| Supabase free-tier DB has no point-in-time recovery | Weekly `pg_dump` via GitHub Action to a private repo               |
| Admin loses email access → site locked              | Document a break-glass procedure using `SUPABASE_SERVICE_ROLE_KEY` |
| Large PDF uploads choke mobile viewers              | Enforce 5 MB limit; never embed PDFs — always offer download link  |
| Bengali font > 200 KB budget alone                  | Subset to Bengali + Latin; self-host woff2                         |
| Google Form iframes break on small screens          | Default to external link; iframe only on screens ≥ 768 px          |
| Contact-form spam fills `messages` table            | Rate-limit + honeypot + auto-delete messages older than 90 days    |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
