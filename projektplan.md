# Projektplan: Antigravity (Prompt-first Collaborative Canvas)

## Mål & vision
Bygga en realtids-whiteboard där användaren styr via chatt på svenska. AI:n fungerar som en “compiler” som översätter text till **validerade BoardEvents** som användaren kan **Apply/Discard** innan något ändras på canvasen.

## Produktmål (val: B)
**Vi bygger Miro-kärnan + AI-workflows (“Cursor för Miro”)** – inte full Miro-paritet.

Det betyder:
- **Miro-kärna**: notes/text/basic shapes/connectors/frames, snabb navigering, grundläggande samarbete.
- **AI-workflows**: clustering, auto-layout, summarize → actions/decisions, “prompt = template”.
- **Lovable**: extremt snabb, trygg och snygg: preview → apply, bra undo/redo, premium-känsla.

## Strategi: vad vi tar med / vad vi inte optimerar för
- **Vi tar med**: funktioner som stärker prompt-first-flödet och vardaglig workshop/planering.
- **Vi lägger “på is”** (inte mål just nu): 250+ integrationer, inbyggd video, enterprise (SSO/data residency), full templates-katalog, full shape- och ritverktygs-paritet.

## Prioritetsnivåer
- **MVP**: måste för att kärnan ska funka
- **MVP+**: gör produkten “riktig” och lovable
- **Senare**: nice-to-have, eller “Miro-paritet”-område

## Scope (MVP)
- Canvas (React Flow): zoom/pan, skapa/flytta noder, koppla noder med edges
- Chattpanel: prompt → AI-svar + föreslagna BoardEvents
- “Trygg AI”: tydlig diff + Apply/Discard
- Realtids-synk (Yjs/Hocuspocus) mellan klienter
- Grundläggande persistens (MVP): save/load board by id via Hocuspocus server med Supabase-lagring när env finns

## A–Ö roadmap (v2) – från nu till “lovable MVP”

### Del 0: Baslinje & hård DoD
- [ ] **MVP DoD**: prompt→preview→apply/discard, realtidssynk i två flikar, boards går att spara/ladda via `boardId`, samt 2 workflows (auto-cluster + summarize).
- [ ] **AI DoD**: AI får endast påverka state via **schema-validerade `BoardEvents`** (defensiv apply: ignorerar/avvisar okända typer/fält).

### Del 1: Stabil Miro-kärna
- [x] Cluster/frames fungerar på riktigt (render + events)
- [x] Discard fungerar (inget commit vid discard)
- [x] Websocket-url är konfigurerbar (ej hårdkodat localhost)

### Del 1.5: Persistens v0 (utan auth, låg friktion)
- [x] Implementerat: save/load board state by `boardId` via Hocuspocus + Supabase (ingen auth än)
- [x] Dokumenterat: env + tabellkrav (SQL i `supabase/schema.sql`)
- [ ] Verifierat: starta `npm run dev:yjs` med Supabase env och bekräfta att refresh laddar boarden

### Del 2: Proposal Mode på canvas (ghost-preview)
- [ ] Proposal-state är lokal (inte Yjs)
- [ ] Ghost-noder/edges renderas på canvas
- [ ] Apply: proposal → commit till Yjs
- [ ] Discard: rensa proposal utan att röra Yjs
- [ ] Diff/highlight i viewport

### Del 3: AI-workflows (identitet)
- [ ] Workflow 1: Auto-cluster (skapa clusters + flytta noder deterministiskt)
- [ ] Workflow 2: Summarize → actions/decisions (+ ev. schema-utökning)

### Del 4: Auth/roller (riktig arkitektur)
- [ ] Supabase auth
- [ ] Owner/Editor/Viewer + enforcement (UI + AI-policy)

### Del 5: Export
- [ ] Export PNG + text summary

### Del 6: Kvalitet & polish
- [ ] E2E: prompt→preview→apply→node syns
- [ ] Svensk microcopy, tangentbordsflöde, premium-känsla

## Nuvarande status (det vi kan bekräfta i repo)
- [x] Next.js + TypeScript + Tailwind + shadcn/ui på plats
- [x] Board-sida med canvas + chatt (`src/app/board/[id]/page.tsx`)
- [x] React Flow canvas (`@xyflow/react`)
- [x] Yjs + Hocuspocus provider i klient (`CollaborativeCanvas`)
- [x] Hocuspocus server (`scripts/server.js`) med valfri Supabase-persistens
- [x] AI API-route (`src/app/api/ai/route.ts`) med schema-validerat svar + mock-mode utan API-nyckel
- [x] Apply av events skriver till store/Yjs (ChatPanel → `useBoardStore`)
- [ ] Manuell verifiering: två flikar synkar node-drag/edge inom rimlig latency

## Miro-funktionskarta (kravspec) → status i Antigravity + prompt-first mapping
Nyckel:
- **Status**: Har / Delvis / Saknas
- **Leverans**: UI = klassiska verktyg, AI = prompt ersätter UI, Hybrid = båda
- **Nivå**: MVP / MVP+ / Senare

### A. Grundverktyg på whiteboarden
- **Sticky notes**
  - **Status**: Har (Note-node)
  - **Leverans**: Hybrid (UI + prompt “skapa note…”)
  - **Nivå**: MVP
- **Text-verktyg (fria textobjekt)**
  - **Status**: Saknas (vi har “label” på noder, inte separat textobjekt)
  - **Leverans**: Hybrid
  - **Nivå**: MVP+
- **Former (shapes: rektangel/cirkel/diamant)**
  - **Status**: Saknas
  - **Leverans**: UI (och prompt kan skapa)
  - **Nivå**: Senare
- **Pilar/linjer/connectors**
  - **Status**: Har (edges + connect)
  - **Leverans**: Hybrid (drag-connection + prompt “koppla…”)
  - **Nivå**: MVP
- **Pen/freehand drawing**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: Senare (enligt tidigare spec kan vänta)
- **Smart drawing (auto-former)**
  - **Status**: Saknas
  - **Leverans**: AI/Hybrid
  - **Nivå**: Senare
- **Bilder (upload/URL)**
  - **Status**: Saknas
  - **Leverans**: UI/Hybrid
  - **Nivå**: MVP+
- **Embeds (media/iframe/cards)**
  - **Status**: Saknas
  - **Leverans**: UI (med prompt för att skapa)
  - **Nivå**: Senare

#### Canvasnivå
- **Infinite canvas**
  - **Status**: Delvis (React Flow “oändligt” i praktiken, men inga explicita guardrails/UX)
  - **Leverans**: UI
  - **Nivå**: MVP
- **Zoom & Pan**
  - **Status**: Har (React Flow controls)
  - **Leverans**: UI
  - **Nivå**: MVP
- **Grids & guides**
  - **Status**: Saknas (bakgrund finns, men ej guides/snap)
  - **Leverans**: UI
  - **Nivå**: Senare
- **Objekt-låsning**
  - **Status**: Saknas
  - **Leverans**: UI + enforcement i Yjs/events
  - **Nivå**: MVP+
- **Multi-select / multi-drag**
  - **Status**: Delvis (React Flow kan, men ej verifierat/konfigurerat)
  - **Leverans**: UI
  - **Nivå**: MVP+
- **Zoom to selection**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: MVP+

### B. Organisation & struktur
- **Frames/sektioner**
  - **Status**: Delvis (ClusterNode finns, men renderas inte i `Canvas` än)
  - **Leverans**: Hybrid
  - **Nivå**: MVP+
- **Group/Ungroup**
  - **Status**: Saknas
  - **Leverans**: UI/Hybrid
  - **Nivå**: Senare
- **Align/Distribute**
  - **Status**: Saknas
  - **Leverans**: UI + AI kan föreslå auto-layout
  - **Nivå**: Senare
- **Duplicate / copy-paste**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: MVP+
- **Layers (z-order)**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: Senare
- **Templates-bibliotek**
  - **Status**: Saknas
  - **Leverans**: AI (prompt = template) + UI (mallväljare)
  - **Nivå**: Senare
- **Mind maps / maps**
  - **Status**: Saknas
  - **Leverans**: AI/Hybrid
  - **Nivå**: Senare
- **Flowcharts / diagrams**
  - **Status**: Delvis (edges + noder, men inga shape-stencils/diagram UX)
  - **Leverans**: Hybrid
  - **Nivå**: Senare
- **Boards aka Pages (flera sidor per board)**
  - **Status**: Saknas (vi har board per id, men ingen “pages”-modell)
  - **Leverans**: UI
  - **Nivå**: Senare

### C. Samarbete i realtid
- **Realtime collaboration**
  - **Status**: Har (Yjs/Hocuspocus)
  - **Leverans**: System
  - **Nivå**: MVP
- **Presence & live cursors**
  - **Status**: Saknas
  - **Leverans**: System/UI
  - **Nivå**: MVP+
- **Kommentarsläge (pins) + @mentions**
  - **Status**: Saknas
  - **Leverans**: Hybrid (UI + prompt “lägg kommentar på…”)
  - **Nivå**: Senare
- **Reactions/emojis**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: Senare
- **Async collaboration (allt syncas ändå)**
  - **Status**: Har (CRDT), men saknar “activity feed”/notiser
  - **Leverans**: System
  - **Nivå**: MVP+

### D. Facilitation & mötesverktyg
- **Presentation mode**
  - **Status**: Saknas
  - **Leverans**: UI (frames → slides)
  - **Nivå**: Senare
- **Voting / dot-voting**
  - **Status**: Saknas
  - **Leverans**: Hybrid (UI för röster + AI summerar)
  - **Nivå**: Senare
- **Timer**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: Senare
- **Follow / Bring everyone to me**
  - **Status**: Saknas
  - **Leverans**: System/UI
  - **Nivå**: Senare
- **Inbyggd video**
  - **Status**: Saknas
  - **Leverans**: Integration (t.ex. WebRTC/extern)
  - **Nivå**: Senare

### E. AI-baserade verktyg (Miro AI)
- **Auto-clustering av stickies**
  - **Status**: Saknas
  - **Leverans**: AI (skapa Cluster + flytta noder)
  - **Nivå**: MVP+ (stor “wow”-faktor)
- **Summarize board → text/actions**
  - **Status**: Saknas
  - **Leverans**: AI
  - **Nivå**: MVP+
- **Generera diagram från text**
  - **Status**: Delvis (vi kan skapa noder/edges, men saknar diagram-verktyg/shape-typer)
  - **Leverans**: AI/Hybrid
  - **Nivå**: Senare
- **Pre-built AI workflows & suggestions**
  - **Status**: Saknas
  - **Leverans**: AI
  - **Nivå**: Senare

### F. Import / export / integration
#### Import
- **Bilder/video uploads**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: MVP+
- **Foto → stickies (sticky capture)**
  - **Status**: Saknas
  - **Leverans**: AI (vision) + UI
  - **Nivå**: Senare
- **CSV/text → stickies/tasks**
  - **Status**: Saknas
  - **Leverans**: Hybrid (upload + AI/parse)
  - **Nivå**: Senare

#### Export
- **Board → PNG**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: MVP+ (står i tidigare spec)
- **Board → PDF**
  - **Status**: Saknas
  - **Leverans**: UI
  - **Nivå**: Senare
- **Text summary export (AI)**
  - **Status**: Saknas
  - **Leverans**: AI
  - **Nivå**: MVP+

#### Integrations (250+ appar)
- **Slack/Teams/Jira/Asana/Figma/Drive…**
  - **Status**: Saknas
  - **Leverans**: Senare (plattform + OAuth + cards)
  - **Nivå**: Senare

### G. Historik & management
- **Undo/redo**
  - **Status**: Saknas (explicit synkad undo/redo)
  - **Leverans**: System
  - **Nivå**: MVP+
- **Version history / restore**
  - **Status**: Saknas
  - **Leverans**: System + lagring
  - **Nivå**: Senare
- **Activity log / audit**
  - **Status**: Saknas
  - **Leverans**: System
  - **Nivå**: Senare
- **Sharing & permissions (owner/editor/viewer)**
  - **Status**: Saknas
  - **Leverans**: System
  - **Nivå**: MVP+
- **Password-protected boards / guest editors**
  - **Status**: Saknas
  - **Leverans**: System
  - **Nivå**: Senare
- **Enterprise security (SSO, data residency)**
  - **Status**: Saknas
  - **Leverans**: Enterprise
  - **Nivå**: Senare

### H. Presentation & UI-hjälp
- **Shape formatting / text formatting**
  - **Status**: Saknas (förutom styles i node-komponenter)
  - **Leverans**: UI
  - **Nivå**: Senare
- **Emojis/tags på stickies**
  - **Status**: Saknas
  - **Leverans**: UI/Hybrid
  - **Nivå**: Senare
- **Color palettes & themes**
  - **Status**: Delvis (dark mode-styling, men inga paletter/teman)
  - **Leverans**: UI
  - **Nivå**: Senare
- **Dark/light mode**
  - **Status**: Delvis (dark-oriented UI, ej full toggle-dokumentation)
  - **Leverans**: UI
  - **Nivå**: MVP+

## Kodkvalitet – kort bedömning (vad vi bör förbättra)
- **Bra**:
  - Tydlig arkitektur: canvas ↔ store ↔ Yjs-synk och AI-route med schema
  - Mock-mode för AI gör utveckling/test enklare
  - Enkel “walking skeleton” som redan ger end-to-end-flöde
- **Att åtgärda för stabilitet/skalning**:
  - [ ] Hardcodad websocket-URL (`ws://localhost:1234`) bör drivas av env/konfig
  - [ ] `cluster`-node finns men renderas inte (saknas i `nodeTypes` i `Canvas`)
  - [ ] “Discard” i chatten saknar funktion (UI finns men ingen handler)
  - [ ] Många `any`-typer (node payload etc.) → risk för runtime-buggar
  - [ ] Dubbel loggrad i `api/ai/route.ts` (samma error loggas två gånger)
  - [ ] Skilj på “förslag” vs “applicerad state” på canvas (ghost-preview saknas)

## Milstolpar & uppgifter (checkboxar)

### Milstolpe A: Stabil grund (kvalitet + verifiering)
- [ ] Verifiera realtids-synk: öppna två flikar, flytta node, se synk
- [ ] Gör websocket-url konfigurerbar (env) och dokumentera i README/script
- [ ] Lägg till `cluster` i `nodeTypes` så ClusterNode kan renderas korrekt
- [ ] Implementera “Discard”-knapp i chatten (markera förslaget som discard/ta bort)
- [ ] Rensa småbuggar: dubbellogg, enklare typstädning där det ger mycket värde

### Milstolpe B: Prompt-first “Proposal Mode” på canvas (ghost-preview)
- [ ] Modellera “proposal state” separat från Yjs-state (lokalt, ej synkat)
- [ ] Rendera ghost-noder/ghost-edges i canvas (streckad/transparent styling)
- [ ] Apply: flytta proposal → commit till Yjs
- [ ] Discard: rensa proposal state utan att påverka Yjs
- [ ] UI: visa diff (antal noder/edges) + highlight på canvas

### Milstolpe C: Node-typer (Action/Decision/Cluster) blir “riktiga”
- [ ] Uppdatera schema så Decision kan ha `context/selectedOption` och Action `deadline`
- [ ] Säkerställ att AI-event payload matchar Node-komponenternas förväntade `data`
- [ ] Regler för edge-id/unikhet (undvik krockar vid multiuser)

### Milstolpe D: Persistens & rättigheter (MVP+)
- [ ] Dokumentera Supabase-tabell/kolumner och env-krav för servern
- [ ] Grundläggande auth/roller (Owner/Editor/Viewer) + enforcement i AI-actions
- [ ] Snapshot/export (PNG) när core-flödet är stabilt

### Milstolpe E: “Miro core” UX (utan full paritet)
- [ ] Multi-select / multi-drag verifierat och testat
- [ ] Lock/unlock objekt + enforcement i events/Yjs
- [ ] Copy/paste + duplicate för noder/frames
- [ ] Zoom-to-selection + snabb “find on board”

### Milstolpe F: Facilitation (workshops)
- [ ] Voting/dot-voting (UI) + AI-summering (“top 3”)
- [ ] Timer + timeboxing-kommandon via prompt
- [ ] Presentation mode (frames → slides) + “follow me”

### Milstolpe G: Miro-AI-liknande värde (där vi kan vinna)
- [ ] Auto-cluster stickies till teman (AI skapar clusters + flyttar)
- [ ] Summarize board → decisions/actions (AI) + export som text
- [ ] Diagram från prompt (AI genererar noder/edges med layout)

### Milstolpe H: Import/export/integrationer
- [ ] Bild-node: upload/URL + render på canvas
- [ ] Export PNG (och PDF senare)
- [ ] “Cards/Embeds”-ramverk (länk→preview) som grund för integrationer
- [ ] Integrations backlog (Slack/Teams/Jira/Asana/Figma/Drive) – kravspec + prioritering

## Kvalitetskrav (Definition of Done)
- [ ] Inga TypeScript-fel i relevanta kärnflöden (board events, store, canvas)
- [ ] E2E: smoke test + ett test som skapar node via chatten (mock-mode räcker)
- [ ] Manuell: 2-fliksynk fungerar, Apply/Discard fungerar deterministiskt

## Körinstruktion (lokalt)
- App:
  - `npm run dev`
- Realtidsserver:
  - `npm run dev:yjs` (Hocuspocus på port 1234 som default)

