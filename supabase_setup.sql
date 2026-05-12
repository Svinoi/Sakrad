-- ============================================
-- SÄKRAD — Supabase setup
-- Kör detta i Supabase → SQL Editor
-- ============================================


-- ============================================
-- TABELL: projekt
-- ============================================
create table if not exists projekt (
  id                    uuid default gen_random_uuid() primary key,
  namn                  text not null,
  projekt_nummer        text,
  byggherren            text not null,
  besoksadress          text,
  start_datum           date,
  slut_datum            date,
  entreprenad_form      text not null,
  bas_p_foretag         text,
  bas_p_person          text,
  bas_u_foretag         text,
  bas_u_person          text,
  skyddsombud_namn      text,
  skyddsombud_telefon   text,
  status                text default 'aktiv' check (status in ('aktiv', 'avslutat', 'pausat')),
  skapad_av             uuid references auth.users(id) on delete set null,
  skapad_at             timestamptz default now()
);

alter table projekt enable row level security;

create policy "Användare ser sina egna projekt"
  on projekt for select
  using (auth.uid() = skapad_av);

create policy "Användare skapar egna projekt"
  on projekt for insert
  with check (auth.uid() = skapad_av);

create policy "Användare uppdaterar egna projekt"
  on projekt for update
  using (auth.uid() = skapad_av);


-- ============================================
-- TABELL: observationer (YA-rapport)
-- ============================================
create table if not exists observationer (
  id            uuid default gen_random_uuid() primary key,
  projekt_id    uuid references projekt(id) on delete cascade,
  kategori      text not null check (kategori in ('risk', 'skada', 'bra')),
  beskrivning   text,
  plats         text,
  bild_urls     text[] default '{}',
  skapad_av     uuid references auth.users(id) on delete set null,
  skapad_at     timestamptz default now()
);

alter table observationer enable row level security;

create policy "Användare ser observationer i sina projekt"
  on observationer for select
  using (
    auth.uid() = skapad_av
    or exists (
      select 1 from projekt p
      where p.id = observationer.projekt_id
      and p.skapad_av = auth.uid()
    )
  );

create policy "Inloggade användare kan skapa observationer"
  on observationer for insert
  with check (auth.uid() = skapad_av);


-- ============================================
-- TABELL: dokument (AMP, riskbedömning m.m.)
-- ============================================
create table if not exists dokument (
  id            uuid default gen_random_uuid() primary key,
  projekt_id    uuid references projekt(id) on delete cascade,
  typ           text not null check (typ in ('amp', 'riskbedomning', 'arbetsberedning', 'egenkontroll', 'incident')),
  titel         text not null,
  innehall      jsonb default '{}',
  status        text default 'utkast' check (status in ('utkast', 'publicerat', 'arkiverat')),
  skapad_av     uuid references auth.users(id) on delete set null,
  skapad_at     timestamptz default now(),
  uppdaterad_at timestamptz default now()
);

alter table dokument enable row level security;

create policy "Användare hanterar dokument i sina projekt"
  on dokument for all
  using (
    exists (
      select 1 from projekt p
      where p.id = dokument.projekt_id
      and p.skapad_av = auth.uid()
    )
  );


-- ============================================
-- TABELL: signeringar
-- ============================================
create table if not exists signeringar (
  id            uuid default gen_random_uuid() primary key,
  dokument_id   uuid references dokument(id) on delete cascade,
  namn          text not null,
  roll          text,
  email         text,
  status        text default 'vantar' check (status in ('vantar', 'signerat', 'avvisat')),
  signerad_at   timestamptz,
  skapad_at     timestamptz default now()
);

alter table signeringar enable row level security;

create policy "Användare ser signeringar på sina dokument"
  on signeringar for all
  using (
    exists (
      select 1 from dokument d
      join projekt p on p.id = d.projekt_id
      where d.id = signeringar.dokument_id
      and p.skapad_av = auth.uid()
    )
  );


-- ============================================
-- STORAGE: observationer (bilder från YA)
-- ============================================
-- Kör detta separat under Storage → New bucket
-- Namn: observationer
-- Public bucket: JA (så bilderna kan visas i appen)

insert into storage.buckets (id, name, public)
values ('observationer', 'observationer', true)
on conflict (id) do nothing;

create policy "Inloggade kan ladda upp bilder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'observationer');

create policy "Alla kan se bilder"
  on storage.objects for select
  using (bucket_id = 'observationer');

create policy "Användare tar bort egna bilder"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'observationer' and auth.uid()::text = (storage.foldername(name))[1]);


-- ============================================
-- KLAR
-- Kontrollera att tabellerna syns under
-- Table Editor i Supabase-panelen.
-- ============================================
