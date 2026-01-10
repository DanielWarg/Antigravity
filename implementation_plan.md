# Implementation Plan - Prompt-First Collaborative Canvas

## 🎯 Goal
Build a real-time collaborative whiteboard where the canvas state is primarily driven by natural language prompts in a chat interface. The system uses AI to "compile" user intent into structured board events (create note, link nodes, cluster items) which are then synchronized across all users.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Dark mode default for premium feel)
- **Canvas Engine**: React Flow (optimized for node-based graphs)
- **State Management**: Zustand (local UI state)

### Real-time & Collaboration
- **Engine**: Yjs (CRDT for conflict-free replicated data types)
- **Transport**: `y-websocket` (or Hocuspocus for a robust Node.js backend)
- **Features**: Live cursors, presence (avatars), granular item locking

### Backend & AI
- **Runtime**: Node.js (can be Next.js API routes for MVP or separate Fastify server)
- **Database**: PostgreSQL (via Supabase or similar) for persistence, snapshots, and auth.
- **AI Service**: OpenAI API (GPT-4o) using Structured Outputs (JSON Schema) to ensure deterministic board updates.
- **Queue/Events**: In-memory or Redis for rate-limiting AI requests.

## 🧩 Core Components

### 1. The Canvas (Left Panel ~70%)
- **Nodes**:
  - `Note`: Standard sticky note (yellow/various colors)
  - `Decision`: Distinct style (e.g., badge, green border)
  - `Action`: Includes Owner (@mention) and Status (To Do, Done)
  - `Cluster`: Grouping container for nodes
- **Edges**: Connectors with optional labels
- **Interactions**: Drag, zoom, pan, select, rapid click-to-connect

### 2. The Chat "Control Center" (Right Panel ~30%)
- **Input**: Natural language command center.
- **AI "Compiler"**: Translates text -> `BoardEvents`.
- **Proposal UI**: AI suggestions appear as "Ghost" or "Preview" state.
  - User actions: `[Apply]`, `[Discard]`, `[Edit]`
- **History**: Chat log interleaved with system events ("Updated 3 nodes").

## 💾 Data Model (Conceptual)

### CRDT Structure (Y.Doc)
```typescript
interface BoardState {
  nodes: Map<string, NodeData>;
  edges: Map<string, EdgeData>;
  presence: Map<number, UserState>; // cursor x/y, selection
}

type NodeData = {
  id: string;
  type: 'note' | 'decision' | 'action' | 'cluster';
  position: { x: number, y: number };
  content: string;
  metadata?: {
    owner?: string;
    status?: string;
    deadline?: string;
  }
}
```

## 🚀 Phased Implementation Steps

### Phase 1: Foundation (The "Walking Skeleton")
- [x] Initialize Next.js project with TypeScript & Tailwind
- [x] Setup shadcn/ui
- [x] Implement basic React Flow canvas (drag/drop nodes)
- [x] Setup Yjs + Websocket server for basic real-time node sync

### Phase 2: The "Prompt-First" Engine
- [x] Create Chat UI component
- [x] Implement OpenAI Service for `Text -> BoardEvents`
- [ ] Build "Proposal Mode": AI returns JSON, frontend renders "Ghost Nodes"
- [x] Implement `Apply` action: Ghost Nodes -> Yjs Real Nodes

### Phase 3: Object Types & Polish
- [ ] Create specialized node components (Decision, Action with badges)
- [ ] Implement Clusters/Groups
- [ ] Visual polish: Dark mode, glassmorphism UI, smooth transitions
- [ ] Presence: Cursors and User Avatars

### Phase 4: Persistence & Auth (MVP Complete)
- [ ] Setup View-only / Edit permissions
- [ ] PostgreSQL persistence for boards
- [ ] Export to PNG
- [ ] Deploy

## 🧪 Verification Plan

### Automated Tests
- **Unit Tests**: Test the "AI Compiler" logic (mocked OpenAI) to ensure JSON output maps correctly to Board Events.
- **E2E Tests**: Playwright tests to verify:
  - Two browser windows syncing movement.
  - Chat command "Create note" results in a node appearing on canvas.

### Manual Verification
1. **Multiplayer Test**: Open Board in Incognito window. Move node in Window A, verify movement in Window B (<300ms).
2. **AI Action Test**: Type "Skapa en action: Fixa kaffemaskinen, ägare @Kalle". Verify an Action node appears with correct metadata.
3. **Reset Test**: Refresh page, verify board state persists.
