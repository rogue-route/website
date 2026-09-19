begin;

-- Do not silently accept an unknown pre-existing table shape. If this raises,
-- inspect and migrate the existing table instead of creating a second table.
do $$
begin
  if to_regclass('public.waitlist_submissions') is not null then
    raise exception
      'public.waitlist_submissions already exists; inspect its schema and data before applying this migration';
  end if;
end
$$;

create table public.waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint waitlist_submissions_name_not_blank
    check (char_length(name) > 0),
  constraint waitlist_submissions_email_not_blank
    check (char_length(email) > 0),
  constraint waitlist_submissions_email_unique
    unique (email)
);

comment on table public.waitlist_submissions is
  'Rogue Route launch waitlist contacts. Separate from newsletter and questionnaire data.';

comment on column public.waitlist_submissions.email is
  'Email normalized to lowercase with surrounding whitespace removed before uniqueness is enforced.';

create or replace function public.normalize_waitlist_submission()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.name := btrim(new.name);
  new.email := lower(btrim(new.email));

  if tg_op = 'UPDATE' then
    new.created_at := old.created_at;
    new.updated_at := clock_timestamp();
  else
    new.created_at := coalesce(new.created_at, clock_timestamp());
    new.updated_at := coalesce(new.updated_at, new.created_at);
  end if;

  return new;
end;
$$;

create trigger normalize_waitlist_submission_before_write
before insert or update on public.waitlist_submissions
for each row
execute function public.normalize_waitlist_submission();

alter table public.waitlist_submissions enable row level security;

revoke all on table public.waitlist_submissions from anon;
revoke all on table public.waitlist_submissions from authenticated;

grant select, insert, update
on table public.waitlist_submissions
to service_role;

commit;
