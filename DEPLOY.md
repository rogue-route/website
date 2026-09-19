# DEPLOY.md — Environment Variables & Deployment Guide

All sensitive values go in `.env.local` (local dev) or Vercel Environment Variables (production).
Never commit real keys to git — `.env.local` is already in `.gitignore`.

---

## Required environment variables

| Variable | Where to get it | Example value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your domain | `https://gorogueroute.com` |
| `SUPABASE_URL` | Supabase → Settings → API | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API server secret/service role | `sb_secret_...` |
| `BREVO_API_KEY` | Brevo → SMTP & API → API Keys | Keep server-side |
| `BREVO_WAITLIST_LIST_ID` | Brevo → Contacts → Lists → Rogue Route Waitlist | Numeric list ID |

Optional Waitlist founder notification variables:

| Variable | Purpose |
|---|---|
| `WAITLIST_FOUNDER_NOTIFICATIONS_ENABLED` | Set to `true` to enable; any other value disables notifications |
| `BREVO_FROM_EMAIL` | Verified Brevo sender address |
| `NOTIFY_EMAIL` | Founder notification recipient |

> **SUPABASE_SERVICE_ROLE_KEY** must never be prefixed with `NEXT_PUBLIC_`.
> It is server-side only. Never expose it to the browser.

---

## Local development setup

Create a file called `.env.local` in the `rogueroute/` folder with the variables above, then fully restart the Next.js development server. The Waitlist API returns a configuration error when required credentials are absent or when `SUPABASE_SERVICE_ROLE_KEY` is recognizably a public credential.

---

## Supabase table — create this once

Run this SQL in **Supabase → SQL Editor** before going live:

```sql
create table quiz_responses (
  id              uuid primary key default gen_random_uuid(),
  stage1_answers  jsonb        not null,
  stage1_score    integer      not null,
  stage1_tier     text         not null,
  stage2_answers  jsonb        not null,
  stage2_score    integer      not null,
  stage2_tier     text         not null,
  email           text,
  submitted_at    timestamptz  not null
);
```

---

The Waitlist table migration is tracked separately at `supabase/migrations/20260919_create_waitlist_submissions.sql`. Review and apply it manually to the intended Supabase project; do not weaken RLS or add a public insert policy.
