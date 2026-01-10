Antigravity är en **prompt-first collaborative canvas** (”Cursor för Miro”): du skriver på svenska i en chatt och AI föreslår **validerade board-events** som du kan **Apply/Discard**. Boarden synkas i realtid via **Yjs + Hocuspocus**.

## Kom igång

### 1) Installera

```bash
npm install
```

### 2) Starta appen

```bash
npm run dev
```

Öppna `http://localhost:3000`.

### 3) Starta realtids-servern (Hocuspocus)

I en separat terminal:

```bash
npm run dev:yjs
```

Default kör den på port `1234`.

## Konfiguration (env)

Skapa `.env.local` (commit:as inte).

### Realtid (klient → Hocuspocus)
- `NEXT_PUBLIC_HOCUSPOCUS_URL` (eller `NEXT_PUBLIC_YJS_URL`): t.ex. `ws://localhost:1234`

### AI (valfritt)
- `OPENAI_API_KEY`: om saknas kör `/api/ai` i mock-mode.

### Supabase (persistens v0 i Hocuspocus-servern)
Realtids-servern (`scripts/server.js`) kan spara/ladda boards till Supabase-tabellen `documents`.

Kräver:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side, commit:as aldrig)

SQL-schema finns i `supabase/schema.sql`.

Verifiera Supabase snabbt:
```bash
node scripts/verify-supabase.js
```

## GitHub/Vercel: manuell checklista (engångssetup)

### 1) Vercel Git Integration
- Importera repo:t i Vercel (New Project → Import Git Repository).
- Vercel sköter:
  - Preview deploys på PR
  - Production deploy på `main`

### 2) GitHub Branch Protection (när CI har kört minst en gång)
GitHub visar **No required checks** tills workflowet har körts minst en gång.

När du ser checken i listan, gå till `Settings → Branches` (ruleset/branch protection för `main`) och slå på:
- Require a pull request before merging
- Require approvals: 1
- Require status checks to pass: **CI / checks**
- Require conversation resolution
- Block force pushes
- Require linear history
