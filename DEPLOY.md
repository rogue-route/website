# DEPLOY.md — Environment Variables & Deployment Guide

All sensitive values go in `.env.local` (local dev) or Vercel Environment Variables (production).
Never commit real keys to git — `.env.local` is already in `.gitignore`.

---

## Required environment variables

| Variable | Where to get it | Example value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your domain | `https://gorogueroute.com` |
| `RESEND_API_KEY` | resend.com → API Keys | `re_abc123...` |
| `NOTIFY_EMAIL` | Your choice | `abhivellala@gmail.com` |
| `FROM_EMAIL` | After verifying domain in Resend | `RogueRoute <noreply@gorogueroute.com>` |
| `SUPABASE_URL` | Supabase → Settings → API | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | `eyJhbGc...` |

> **SUPABASE_SERVICE_ROLE_KEY** must never be prefixed with `NEXT_PUBLIC_`.
> It is server-side only. Never expose it to the browser.

---

## Local development setup

Create a file called `.env.local` in the `rogueroute/` folder with the variables above.
The app works without them — API routes fall back to `console.log` when keys are absent.

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

## Resend domain verification

Until `gorogueroute.com` is verified in Resend, emails send from `onboarding@resend.dev`.
To use `noreply@gorogueroute.com`:
1. Go to resend.com → Domains → Add Domain → enter `gorogueroute.com`
2. Add the DNS records Resend shows you (in your DNS provider — not Wix)
3. Once verified, set `FROM_EMAIL=RogueRoute <noreply@gorogueroute.com>` in Vercel
