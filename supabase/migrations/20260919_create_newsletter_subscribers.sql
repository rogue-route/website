begin;

-- Do not silently accept an unknown pre-existing table shape. If this raises,
-- inspect and migrate the existing table instead of creating a second table.
do $$
begin
  if to_regclass('public.newsletter_subscribers') is not null then
    raise exception
      'public.newsletter_subscribers already exists; inspect its schema and data before applying this migration';
  end if;
end
$$;

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint newsletter_subscribers_email_not_blank
    check (char_length(email) > 0),
  constraint newsletter_subscribers_email_unique
    unique (email)
);

comment on table public.newsletter_subscribers is
  'Rogue Route newsletter subscribers. Separate from waitlist and questionnaire data.';

comment on column public.newsletter_subscribers.email is
  'Email normalized to lowercase with surrounding whitespace removed before uniqueness is enforced.';

create or replace function public.normalize_newsletter_subscriber()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
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

create trigger normalize_newsletter_subscriber_before_write
before insert or update on public.newsletter_subscribers
for each row
execute function public.normalize_newsletter_subscriber();

alter table public.newsletter_subscribers enable row level security;

revoke all on table public.newsletter_subscribers from anon;
revoke all on table public.newsletter_subscribers from authenticated;

grant select, insert, update
on table public.newsletter_subscribers
to service_role;

commit;
