# Architecture — Bidyarthi Free Coaching Centre Website

## Tech Stack

| Layer        | Technology                  | Rationale                                                        |
| ------------ | --------------------------- | ---------------------------------------------------------------- |
| Framework    | Next.js 14+ (App Router)    | SSR/SSG, image optimisation, API routes, Vercel-native           |
| Language     | TypeScript (strict)         | Type safety, maintainability                                     |
| Styling      | Tailwind CSS 3              | Utility-first, small bundle, rapid prototyping                   |
| i18n         | next-intl                   | App Router support, message-based translation, Bengali + English |
| Database     | Supabase Postgres           | Free tier, real-time, Row-Level Security, managed                |
| Auth         | Supabase Auth               | Email/password, integrates with RLS                              |
| File Storage | Supabase Storage            | Notice PDFs, gallery images, with public CDN URLs                |
| Hosting      | Vercel                      | Zero-config Next.js deploys, edge network, free tier             |
| Analytics    | Vercel Analytics (optional) | Privacy-friendly, no cookie banner needed                        |

---

## Folder Structure

```
.
├── CLAUDE.md
├── docs/
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   ├── TODO.md
│   ├── DECISIONS.md
│   └── SITEMAP.md
├── content/                    # Translatable content with {{PLACEHOLDER}} markers
│   ├── bn/                     # Bengali translations
│   └── en/                     # English translations
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── images/                 # Static images (logos, icons)
├── src/
│   ├── app/
│   │   ├── [locale]/           # i18n dynamic segment
│   │   │   ├── layout.tsx      # Root layout (header, footer)
│   │   │   ├── page.tsx        # Home
│   │   │   ├── about/
│   │   │   ├── coaching/
│   │   │   ├── library/
│   │   │   ├── events/
│   │   │   │   └── [slug]/
│   │   │   ├── gallery/
│   │   │   ├── notices/
│   │   │   │   └── [id]/
│   │   │   ├── dispensary/
│   │   │   ├── ambulance/
│   │   │   ├── book-fair/
│   │   │   ├── kindergarten/
│   │   │   ├── forms/
│   │   │   ├── contact/
│   │   │   ├── not-found.tsx    # 404 page (localised)
│   │   │   └── error.tsx        # 500 error boundary (localised)
│   │   ├── admin/              # Admin routes (outside locale segment)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── notices/
│   │   │   ├── events/
│   │   │   ├── gallery/
│   │   │   ├── forms/
│   │   │   ├── settings/
│   │   │   ├── messages/
│   │   │   └── highlights/
│   │   └── api/
│   │       ├── contact/
│   │       └── revalidate/
│   ├── components/
│   │   ├── ui/                 # Reusable primitives (Button, Card, Modal, etc.)
│   │   ├── layout/             # Header, Footer, MobileNav, AdminSidebar
│   │   └── sections/           # Page-specific sections (Hero, HighlightCards, etc.)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client (cookies-based)
│   │   │   └── admin.ts        # Service-role client (server-only)
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/                  # Custom React hooks
│   ├── types/
│   │   └── database.ts         # Auto-generated from Supabase
│   └── styles/
│       └── globals.css         # Tailwind directives + custom fonts
├── supabase/
│   ├── migrations/             # SQL migration files
│   ├── seed.sql                # Seed data for local dev
│   └── config.toml
├── messages/                   # next-intl translation files
│   ├── bn.json
│   └── en.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local.example
└── .github/
    └── workflows/
        └── backup.yml          # Weekly pg_dump to private repo
```

---

## Route Map

### Public Routes (under `[locale]`)

| Route            | Page               | Data Source                 | Rendering               |
| ---------------- | ------------------ | --------------------------- | ----------------------- |
| `/`              | Home               | notices, highlights, events | ISR (60 s)              |
| `/about`         | About Us           | Static content              | SSG                     |
| `/coaching`      | Free Coaching      | Static content              | SSG                     |
| `/library`       | Students' Library  | Static content              | SSG                     |
| `/events`        | Events List        | `events` table              | ISR (60 s)              |
| `/events/[slug]` | Event Detail       | `events` table              | ISR (60 s)              |
| `/gallery`       | Photo Gallery      | `gallery_items` table       | ISR (60 s)              |
| `/notices`       | Notices Board      | `notices` table             | ISR (300 s) + on-demand |
| `/notices/[id]`  | Notice Detail      | `notices` table + Storage   | ISR (300 s) + on-demand |
| `/dispensary`    | Dispensary         | Static content              | SSG                     |
| `/ambulance`     | Ambulance & Oxygen | Static content              | SSG                     |
| `/book-fair`     | Book Fair          | Static content              | SSG                     |
| `/kindergarten`  | Kindergarten       | Static content              | SSG                     |
| `/forms`         | Forms              | `form_links` table          | ISR (300 s)             |
| `/contact`       | Contact Us         | `site_settings` table       | ISR (300 s)             |

### Admin Routes

| Route               | Page                |
| ------------------- | ------------------- |
| `/admin`            | Dashboard           |
| `/admin/notices`    | Manage Notices      |
| `/admin/events`     | Manage Events       |
| `/admin/gallery`    | Manage Gallery      |
| `/admin/forms`      | Manage Form Links   |
| `/admin/settings`   | Site Settings       |
| `/admin/messages`   | Contact Messages    |
| `/admin/highlights` | Homepage Highlights |

### API Routes

| Route             | Method | Purpose                                            |
| ----------------- | ------ | -------------------------------------------------- |
| `/api/contact`    | POST   | Submit contact form → `messages` table             |
| `/api/revalidate` | POST   | On-demand ISR revalidation (webhook from Supabase) |

---

## Data Model (Supabase Postgres)

### `notices`

| Column         | Type        | Notes                                             |
| -------------- | ----------- | ------------------------------------------------- |
| `id`           | uuid (PK)   |                                                   |
| `title_bn`     | text        | Bengali title                                     |
| `title_en`     | text        | English title (optional)                          |
| `body_bn`      | text        | Bengali body text (nullable if PDF)               |
| `body_en`      | text        | English body text (nullable)                      |
| `file_url`     | text        | Supabase Storage URL for PDF/TXT (nullable)       |
| `file_type`    | text        | `pdf` \| `txt` \| `null`                          |
| `file_size`    | integer     | File size in bytes; shown to user before download |
| `is_pinned`    | boolean     | Show at top of list                               |
| `published_at` | timestamptz |                                                   |
| `created_at`   | timestamptz | Default `now()`                                   |
| `updated_at`   | timestamptz | Auto-updated                                      |

> **Constraint:** `file_size <= 5242880` (5 MB). Enforced both client-side and
> via a Postgres CHECK constraint. Admins uploading from phones on slow connections
> cannot reasonably handle larger files either.

### `events`

| Column            | Type          | Notes                                  |
| ----------------- | ------------- | -------------------------------------- |
| `id`              | uuid (PK)     |                                        |
| `slug`            | text (unique) | URL-friendly identifier                |
| `title_bn`        | text          |                                        |
| `title_en`        | text          |                                        |
| `description_bn`  | text          |                                        |
| `description_en`  | text          |                                        |
| `date`            | date          | Event date                             |
| `time`            | text          | Human-readable time (e.g. "সকাল ১০টা") |
| `location`        | text          |                                        |
| `cover_image_url` | text          |                                        |
| `is_published`    | boolean       |                                        |
| `created_at`      | timestamptz   |                                        |
| `updated_at`      | timestamptz   |                                        |

### `gallery_items`

| Column       | Type        | Notes                                                 |
| ------------ | ----------- | ----------------------------------------------------- |
| `id`         | uuid (PK)   |                                                       |
| `image_url`  | text        | Supabase Storage URL (resized ≤ 1200 px, WebP)        |
| `thumb_url`  | text        | Thumbnail URL (≤ 400 px, WebP, for grid view)         |
| `caption_bn` | text        |                                                       |
| `caption_en` | text        |                                                       |
| `category`   | text        | e.g. `coaching`, `event`, `book-fair`, `kindergarten` |
| `sort_order` | integer     | For manual ordering                                   |
| `created_at` | timestamptz |                                                       |

> **Image pipeline:** On upload, the server resizes the original to ≤ 1200 px wide
> (display size) and generates a ≤ 400 px thumbnail (grid/list size), both as WebP.
> Originals are NOT stored to conserve the 1 GB Storage quota.

### `form_links`

| Column            | Type        | Notes                      |
| ----------------- | ----------- | -------------------------- |
| `id`              | uuid (PK)   |                            |
| `title_bn`        | text        |                            |
| `title_en`        | text        |                            |
| `description_bn`  | text        |                            |
| `description_en`  | text        |                            |
| `google_form_url` | text        | Embeddable Google Form URL |
| `is_active`       | boolean     | Show/hide on public page   |
| `sort_order`      | integer     |                            |
| `created_at`      | timestamptz |                            |

### `site_settings`

| Column       | Type        | Notes                                                     |
| ------------ | ----------- | --------------------------------------------------------- |
| `key`        | text (PK)   | e.g. `phone`, `address_bn`, `address_en`, `hero_title_bn` |
| `value`      | text        |                                                           |
| `updated_at` | timestamptz |                                                           |

### `messages`

| Column       | Type        | Notes           |
| ------------ | ----------- | --------------- |
| `id`         | uuid (PK)   |                 |
| `name`       | text        | Sender name     |
| `email`      | text        |                 |
| `phone`      | text        | Optional        |
| `message`    | text        |                 |
| `is_read`    | boolean     | Default `false` |
| `created_at` | timestamptz |                 |

> **Auto-cleanup:** A Supabase cron (pg_cron) or scheduled Vercel function deletes
> messages older than 90 days to prevent unbounded table growth from spam.

### `highlights`

| Column           | Type        | Notes                            |
| ---------------- | ----------- | -------------------------------- |
| `id`             | uuid (PK)   |                                  |
| `title_bn`       | text        |                                  |
| `title_en`       | text        |                                  |
| `description_bn` | text        |                                  |
| `description_en` | text        |                                  |
| `icon`           | text        | Icon name or emoji               |
| `link`           | text        | Internal link (e.g. `/coaching`) |
| `sort_order`     | integer     |                                  |
| `is_active`      | boolean     |                                  |
| `created_at`     | timestamptz |                                  |

---

## How Notices Work

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Admin UI  │────▶│  Supabase        │────▶│  Public Site    │
│             │     │                  │     │                 │
│ • Paste text│     │ Storage:         │     │ /notices        │
│ • Upload PDF│     │   notice-files/  │     │   List view     │
│ • Upload TXT│     │                  │     │                 │
│             │     │ Postgres:        │     │ /notices/[id]   │
│             │     │   notices table  │     │   Detail + PDF  │
└─────────────┘     └──────────────────┘     └─────────────────┘
```

1. **Admin uploads** a PDF or `.txt` file, or pastes text directly.
2. **Client-side validation** rejects files > 5 MB or non-PDF/TXT MIME types.
3. Files are uploaded to **Supabase Storage** bucket `notice-files/`.
4. Metadata (title, body, file URL, **file size**) is saved to the `notices` table.
5. The public site fetches notices via ISR (revalidate every 300 s). Admin saves
   trigger an **on-demand revalidation** call to `/api/revalidate` so changes appear
   within seconds without wasteful short-interval polling.
6. Public users can **view text notices inline**. PDF notices show a **download
   button with file size** (e.g. "Download PDF · 1.2 MB"). PDFs are **never
   embedded in an iframe** — most low-end Android browsers cannot render embedded
   PDFs, and the iframe fallback is a blank white box.

---

## How Forms Work

1. Admin stores a Google Form URL in the `form_links` table via the admin dashboard.
2. On **screens ≥ 768 px**, the public `/forms` page renders each active form as an
   **embedded iframe** (Google Forms iframes are poorly responsive on narrow screens).
3. On **screens < 768 px** (most users), the form is shown as a **prominent
   external link button** that opens the Google Form in a new tab. This is more
   reliable than an iframe on low-end Android browsers.
4. Responses are collected **directly by Google Forms** into the linked Google Sheet.
5. The site never handles or stores form responses — Google manages everything.

---

## Security Model

### Authentication

- Supabase Auth with **email/password** sign-in.
- No public registration; admin accounts are created manually.

### Authorisation (Row-Level Security)

| Table           | SELECT        | INSERT / UPDATE / DELETE                      |
| --------------- | ------------- | --------------------------------------------- |
| `notices`       | Public (anon) | Admin only (`auth.uid() IN admin_allowlist`)  |
| `events`        | Public (anon) | Admin only                                    |
| `gallery_items` | Public (anon) | Admin only                                    |
| `form_links`    | Public (anon) | Admin only                                    |
| `site_settings` | Public (anon) | Admin only                                    |
| `messages`      | Admin only    | Public INSERT (anon); admin for UPDATE/DELETE |
| `highlights`    | Public (anon) | Admin only                                    |

### Admin Allowlist

A `admin_users` table stores allowed admin user IDs. The table has two columns:

- `id` (uuid, FK to `auth.users.id`) — used in RLS policies
- `email` (text) — for human reference only

RLS policies check `auth.uid()` against this table's `id` column.

```sql
-- Example RLS policy
CREATE POLICY "Admin can manage notices"
  ON notices FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users
    )
  );
```

### Storage Security

| Bucket           | Public Read | Write                                |
| ---------------- | ----------- | ------------------------------------ |
| `notice-files`   | Yes         | Admin only (via service role or RLS) |
| `gallery-images` | Yes         | Admin only                           |

### API Security

- `/api/contact`: Rate-limited (e.g. 5 req/min per IP), honeypot field for spam.
- `/api/revalidate`: Protected by a shared secret (`REVALIDATE_SECRET`).
- All admin routes: Protected by Supabase Auth middleware.
- **File uploads:** Validated server-side for MIME type (`application/pdf`,
  `text/plain`, `image/jpeg`, `image/png`, `image/webp`) and size (PDF ≤ 5 MB,
  images ≤ 2 MB). Filenames are sanitized (UUID-based rename) to prevent path
  traversal.

---

## Bengali Font Loading Strategy

Bengali body text uses **Noto Sans Bengali** (Google Fonts). To stay within the
< 200 KB page-weight budget:

1. **Subset** to Bengali + Basic Latin Unicode ranges (`U+0980-09FF, U+0000-007F`).
2. **Self-host** the woff2 file (≤ 80 KB) — do not use the Google Fonts CDN
   (extra DNS lookup + render-blocking on slow 3G).
3. **`font-display: swap`** — show system font immediately, swap when ready.
4. **Fallback stack:** `'Noto Sans Bengali', 'Hind Siliguri', 'Kalpurush', sans-serif`.
5. **`next/font/local`** for automatic optimisation and zero layout shift.

English text uses **Inter** (Latin subset, ≤ 20 KB woff2).

---

## Backup & Disaster Recovery

| What                   | How                                                                                                                    | Frequency |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- |
| Postgres data          | `pg_dump` via GitHub Actions → private repo artifact                                                                   | Weekly    |
| Supabase Storage       | Sync to a backup bucket via `rclone` or manual export                                                                  | Monthly   |
| Admin account recovery | Break-glass: use `SUPABASE_SERVICE_ROLE_KEY` to reset password or add a new admin via Supabase Dashboard or direct SQL | As needed |

> **Note:** Supabase's free tier does not include point-in-time recovery (PITR).
> The weekly `pg_dump` is the only safety net against accidental data deletion.
