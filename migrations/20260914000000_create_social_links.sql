-- Create social_links table
create table if not exists public.social_links (
  platform_key text primary key,       -- e.g. "instagram", "facebook" — matches registry in code
  url          text not null,           -- the full link URL
  active       boolean not null default true,
  updated_at   timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.social_links enable row level security;

-- Public can read active links (for homepage display)
drop policy if exists "Public can read active social links" on public.social_links;
create policy "Public can read active social links"
  on public.social_links
  for select
  using (active = true);

-- Only authenticated admins can insert/update/delete
drop policy if exists "Admins can manage social links" on public.social_links;
create policy "Admins can manage social links"
  on public.social_links
  for all
  using (public.has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at on changes
create or replace function public.set_social_links_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists social_links_updated_at on public.social_links;
create trigger social_links_updated_at
  before update on public.social_links
  for each row execute function public.set_social_links_updated_at();
