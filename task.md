# Task List - Prompt-First Collaborative Canvas

## Phase 1: Foundation (Real-time Canvas)
- [x] Setup Next.js, Tailwind, Shadcn/UI project
- [x] Integrate React Flow for basic circular/rectangular nodes
- [x] Setup Yjs and Websocket provider for multiplayer sync
- [ ] verify: Open two tabs, drag node in one, see movement in other

## Phase 2: AI Command Engine
- [x] Build Chat Interface (Right sidebar)
- [x] Define "BoardEvent" Schema (JSON) for AI output
- [x] Implement OpenAI API integration ("Compiler" service)
- [ ] Build "Proposal/Preview" system (Ghost nodes)
- [x] Implement "Apply" logic (Commit changes to Yjs)

## Phase 3: Specialized Nodes & Interactions
- [ ] Create "Action" Node Component (owner, status)
- [ ] Create "Decision" Node Component (distinct styling)
- [ ] Create "Cluster" Node (groups)
- [ ] Implement "Connect" command logic (drawing edges)

## Phase 4: Production MVP
- [ ] Persistent storage (Postgres/Supabase)
- [ ] Basic Authentication & Permissions
- [ ] Export to PNG
- [ ] Final Design Polish (Dark mode aesthetics)
