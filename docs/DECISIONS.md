# Architecture Decision Records — Bidyarthi Free Coaching Centre

> Append new decisions at the bottom. Never delete past entries.

---

## ADR-001: Next.js App Router + TypeScript

**Date:** 2026-09-28
**Status:** Accepted

**Context:** We need a framework that supports SSR/SSG for SEO, image optimisation for
low-bandwidth users, API routes for the contact form, and is deployable to Vercel's
free tier.

**Decision:** Use Next.js 14+ with the App Router and TypeScript in strict mode.

**Rationale:**

- App Router supports React Server Components, reducing client JS bundle size — critical
  for low-end phones.
- Built-in `next/image` handles responsive images, lazy loading, and format conversion.
- ISR (Incremental Static Regeneration) lets us serve static pages that update
  automatically when content changes.
- TypeScript strict mode catches bugs early and improves maintainability for future
  volunteers.

**Alternatives considered:**

- Astro: Great for static sites, but weaker for the admin dashboard (needs React
  islands).
- Remix: Good SSR, but smaller ecosystem and no free Vercel-optimised hosting.
- Plain HTML/CSS: Simpler, but no SSR, no image optimisation, manual i18n, and harder
  to maintain.

---

## ADR-002: Tailwind CSS

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Styling solution must produce small CSS bundles (for slow networks), be
easy for future maintainers to modify, and support responsive/mobile-first design.

**Decision:** Use Tailwind CSS 3 with the default configuration, extended with a
custom colour palette and Bengali font.

**Rationale:**

- Utility-first approach generates only the CSS that's used — minimal bundle size.
- No context-switching between HTML and CSS files.
- Excellent responsive design primitives (`sm:`, `md:`, `lg:`).
- Large community and documentation.

**Alternatives considered:**

- CSS Modules: Good scoping, but more boilerplate for responsive design.
- Vanilla CSS: Maximum control, but harder to maintain consistently.
- Chakra UI / shadcn/ui: Heavier runtime; Tailwind is sufficient for our needs.

---

## ADR-003: Supabase (Postgres + Auth + Storage)

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Need a database, auth, and file storage solution that is free or very
cheap, easy to set up, supports Row-Level Security, and doesn't require managing
servers.

**Decision:** Use Supabase for Postgres database, authentication, and file storage.

**Rationale:**

- Generous free tier (500 MB database, 1 GB storage, 50K monthly active users).
- Built-in Row-Level Security makes it easy to enforce admin-only writes.
- Supabase Auth supports email/password with no additional setup.
- Supabase Storage provides public CDN URLs for PDFs and images.
- Auto-generated TypeScript types from the schema.
- Local development with `supabase start` (Docker-based).

**Alternatives considered:**

- Firebase: Good, but Firestore's NoSQL model is less natural for relational data.
- PlanetScale: MySQL-based, no built-in auth or storage.
- Self-hosted Postgres: More control, but requires server management.

---

## ADR-004: next-intl for Internationalisation

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The site must support Bengali (primary) and English. The i18n solution
must work with the Next.js App Router and support message-based translations.

**Decision:** Use `next-intl` with JSON message files (`messages/bn.json`,
`messages/en.json`).

**Rationale:**

- First-class App Router support with the `[locale]` dynamic segment.
- Message-based approach makes translations easy for non-technical volunteers.
- Supports plurals, rich text, and date/number formatting.
- Well-maintained with good documentation.

**Alternatives considered:**

- next-i18next: Primarily designed for Pages Router.
- react-intl: More verbose API; less Next.js-specific integration.
- Manual approach: Error-prone and hard to maintain.

---

## ADR-005: Vercel for Hosting

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Need zero-config deployment with HTTPS, edge caching, and a free tier
suitable for a low-traffic community website.

**Decision:** Deploy to Vercel.

**Rationale:**

- Zero-config Next.js deployment (auto-detects framework).
- Global edge network ensures fast load times.
- Free tier includes custom domains, HTTPS, and serverless functions.
- Git-based deployments with preview URLs for PRs.

**Alternatives considered:**

- Netlify: Good, but Next.js support is less mature.
- Cloudflare Pages: Requires Workers adapter for SSR.
- Railway/Render: More suited for backend apps; overkill for this.

---

## ADR-006: Google Forms for External Forms

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The centre needs various forms (admission, volunteer registration, etc.)
that non-technical volunteers can create and modify without code changes.

**Decision:** Store Google Form URLs in the `form_links` table; embed them as iframes
or link to them from the `/forms` page. Responses go to Google Sheets.

**Rationale:**

- Volunteers already know Google Forms — zero learning curve.
- No form builder UI needed on our site.
- Google handles response collection, validation, and export.
- Adding or changing a form is a simple URL update in the admin dashboard.

**Alternatives considered:**

- Custom form builder: Complex to build and maintain; overkill.
- Typeform: Costs money; not widely used by the target audience.

---

## ADR-007: Admin via Email Allowlist (No Public Registration)

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Only 1–3 trusted volunteers need admin access. Public registration
would introduce spam risk and unnecessary complexity.

**Decision:** Maintain an `admin_users` table in Supabase. Admin accounts are created
manually. RLS policies check `auth.uid()` against this table.

**Rationale:**

- Simplest possible auth model for a small team.
- No self-registration attack surface.
- Easy to add/remove admins by inserting/deleting rows.

**Alternatives considered:**

- Role-based access (multiple roles): Over-engineering for 1–3 admins.
- Supabase custom claims: More complex JWT management.

---

## ADR-008: Sitemap Drafted (Not Provided by User)

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The user intended to paste a full website structure document for
`docs/SITEMAP.md` but the placeholder was empty. The user confirmed we should
draft a sitemap based on the described services.

**Decision:** Draft the sitemap based on the organisation's described services
(coaching, library, events, dispensary, ambulance, book fair, kindergarten, notices,
gallery, forms, contact, admin dashboard). Mark it as a draft for user review.

**Assumptions made:**

- Bengali (`bn`) is the default locale.
- Admin pages are outside the locale segment (English-only admin UI).
- Each major service gets its own page.
- Events have dynamic slug-based detail pages.
- Notices have dynamic ID-based detail pages.
- API routes are limited to contact form submission and ISR revalidation.

---

## ADR-009: Bengali as Default Locale

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The primary audience is Bengali-speaking families and students in
Simurali, Nadia, West Bengal.

**Decision:** Set Bengali (`bn`) as the default locale. English (`en`) is available
as a secondary option.

**Rationale:**

- Most users are more comfortable reading Bengali.
- Default locale should match the majority audience.
- English is useful for search engines, donors, and English-speaking visitors.

---

## ADR-010: Content Placeholders for Institutional Facts

**Date:** 2026-09-28
**Status:** Accepted

**Context:** We must not invent institutional facts (phone numbers, addresses,
leadership names, timings) in code. These must come from the organisation.

**Decision:** Use `{{PLACEHOLDER}}` markers (e.g. `{{PHONE}}`, `{{ADDRESS}}`,
`{{PRESIDENT_NAME}}`) in all content files under `content/`. These will be replaced
with real data once provided by the organisation.

**Rationale:**

- Prevents incorrect information from appearing on the live site.
- Makes it clear what data is still needed.
- Easy to search and replace across the codebase.

---

## ADR-011: PDF Download-Only (No Embedded Viewer)

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The original plan called for an "embedded PDF viewer or download link"
on the notice detail page. However, most low-end Android browsers (Chrome WebView,
Samsung Internet, UC Browser) cannot render PDFs inside an `<iframe>` or `<object>`
tag — users see a blank white box or an unhandled download prompt.

**Decision:** PDF notices always show a **download button** with file size displayed
(e.g. "Download PDF · 1.2 MB"). No embedded PDF iframe. Text notices render inline.
Max file size: 5 MB (enforced client-side AND via Postgres CHECK constraint).

**Rationale:**

- Eliminates the #1 mobile PDF failure mode (blank iframe).
- Showing file size upfront lets users on metered data make an informed choice.
- 5 MB cap prevents admin uploads that would be impossible to download on 3G.

---

## ADR-012: Server-Side Image Resize Pipeline

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Phone cameras produce 5–10 MB JPEG/HEIC images. `next/image` only
optimises at delivery time — the originals still consume Supabase Storage (1 GB
free). A gallery of 200 unoptimised photos would exhaust the quota.

**Decision:** On gallery upload, resize server-side to ≤ 1200 px wide (display
size) and generate a ≤ 400 px thumbnail (grid view), both as WebP. Discard the
original. Store `image_url` and `thumb_url` in the `gallery_items` table.

**Rationale:**

- A 1200 px WebP image is typically 50–150 KB vs 5–10 MB original.
- Thumbnails in the grid avoid loading full-size images until lightbox is opened.
- Conserves Supabase Storage quota (est. 3,000+ images possible instead of ~100).

**Implementation note:** Use `sharp` (Node.js, already a Next.js dependency) in
an API route or Supabase Edge Function.

---

## ADR-013: Bengali Font — Subset and Self-Host

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Noto Sans Bengali (full weight, all glyphs) is ~300 KB. The page weight
budget (now 300 KB compressed including font) cannot absorb that on top of HTML,
CSS, and JS. Google Fonts CDN adds a DNS lookup + render-blocking request on 3G.

**Decision:** Subset Noto Sans Bengali to Bengali + Basic Latin Unicode ranges
(`U+0980-09FF`, `U+0000-007F`), producing a ≤ 80 KB woff2 file. Self-host it
via `next/font/local` with `font-display: swap`. Fallback stack:
`'Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', sans-serif`.

**Rationale:**

- 80 KB woff2 vs 300 KB full = ~220 KB saved per page load.
- Self-hosting avoids extra DNS + connection time (~300 ms on 3G).
- `font-display: swap` prevents invisible text during font load.
- Fallback fonts (`Hind Siliguri`, `Kalpurush`) are commonly pre-installed on
  Indian Android devices.

---

## ADR-014: Weekly Postgres Backup via GitHub Actions

**Date:** 2026-09-28
**Status:** Accepted

**Context:** Supabase's free tier has **no point-in-time recovery (PITR)**. If an
admin accidentally deletes all notices or the database is corrupted, there is no
built-in recovery mechanism.

**Decision:** Set up a weekly GitHub Actions workflow (`.github/workflows/backup.yml`)
that runs `pg_dump` against the Supabase database and stores the dump as a GitHub
Actions artifact (or pushes to a private backup repo).

**Rationale:**

- Automated — no volunteer action needed.
- GitHub Actions free tier provides 2,000 minutes/month (sufficient for weekly dumps).
- Recovery is manual but possible: restore from dump via `psql` or Supabase Dashboard.

---

## ADR-015: Messages Auto-Cleanup (90-Day TTL)

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The contact form is public. Even with rate limiting and honeypot, spam
messages will accumulate in the `messages` table over months. Supabase free tier
has a 500 MB database limit. Additionally, admins are unlikely to re-read messages
older than a few months.

**Decision:** Implement a daily cleanup job (Supabase `pg_cron` or scheduled Vercel
function) that deletes messages older than 90 days.

**Rationale:**

- Prevents unbounded table growth from spam or legitimate messages.
- 90 days is generous enough for admins to read and act on messages.
- `pg_cron` is available on Supabase (including free tier) and requires no
  external infrastructure.

---

## ADR-016: Design Tokens & Color Palette Selection

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The visual identity must suit a Bengali educational charity established in 1987 in Simurali, Nadia. It should convey warmth, trust, community service, and dignity while being legible on low-grade mobile screens under direct sunlight.

**Options Proposed:**

1. **Option 1 — "Saffron Dawn" (Selected):** Amber/Saffron (`oklch(0.70 0.18 60)`) as primary, Deep Teal (`oklch(0.55 0.12 168)`) as secondary accent, Warm Neutral (`oklch(0.985 0.005 80)`) for surfaces, and Terracotta (`oklch(0.58 0.14 22)`) for highlights.
2. **Option 2 — "Bengal Heritage":** Terracotta Red (`oklch(0.52 0.18 30)`) as primary, Deep Forest Green (`oklch(0.42 0.12 145)`) as secondary, Cream Ivory (`oklch(0.97 0.01 90)`) for surfaces.

**Decision:** Select **Option 1 ("Saffron Dawn")**.

**Rationale:**

- Saffron/Amber evokes Bengali community marigolds, warmth, optimism, and learning without looking corporate.
- Deep Teal provides strong visual contrast (WCAG AAA) for trust-building elements (library, dispensary, notices).
- Warm neutral background reduces eye strain on low-budget LCD screens compared to harsh `#FFFFFF`.
- Full token set implemented in `src/app/globals.css` with OKLCH color space for perceptually smooth gradients and accessible focus rings.

---

## ADR-017: Global Responsive Layout & Focus-Trapped Mobile Drawer

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The application needs a responsive header, mobile navigation drawer, language switcher, footer, skip-to-content link, and feedback boundaries (loading, error, 404). Audience uses low-cost mobile phones (down to 360px viewport width) and touch/keyboard interfaces.

**Decision:**

- Implement a sticky `<header>` containing branding, the 9 primary nav routes from `SITEMAP.md`, a language switcher, and a hamburger drawer trigger.
- Implement `MobileNav` as an accessible modal drawer (`role="dialog"`, `aria-modal="true"`) with a custom focus trap loop, `Escape` key close handler, body scroll lock, and touch targets ≥ 44x44px.
- Use `next-intl` navigation utilities (`usePathname`, `useRouter`) for seamless locale toggling between `/bn/...` and `/en/...`.
- Embed `<Header>` and `<Footer>` in `src/app/[locale]/layout.tsx` around `<main id="main-content">` with a WCAG skip link.
- Build bilingual `loading.tsx`, `error.tsx` (client error boundary), and `not-found.tsx` (404) pages.

**Rationale:**

- Native focus trapping without heavy external modal libraries keeps bundle size small.
- 360px layout design ensures zero horizontal scroll on small budget phones.
- Institutional placeholders (`{{ADDRESS}}`, `{{PHONE}}`, `{{EMAIL}}`) in footer maintain standing rules.

---

## ADR-018: Data-Access Layer & Modular Home Page Architecture

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The Home page requires 6 distinct sections per `docs/SITEMAP.md`: Hero + Short Intro, President's & Secretary's Messages, Key Initiatives/Highlights, Latest 5 Notices, Upcoming Events, and Quick Actions. Content currently comes from mock datasets, but will later migrate to Supabase Postgres queries.

**Decision:**

- Create a dedicated Data Access Layer under `src/lib/data/*.ts` (`getHighlights()`, `getLatestNotices()`, `getUpcomingEvents()`, `getLeadershipMessages()`).
- Keep mock data isolated inside `src/lib/mock/`.
- UI components under `src/components/sections/home/` consume data-access functions only; UI is unaware of whether data originates from mock objects or Supabase tables.
- Render leadership messages with an accessible modal dialog for full message reading.
- Implement explicit empty states for all dynamic sections when data arrays are empty.

**Rationale:**

- Decoupling UI components from data sourcing ensures that connecting Supabase in Phase 3 requires editing only the data-access functions (`src/lib/data/*`), without modifying any React component JSX.
- Meets standing rules regarding institutional placeholders (`{{PRESIDENT_NAME}}`, `{{SECRETARY_NAME}}`) and non-invented facts.

---

## ADR-021: Events System & Category Taxonomy

**Date:** 2026-09-28
**Status:** Accepted

**Context:** The organisation hosts educational, cultural, blood donation, book fair, and community service events. The events system requires admin management (`/admin/events`) and public display (`/events` and `/events/[slug]`) with category filters and upcoming vs past views.

**Decision:**

- Enforce the 6 sitemap categories (`Educational`, `Cultural`, `Social Welfare`, `Book Fair`, `Community`, `Special`) in the DB CHECK constraint and UI filters.
- Provide a view toggle between **Upcoming Events** (`date >= TODAY`, ordered ASC) and **Past Events** (`date < TODAY`, ordered DESC).
- Validate cover image uploads server-side via magic bytes (JPEG/PNG/WebP, ≤ 2 MB) and upload to Supabase Storage.
- Connect Home "Upcoming Events" widget to `getUpcomingEvents(3)`.

**Rationale:**

- Explicit category taxonomy helps visitors quickly locate specific types of programs (e.g. annual book fair or free medical camps).
- Upcoming vs Past view distinction ensures relevant future events stay front and center while retaining an archive of past achievements.

---

## ADR-022: Fallback Label for Unknown Event Categories

**Date:** 2026-10-06
**Status:** Accepted

**Context:** Public event rows may predate category validation or come from local
fallback data. Translating a missing or unrecognized category causes next-intl to
throw while rendering the events list.

**Decision:** Render a localized generic category label when an event category is
not in the supported event category list, and keep mock event records categorized.

**Rationale:**

- One incomplete record should not take down the whole public events page.
- The fallback data should satisfy the same category expectations as admin-created
  events.

---

## ADR-023: Graceful Empty State for Unavailable Gallery Data

**Date:** 2026-10-06
**Status:** Accepted

**Context:** Public gallery queries can fail when gallery tables have not yet been
created in the configured Supabase project. Logging those expected data-access
failures with `console.error` triggers Next.js's development error overlay.

**Decision:** Keep public gallery query failures as warnings and render the existing
localized empty state. Apply the gallery migrations to Supabase before expecting
stored photos or videos to appear.

**Rationale:**

- A missing gallery table should not prevent visitors from using the rest of the site.
- Warning logs retain diagnostics without presenting a fatal page-level error.

---

## ADR-024: Fallback Label for Unknown Notice Categories

**Date:** 2026-10-06
**Status:** Accepted

**Context:** Public notice rows may be missing a category or contain a value that
does not match the supported notice taxonomy. Passing that value directly to
next-intl can crash the notice list when resolving a missing message key.

**Decision:** Validate notice categories against `NOTICE_CATEGORIES` before
translation and render a localized generic label for missing or unknown values.

**Rationale:**

- An incomplete notice row should not take down the public notice board.
- Existing categories continue to use their regular localized labels.

---

## ADR-025: Middleware Owns Admin Route Protection

**Date:** 2026-10-06
**Status:** Accepted

**Context:** The `/admin/login` page is nested under the shared admin layout. An
authentication redirect in that layout sent unauthenticated visitors back to the
same login route, creating an infinite redirect loop.

**Decision:** Keep admin authentication redirects in middleware, which exempts
`/admin/login`; the shared admin layout must not perform a second auth redirect.

**Rationale:**

- A single route-protection boundary avoids conflicting session checks.
- The login page can render inside the admin route tree without being blocked by
  the layout intended for authenticated dashboard pages.

---

## ADR-026: Server Action Body Limit for Event Image Uploads

**Date:** 2026-10-06
**Status:** Accepted

**Context:** Event cover images are validated up to 2 MB, but Next.js Server
Actions default to a 1 MB request body limit. Multipart form data also adds
overhead, so otherwise valid image uploads are rejected before the action runs.

**Decision:** Set the Server Action body size limit to 5 MB, allowing larger
multipart form submissions while the event cover image remains capped at 2 MB.

**Rationale:**

- The request limit has room for multipart overhead and other event form data.
- Server-side image validation continues to enforce the 2 MB image cap.

---

## ADR-027: Use the Provisioned Gallery Storage Bucket

**Date:** 2026-10-06
**Status:** Accepted

**Context:** The gallery upload action referenced a `gallery` bucket, but the
database migration provisions `gallery-images` and scopes its Storage policies to
that bucket. Uploads therefore failed with `Bucket not found`.

**Decision:** Use `gallery-images` for both gallery uploads and public URL creation.

**Rationale:**

- The application code now matches the bucket and RLS policies provisioned by the
  existing migration.

---

## ADR-028: Permit Supabase Storage Media in Content Security Policy

**Date:** 2026-10-06
**Status:** Accepted

**Context:** Public notice PDFs are embedded from Supabase Storage, and uploaded
images are rendered from Supabase Storage URLs. The Content Security Policy did
not allow the Supabase project host in `frame-src` or `img-src`, so browsers
blocked those resources.

**Decision:** Allow `https://*.supabase.co` for `frame-src` and `img-src` only.

**Rationale:**

- PDF embeds and stored image content need those resource directives.
- Other CSP directives remain unchanged and Supabase is not added as a script source.

---

## ADR-029: Admin Contact Messages Inbox

**Date:** 2026-10-06
**Status:** Accepted

**Context:** The admin navigation linked to `/admin/messages`, but the route did
not exist even though the `messages` table and admin RLS policies were present.

**Decision:** Add an admin inbox that lists contact submissions, supports search and
read/unread filtering, and provides admin-only mark-read and delete actions.

**Rationale:**

- The route completes the existing contact form workflow for administrators.
- Row-level security remains the authorization boundary for reading and changing
  message records.

---

## ADR-030: Reply Composer Fallbacks for Admin Messages

**Date:** 2026-10-06
**Status:** Accepted

**Context:** The reply action previously relied only on a `mailto:` link. Browsers
without a registered email handler, including embedded development browsers, may
silently ignore that external protocol.

**Decision:** Open an in-app reply composer with options to launch a prefilled Gmail
compose page, launch the system email app, or copy the recipient, subject, and draft.

**Rationale:**

- Admins retain a usable reply workflow when `mailto:` handling is unavailable.
- The app does not send email or store reply drafts; sending remains with the admin.

---

## ADR-031: Avoid Full Reload After Form Link Save

**Date:** 2026-10-06
**Status:** Accepted

**Context:** The form-links editor waited one second after a successful save, then
performed a full browser reload to fetch the saved row again. This made saves feel
slow even after the database request had completed.

**Decision:** Return the saved row from create/update actions and update the admin
list in place. Continue revalidating public forms routes, but do not reload the
admin page after saving.

**Rationale:**

- The UI reflects the committed database row immediately after the action returns.
- Avoiding a full reload removes an extra request and page-render cycle.
