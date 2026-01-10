# OPERATIONS

## CI (GitHub Actions)
Workflows:
- `.github/workflows/ci.yml`: lint + typecheck + build + e2e (Playwright)
- `.github/workflows/codeql.yml`: CodeQL scanning
- `.github/dependabot.yml`: Dependabot (npm + GitHub Actions)

Status checks att använda i branch protection:
- **CI**
- **CodeQL**

## Branch protection (rekommendationer)
På `main`:
- Require pull request before merging
- Require approvals: 1–2
- Require status checks: **CI**, **CodeQL**
- Require conversation resolution
- Restrict force pushes

## Deploy: staging/prod (Vercel)
Workflows:
- `.github/workflows/deploy-staging.yml`: auto på push till `main` (environment: `staging`)
- `.github/workflows/deploy-prod.yml`: manuell (workflow_dispatch) (environment: `production`)

### Required GitHub Secrets (Actions)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Rekommendation:
- Skapa GitHub Environments `staging` och `production`.
- Lägg “required reviewers” på `production` environment för manuell gate.

## Observability: logging + Sentry
### Logging (baseline)
- Logga server events som strukturerad JSON när det är rimligt.
- Logga aldrig secrets (tokens, keys).

### Sentry (rekommenderad setup)
Minimal env:
- `SENTRY_DSN` (client/server)

Om ni vill automatisera releases/sourcemaps:
- `SENTRY_AUTH_TOKEN`

Not: Aktivera Sentry först när ni bestämmer om ni vill lägga in `@sentry/nextjs` (paket + config). För MVP räcker ofta bra server-logging och Playwright + CodeQL.

## Runtime checklist
- App: `npm run dev`
- Realtime: `npm run dev:yjs`
- Supabase verify: `node scripts/verify-supabase.js`

## AI API hårdning (drift)
- Rate limiting på `/api/ai` per IP.
- Server-side schema-validering av svar.
- Defensiv apply på klienten.
