# Säkrad — Arbetsmiljö & dokumentation

## Kom igång

### 1. Installera beroenden
```bash
npm install
```

### 2. Konfigurera miljövariabler
Kopiera `.env.local.example` till `.env.local` och fyll i dina Supabase-nycklar:
```bash
cp .env.local.example .env.local
```

Hämta nycklarna från: Supabase → Settings → API

### 3. Skapa databastabellen i Supabase
Kör detta SQL i Supabase → SQL Editor:

```sql
create table projekt (
  id uuid default gen_random_uuid() primary key,
  namn text not null,
  projekt_nummer text,
  byggherren text not null,
  besoksadress text,
  start_datum date,
  slut_datum date,
  entreprenad_form text not null,
  bas_p_foretag text,
  bas_p_person text,
  bas_u_foretag text,
  bas_u_person text,
  skyddsombud_namn text,
  skyddsombud_telefon text,
  status text default 'aktiv',
  skapad_av uuid references auth.users(id),
  skapad_at timestamptz default now()
);

-- Row Level Security
alter table projekt enable row level security;

create policy "Användare ser sina egna projekt"
  on projekt for all
  using (auth.uid() = skapad_av);
```

### 4. Starta dev-servern
```bash
npm run dev
```
Öppna http://localhost:3000

### 5. Deploy till Netlify
```bash
npm install -D @netlify/plugin-nextjs
netlify deploy --build
```

## Struktur
```
src/
  app/
    login/          ← Inloggning (Magic Link)
    auth/callback/  ← Supabase auth-callback
    dashboard/      ← Hemskärm, projektlista
    dashboard/projekt/ny/  ← Skapa nytt projekt
  components/
    layout/         ← BottomNav
    ui/             ← Icons, gemensamma komponenter
  lib/
    supabase.ts     ← Supabase-klient
  types/
    index.ts        ← TypeScript-typer
```
