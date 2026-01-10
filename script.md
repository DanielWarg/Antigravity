# Prompt-first Collaborative Canvas - Feature Specification

## Vision
**"Tänker högt, prompt först, dokumentation uppstår automatiskt."**
Vi bygger inte en vanlig whiteboard där man klickar för att tänka. Vi bygger en yta där man pratar/skriver med en AI som strukturerar tankarna åt en.

---

## 1. Grundläggande produktfunktioner (måste finnas)

### Canvas (whiteboard-ytan)
* Zoom / pan
* Select, move, resize objekt
* Koppla objekt med linjer (edges)
* Frames / kluster (för teman)
* Stabil auto-layout (flyttar inte runt i onödan)
* Ghost-preview vid AI-förslag (streckad/temporär rendering)

### Objekt (datamodell)
* Note (sticky/text)
* Decision (note + beslut-badge + context + val)
* Action (note + owner + status + ev. deadline)
* Cluster / Frame (gruppering)
* Connector (relation mellan objekt)

## 2. Prompt- & chattbaserad styrning (kärnan)

### Chatt
* Textinput (svenska, naturligt språk)
* Historik per board
* Referens till markerade objekt (“detta”, “de två översta”)
* Systemmeddelanden (AI-förslag, diff-sammanfattning)

### AI-funktioner
* Tolka chatt → strukturerade board-events
* Propose → Apply → Discard (Trygg AI)
* Visa *vad* som ändras innan Apply
* Begränsade, validerade actions (AI får inte göra vad som helst)

### Exempel på stödjande kommandon
* “Gör detta till ett beslut”
* “Skapa en action: … och sätt ägare Anna”
* “Flytta detta till risker”
* “Slå ihop de här två”
* “Koppla denna action till beslutet”
* “Rösta på topp 3” → AI summerar

## 3. Realtids-samarbete (collaboration)
* Flera användare i samma board samtidigt
* Live-synk av canvas (CRDT/Yjs)
* Presence (avatars + färg)
* Multi-cursor
* Synkad undo/redo
* Konflikthantering (deterministisk)

## 4. Board- och teamhantering

### Boards
* Skapa / lista / öppna boards
* Board-titel + metadata
* Share-länk

### Roller & rättigheter
* Owner
* Editor
* Viewer
* AI får bara agera inom användarens rättigheter

## 5. Historik, kontroll och trygghet
* Undo / redo
* Version history
* Replay (visa hur boarden byggdes över tid)
* Event-logg (audit trail)
* Inget AI-auto-delete utan explicit Apply

## 6. Export & output
* Export canvas → PNG
* Export canvas → PDF (V1)
* Export text:
  * Decisions summary
  * Actions list (ägare, status)

## 7. UI / UX-funktioner
* Canvas + chatt sida vid sida
* Collapsible chat
* Dark mode / Light mode (System support)
* Responsiv layout:
  * Desktop: full editor
  * Mobile: view + chat (read-first)

## 8. Säkerhet & stabilitet (måste med från start)
* Autentisering (email magic link eller dylikt)
* Board-permissions
* Rate-limit på AI
* Schema-validering av AI-output
* Deterministiska ID:n
* Inga externa beroenden för core-state (offline-tänk)

---

## Jämförelse & Strategi mot Miro

### Miro Core (Behåll)
* Notes, text, shapes, connectors, frames
* Group/ungroup, lock
* Realtime, presence, comments
* PNG/PDF export

### Optimeringar (Gör bättre/annorlunda)
* **Auto-layout**: AI-styrd istället för begränsad manuell.
* **Mentions**: Ägarskap via prompt (“@Anna äger detta”).
* **Templates**: Prompt = Template ("Skapa en retro...").
* **Historik**: Replay & audit log by design.
* **Sök**: Semantisk sök via AI.

### Skrota/Vänta (Inte MVP)
* Freehand/pen (kan vänta)
* Timers / Voting UI (AI sköter summering)
* Jira/Asana integrationer
* SSO
* Komplexa mallbibliotek

---

## Sammanfattning
**Du behöver:**
> En canvas + en chatt + realtids-sync + en AI-tolk som bara får skapa validerade board-events.