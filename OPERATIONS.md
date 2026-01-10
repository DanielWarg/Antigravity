# OPERATIONS

## CI (GitHub Actions)
Workflows:
- `.github/workflows/ci.yml`: install + lint + typecheck + (test) + build + e2e (Playwright)
- `.github/dependabot.yml`: Dependabot (npm, weekly)
- `.github/CODEOWNERS`: code owner för repo:t

Status checks att använda i branch protection:
- **CI / checks**

## Branch protection (rekommendationer)
På `main`:
- Require pull request before merging
- Require approvals: 1–2
- Require status checks: **CI**, **CodeQL**
- Require conversation resolution
- Restrict force pushes

## Deploy: staging/prod (Vercel)
Vi använder **Vercel Git Integration**:
- Preview deploys på PR
- Production deploy på `main`

Ingen Vercel CLI i GitHub Actions och inga Vercel-secrets krävs i Actions.

## Observability: logging + Sentry
### Logging (baseline)
- Logga server events som strukturerad JSON när det är rimligt.
- Logga aldrig secrets (tokens, keys).

### Sentry (rekommenderad setup)
Minimal env:
- `SENTRY_DSN` (client/server)

Om ni vill automatisera releases/sourcemaps:
- `SENTRY_AUTH_TOKEN`

Not: Aktivera Sentry först när ni bestämmer om ni vill lägga in `@sentry/nextjs` (paket + config). För MVP räcker ofta bra server-logging och Playwright.

## Runtime checklist
- App: `npm run dev`
- Realtime: `npm run dev:yjs`
- Supabase verify: `node scripts/verify-supabase.js`

## AI API hårdning (drift)
- Rate limiting på `/api/ai` per IP.
- Server-side schema-validering av svar.
- Defensiv apply på klienten.
