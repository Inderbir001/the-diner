-- Event poster template: events render as a branded poster built from these fields,
-- or show an uploaded poster image as-is (display_mode = 'image').
alter table public.events
  add column kicker text,
  add column highlights text[] not null default '{}',
  add column theme text not null default 'red' check (theme in ('red', 'dark', 'light')),
  add column display_mode text not null default 'template' check (display_mode in ('template', 'image'));
