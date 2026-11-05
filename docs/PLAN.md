# Project Plan — Bidyarthi Free Coaching Centre Website

## Vision

Build a fast, accessible, bilingual (Bengali + English) website that serves as the
digital presence for Bidyarthi Free Coaching Centre — making its services discoverable,
its notices and events easy to access, and its administration simple for
non-technical volunteers.

---

## Users

### 1. Public Visitor

- **Who:** Local students (Classes V–X), parents, community members
- **Device:** Predominantly low-end Android phones on 3G/4G networks
- **Goals:** Find coaching schedule, read notices, view events/gallery, download forms,
  contact the centre
- **Language:** Bengali (primary), English (secondary)

### 2. Admin (Volunteer)

- **Who:** 1–3 non-technical volunteers managing content
- **Device:** Phone or basic laptop
- **Goals:** Post notices (PDF/text), manage events, upload gallery photos, update
  contact info and form links
- **Skill level:** Comfortable with WhatsApp/Google Forms; no coding knowledge

---

## Scope

### In Scope

- Bilingual public website (Bengali default, English)
- Homepage with hero, highlights, latest notices, quick links
- About, Coaching, Library, Dispensary, Ambulance, Book Fair, Kindergarten pages
- Notices board (admin uploads PDF or text; public views/downloads)
- Events listing with detail pages
- Photo gallery with filtering
- Contact page with form, address, embedded map
- Forms page linking to embedded Google Forms
- Admin dashboard (authenticated) for CRUD on all dynamic content
- SEO optimisation, Open Graph tags
- PWA basics (manifest, offline fallback)

### Non-Goals (v1)

- Online payments or donations portal
- Student login / result tracking
- Chat or messaging feature
- Blog / long-form content management
- Multi-admin role hierarchy (single admin role is sufficient)
- Native mobile app
- Embedded in-browser PDF viewer (use download links; Android WebView PDF support
  is unreliable)

---

## Phases

| Phase | Name                | Description                                                           |
| ----- | ------------------- | --------------------------------------------------------------------- |
| 0     | Foundation          | Project setup, Next.js + Tailwind + Supabase scaffolding, i18n config |
| 1     | Layout & Navigation | Shared layout (header, footer, mobile nav), theme, typography         |
| 2     | Public Pages        | Static-ish content pages (About, Coaching, Library, etc.)             |
| 3     | Data & Admin        | Supabase schema, RLS policies, admin auth, admin dashboard shell      |
| 4     | Notices             | Notice CRUD (admin), public notice list + detail, PDF viewer          |
| 5     | Events              | Event CRUD (admin), public event list + detail                        |
| 6     | Gallery             | Gallery CRUD (admin), public gallery grid with lightbox               |
| 7     | Forms & Contact     | Google Form embeds, contact form with Supabase message storage        |
| 8     | SEO / A11y / Perf   | Lighthouse audit, WCAG fixes, meta tags, sitemap.xml, robots.txt      |
| 9     | Testing             | Unit tests (Vitest), E2E tests (Playwright), cross-browser QA         |
| 10    | Deploy              | Vercel production deployment, domain setup, monitoring                |

---

## Success Criteria

| Criterion                       | Target                                              |
| ------------------------------- | --------------------------------------------------- |
| Lighthouse Performance (mobile) | ≥ 90                                                |
| Lighthouse Accessibility        | ≥ 90                                                |
| Lighthouse Best Practices       | ≥ 90                                                |
| Lighthouse SEO                  | ≥ 90                                                |
| Accessibility standard          | WCAG 2.1 AA                                         |
| Design approach                 | Mobile-first, responsive                            |
| First Contentful Paint (3G)     | < 2 s                                               |
| Time to Interactive (3G)        | < 5 s                                               |
| Page weight (initial load)      | < 300 KB (compressed, incl. Bengali font subset)    |
| Bengali font swap time          | < 500 ms (font-display: swap, self-hosted woff2)    |
| Bengali content coverage        | 100 % of public pages                               |
| Admin task completion           | Non-technical user can post a notice in < 3 minutes |
