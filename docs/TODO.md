# TODO — Bidyarthi Free Coaching Centre Website

> Phased checklist. Each item is sized for one commit.
> Mark `[x]` when done, `[/]` when in progress.

---

## Phase 0 — Foundation

- [x] Initialise Next.js 14+ project with TypeScript and App Router
  - **AC:** `npm run dev` starts without errors; TypeScript strict mode enabled
- [x] Install and configure Tailwind CSS
  - **AC:** A test utility class renders correctly; design tokens in `src/app/globals.css`
- [x] Install and configure `next-intl` for Bengali (`bn`) and English (`en`)
  - **AC:** `messages/bn.json` and `messages/en.json` exist; locale switching works on `/`
- [ ] Set up Supabase project and local dev environment
  - **AC:** `npx supabase start` runs; `.env.example` has all required vars documented
- [x] Create `.env.example` with placeholder environment variables
  - **AC:** File lists `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `REVALIDATE_SECRET`
- [x] Configure ESLint, Prettier, and `tsconfig.json`
  - **AC:** `npm run lint` passes on scaffold code
- [x] Add `content/` directory with `{{PLACEHOLDER}}` markers for institutional facts
  - **AC:** `content/bn/` and `content/en/` exist with at least one sample file
- [x] Download, subset, and self-host Bengali font (Noto Sans Bengali woff2)
  - **AC:** Subset file ≤ 80 KB; covers `U+0980-09FF` + `U+0000-007F`; placed in `public/fonts/` and `src/app/fonts/`
- [x] Download and self-host Inter (Latin subset, woff2)
  - **AC:** File ≤ 20 KB; placed in `public/fonts/` and `src/app/fonts/`

---

## Phase 1 — Layout & Navigation

- [x] Create root layout (`src/app/[locale]/layout.tsx`) with HTML lang, fonts, metadata
  - **AC:** Page renders with correct `<html lang="bn">` or `<html lang="en">`
- [x] Build `Header` component with logo, nav links, language switcher, mobile hamburger
  - **AC:** Nav is responsive; language switcher toggles locale; hamburger opens mobile menu
- [x] Build `Footer` component with address placeholder, quick links, copyright
  - **AC:** Footer renders on all pages; address uses `{{ADDRESS}}` placeholder
- [x] Build `MobileNav` component (slide-out drawer)
  - **AC:** Drawer opens/closes with animation; focus trap works; accessible
- [x] Set up global typography and colour theme in Tailwind config
  - **AC:** Bengali font loads via `next/font/local` with `font-display: swap`; fallback stack `'Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', sans-serif`; colour palette defined
- [x] Create `not-found.tsx` (404) and `error.tsx` (500) pages at `[locale]` level
  - **AC:** Visiting `/bn/nonexistent` shows a Bengali 404 page; throwing in a page shows the error boundary

---

## Phase 2 — Public Pages

- [x] Build Home page with hero section, highlights, latest notices, quick links
  - **AC:** Hero renders with placeholder text; sections stack vertically on mobile; data access layer decouples mock data from future Supabase queries
- [x] Build About page
  - **AC:** History, mission, leadership sections render; content uses `{{PLACEHOLDER}}`
- [ ] Build Coaching page (subjects, schedule, eligibility)
  - **AC:** Subject list renders; schedule table is responsive
- [ ] Build Library page
  - **AC:** Book count, rules, timing info render
- [ ] Build Dispensary page
  - **AC:** Services and timings render
- [ ] Build Ambulance & Oxygen Service page
  - **AC:** Contact info and availability render
- [ ] Build Book Fair page
  - **AC:** Annual event details render
- [ ] Build Kindergarten (Bidyarthi Shishu Niketan) page
  - **AC:** Admission info, age group, timings render

---

## Phase 3 — Data & Admin

- [x] Write Supabase migration: create all tables (`notices`, `events`, `gallery_items`, `form_links`, `site_settings`, `messages`, `highlights`, `admin_users`)
  - **AC:** `npx supabase db push` succeeds; tables visible in Supabase Studio
- [x] Write RLS policies for all tables (public read, admin write)
  - **AC:** Anon user can SELECT public tables; cannot INSERT/UPDATE/DELETE
- [x] Create Supabase Storage buckets (`notice-files`, `gallery-images`)
  - **AC:** Buckets exist; public read, admin write policies applied
- [x] Set up Supabase Auth with email/password
  - **AC:** Admin can sign in; non-allowlisted email is rejected
- [x] Create Supabase client utilities (`client.ts`, `server.ts`, `admin.ts`)
  - **AC:** Browser and server clients initialise without errors
- [x] Generate TypeScript types from Supabase schema
  - **AC:** `src/types/database.ts` exists and types match schema
- [x] Build admin layout (`src/app/admin/layout.tsx`) with sidebar and auth guard
  - **AC:** Unauthenticated user is redirected to login; sidebar shows nav links
- [x] Build admin login page
  - **AC:** Admin can sign in with email/password; error shown for bad credentials
- [x] Build admin dashboard page (overview with counts)
  - **AC:** Shows count of notices, events, gallery items, unread messages

---

## Phase 4 — Notices

- [x] Build admin notice form (create/edit) with text input and file upload
  - **AC:** Admin can paste text or upload PDF/TXT; file goes to `notice-files` bucket
- [x] Build admin notice list with edit/delete actions
  - **AC:** List shows all notices; delete removes from DB and Storage; publish/unpublish and pin/unpin toggles work
- [x] Build public notices list page (`/notices`)
  - **AC:** Lists notices sorted by date with category tabs, search, pagination; pinned notices appear first; "New" badge for notices < 7 days
- [x] Build public notice detail page (`/notices/[slug]`)
  - **AC:** Text notices render inline (escaped plain text with preserved line breaks); PDF notices show embedded viewer on desktop and prominent Open/Download button on mobile
- [x] Add client-side and server-side file validation for notice uploads
  - **AC:** PDF max 10 MB, TXT max 200 KB rejected with error message; real file types validated server-side by magic bytes; filenames sanitised with unique storage path; unit & E2E tests passing

---

## Phase 5 — Events

- [x] Build admin event form (create/edit) with cover image upload
  - **AC:** Admin can create/edit event with title, category, description, date, time, venue, cover image upload
- [x] Build admin event list with edit/delete/publish toggle
  - **AC:** List shows all events with category, venue, date; publish/unpublish toggle works; delete confirmation modal
- [x] Build public events list page (`/events`)
  - **AC:** Filter by 6 sitemap categories (Educational, Cultural, Social Welfare, Book Fair, Community, Special), upcoming vs past view toggle, search, pagination
- [x] Build public event detail page (`/events/[slug]`)
  - **AC:** Shows full event info; cover image renders with next/image responsive sizing; venue, date & time badges

---

## Phase 6 — Gallery

- [x] Build admin gallery upload form (multi-image, caption, category)
  - **AC:** Admin can upload multiple images at once; client-side WebP compression (max 1920px); uploaded to `gallery-images` bucket
- [x] Build admin gallery list with reorder, edit caption, delete
  - **AC:** Reorder up/down buttons work; photo and video delete actions work; YouTube video manager included
- [x] Build public gallery page with filterable grid and lightbox
  - **AC:** Photo tab with 6 categories from SITEMAP.md; accessible lightbox with keyboard navigation; Video tab with 3 categories & click-to-load YouTube facades
- [x] Build client-side image resize/compress pipeline for gallery uploads
  - **AC:** Uploaded images resized to ≤ 1920 px wide WebP before upload; unit tests passing

---

## Phase 7 — Forms & Contact

- [x] Build admin form-links manager (add/edit/toggle Google Form URLs & response Sheet links)
  - **AC:** Admin can edit Google Form URL, response Google Sheet link, title, description, and active status toggle at `/admin/forms`
- [x] Build public forms page with embedded Google Forms or links
  - **AC:** `/forms` index lists 5 forms (Admission, Coaching, Membership, Volunteer, Other); `/forms/[slug]` embeds Google Form in responsive iframe with loading skeleton & "Open in new tab" fallback; inactive forms show "Applications are currently closed"
- [x] Build public contact page with form, address, phone, embedded map
  - **AC:** Values loaded from `site_settings`; `tel:` phone links; email link; lazy-loaded Google Map embed with text-address fallback; contact form submits to `messages` table
- [ ] Build `/api/contact` route with rate limiting and honeypot
  - **AC:** Valid submissions save to `messages` table; rate limit rejects excess requests
- [x] Build admin messages page (list, mark read, delete)
  - **AC:** Unread messages highlighted; mark-as-read works

---

## Phase 8 — SEO / Accessibility / Performance

- [ ] Add `<title>`, meta description, Open Graph tags to all pages
  - **AC:** Social media preview renders correctly for shared links
- [ ] Generate `sitemap.xml` and `robots.txt`
  - **AC:** `/sitemap.xml` lists all public routes; `/robots.txt` allows crawling
- [ ] Add structured data (JSON-LD) for Organisation and Events
  - **AC:** Google Rich Results Test passes for homepage and event pages
- [ ] Audit and fix WCAG 2.1 AA issues (colour contrast, alt text, focus states)
  - **AC:** axe-core reports zero critical/serious violations
- [ ] Add PWA manifest and offline fallback page
  - **AC:** Site is installable; offline page shows when network is unavailable
- [ ] Optimise images (next/image, WebP/AVIF, lazy loading)
  - **AC:** Lighthouse Performance ≥ 90 on mobile
- [ ] Add skip-to-content link and keyboard navigation support
  - **AC:** Tab order is logical; skip link is visible on focus

---

## Phase 8.5 — Hardening

- [ ] Set up messages auto-cleanup (delete messages older than 90 days)
  - **AC:** Supabase pg_cron job or scheduled Vercel function runs daily; old messages removed
- [ ] Document admin account recovery (break-glass procedure)
  - **AC:** `docs/ADMIN_RECOVERY.md` exists; describes using `SUPABASE_SERVICE_ROLE_KEY` to reset password or add new admin; tested
- [ ] Add server-side file upload validation for all Storage buckets
  - **AC:** MIME type whitelist enforced; file size limits enforced; filenames UUID-renamed; test with malicious filenames

---

## Phase 9 — Testing

- [ ] Set up Vitest and write unit tests for utility functions
  - **AC:** `npm test` runs and passes; ≥ 80% coverage on `src/lib/`
- [ ] Set up Playwright and write E2E tests for critical user flows
  - **AC:** Tests cover: homepage load, notice view, contact form submit, admin login
- [ ] Cross-browser testing (Chrome, Firefox, Samsung Internet)
  - **AC:** No layout or functionality regressions on tested browsers
- [ ] Test on slow 3G throttling (Chrome DevTools)
  - **AC:** FCP < 2 s; TTI < 5 s on simulated 3G

---

## Phase 10 — Deploy

- [ ] Set up Vercel project and connect Git repo
  - **AC:** Push to `main` triggers production deploy
- [ ] Configure environment variables on Vercel
  - **AC:** All `NEXT_PUBLIC_*` and server-side vars set in Vercel dashboard
- [ ] Configure custom domain (if available)
  - **AC:** Site accessible at custom domain with HTTPS
- [ ] Set up Supabase production project
  - **AC:** Production DB has all tables, RLS, and storage buckets
- [ ] Verify production Lighthouse scores
  - **AC:** All four categories ≥ 90 on mobile
- [ ] Create admin account and hand off to volunteers
  - **AC:** Volunteer can log in and post a test notice
- [ ] Set up weekly `pg_dump` backup via GitHub Actions
  - **AC:** `.github/workflows/backup.yml` exists; runs weekly; artefact uploaded to private repo or storage
- [ ] Verify admin account recovery procedure works
  - **AC:** Simulated lockout resolved using documented break-glass procedure
