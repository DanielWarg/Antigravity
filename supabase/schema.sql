-- Antigravity: minimal persistens v0 för Hocuspocus/Yjs
-- Kör i Supabase SQL editor.

create table if not exists public.documents (
  name text primary key,
  data bytea not null,
  updated_at timestamptz not null default now()
);

-- (Valfritt) Index är redundant pga PK, men lämnas här som påminnelse om man ändrar key senare.
-- create index if not exists documents_name_idx on public.documents (name);

-- För v0 (utan auth) rekommenderas att hålla det enkelt:
-- - Antingen ingen RLS alls, eller RLS avstängt.
-- OBS: Denna app använder SUPABASE_SERVICE_ROLE_KEY på serversidan för att skriva/läsa.
