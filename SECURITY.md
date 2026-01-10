# SECURITY

## Principer
- **Minsta privilegium**: använd `SUPABASE_SERVICE_ROLE_KEY` endast i server-processer (t.ex. Hocuspocus), aldrig i klienten.
- **Schema först**: AI får bara påverka state via **validerade `BoardEvents`**.
- **Säkra defaults**: “deny by default” för permissions/RLS och för okända eventtyper.

## Secrets & config
### Aldrig i repo
- `.env*` är ignorerat av git. Håll det så.
- Lägg secrets i GitHub: `Settings → Secrets and variables → Actions`.

### Rekommenderade env-variabler
**App (Next.js)**:
- `OPENAI_API_KEY` (valfritt: annars mock-mode)
- `NEXT_PUBLIC_HOCUSPOCUS_URL` eller `NEXT_PUBLIC_YJS_URL`

**Hocuspocus server (`scripts/server.js`)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Rate limiting (API)**:
- `AI_RATE_LIMIT_PER_MINUTE` (t.ex. `30`)

**Sentry (valfritt)**:
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN` (CI/release uploads, om ni väljer att göra det)

## AI-säkerhet (BoardEvents)
### Server-side validering
- `/api/ai` ska alltid svara med objekt som klarar `BoardEventSchema`.
- Mock-mode ska också schema-valideras.

### Client-side apply (försvar i flera lager)
- Apply-logik ska vara defensiv: ignorera okända eventtyper och payloads som saknar obligatoriska fält.

## Rate limiting
- `/api/ai` ska vara rate-limitad per IP (minst in-memory för MVP).
- Produktion: överväg edge/store (Redis/Upstash) för robust rate limiting.

## Supabase & RLS
- För klient-access: **aktivera RLS** och skriv policies.
- För server-processer: service role bypassar RLS → extra viktigt med server-side inputvalidering och audit/logg.
- `documents` (persistens v0) är server-only: klienten ska inte skriva direkt.

## Dependency/security hygiene
- Dependabot uppdaterar npm + GitHub Actions veckovis.
- CodeQL körs på PR/push och schemalagt.

## Incident basics
- Rotera `SUPABASE_SERVICE_ROLE_KEY` och `OPENAI_API_KEY` vid läcka.
- Stäng av deploy (pausa workflows) och sänk rate-limits vid missbruk.
