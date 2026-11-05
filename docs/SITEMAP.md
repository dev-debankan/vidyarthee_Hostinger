# Sitemap — Bidyarthi Free Coaching Centre

> **Note:** This is a draft sitemap based on the organisation's described services.
> Review and adjust before implementation.

## Public Pages

```
/                           → Home (hero, highlights, quick links, latest notices)
/about                      → About Us (history since 1987, mission, leadership)
/coaching                   → Free Coaching (Classes V–X, subjects, schedule)
/library                    → Students' Library (5,000+ books, catalogue info)
/events                     → Events & Cultural Programs (upcoming + past)
/events/[slug]              → Event Detail (description, date, gallery)
/gallery                    → Photo Gallery (filterable grid)
/notices                    → Notices Board (list of PDF / text notices)
/notices/[id]               → Notice Detail (view / download)
/dispensary                 → Homeopathic Dispensary (services, timings)
/ambulance                  → Ambulance & Oxygen Service (availability, contact)
/book-fair                  → Annual Book Fair (dates, details)
/kindergarten               → Bidyarthi Shishu Niketan (kindergarten info, admission)
/forms                      → Forms & Applications (links to Google Forms)
/contact                    → Contact Us (form, address, map, phone)
/*                          → 404 Not Found (localised)
```

## Admin Pages (authenticated)

```
/admin                      → Admin Dashboard (overview, quick actions)
/admin/login                → Admin Login (email/password)
/admin/notices               → Manage Notices (CRUD, upload PDF/TXT)
/admin/events                → Manage Events (CRUD)
/admin/gallery               → Manage Gallery (upload, caption, reorder)
/admin/forms                 → Manage Form Links (add/edit Google Form URLs)
/admin/settings              → Site Settings (phone, address, timings, hero text)
/admin/messages              → View Contact Messages
/admin/highlights            → Manage Homepage Highlights
```

## Internationalisation

All public pages are available under `/{locale}/...` where locale is `bn` (Bengali,
default) or `en` (English).

```
/bn/about                   → About Us (Bengali)
/en/about                   → About Us (English)
```

## API Routes

```
/api/contact                → POST contact form submission
/api/revalidate             → On-demand ISR revalidation webhook
```
