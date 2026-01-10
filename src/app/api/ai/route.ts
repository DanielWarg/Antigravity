import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { BoardEventSchema } from '@/lib/schema';

type RateLimitState = { count: number; resetAtMs: number };

function getClientIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(key: string, limitPerMinute: number): { ok: true } | { ok: false; retryAfterSeconds: number } {
    const now = Date.now();
    const windowMs = 60_000;

    const g = globalThis as unknown as { __aiRateLimit?: Map<string, RateLimitState> };
    if (!g.__aiRateLimit) g.__aiRateLimit = new Map();
    const store = g.__aiRateLimit;

    const current = store.get(key);
    if (!current || now >= current.resetAtMs) {
        store.set(key, { count: 1, resetAtMs: now + windowMs });
        return { ok: true };
    }

    if (current.count >= limitPerMinute) {
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAtMs - now) / 1000)) };
    }

    current.count += 1;
    store.set(key, current);
    return { ok: true };
}

export async function POST(req: Request) {
    const limit = Number(process.env.AI_RATE_LIMIT_PER_MINUTE || '30');
    const ip = getClientIp(req);
    const rl = checkRateLimit(`ai:${ip}`, Number.isFinite(limit) ? limit : 30);
    if (!rl.ok) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(rl.retryAfterSeconds),
            },
        });
    }

    const body = await req.json().catch(() => null);
    const messages = body?.messages;
    const boardContext = body?.boardContext;
    const lastMessage = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : '';

    if (!Array.isArray(messages) || typeof lastMessage !== 'string') {
        return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Fallback if no API key is set
    if (!process.env.OPENAI_API_KEY) {
        console.log('No OpenAI API key found, returning mock response for testing.');

        // Simple mock logic for testing without API key
        const mockEvents: any[] = [];
        if (lastMessage.toLowerCase().includes('skapa')) {
            mockEvents.push({
                type: 'CREATE_NODE',
                description: 'Skapar en ny note',
                payload: {
                    id: `node-${Date.now()}`,
                    type: 'note',
                    position: { x: Math.random() * 400, y: Math.random() * 400 },
                    data: { label: lastMessage.replace('skapa', '').trim() || 'Ny notering' }
                }
            });
        }

        const candidate = {
            reply: "OBS: Kör i mock-mode (ingen API-nyckel). Jag hörde att du ville skapa något!",
            events: mockEvents
        };

        const parsed = BoardEventSchema.safeParse(candidate);
        if (!parsed.success) {
            return Response.json({ error: 'Mock response failed schema validation', details: parsed.error.flatten() }, { status: 500 });
        }

        return Response.json(parsed.data);
    }

    try {
        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: BoardEventSchema,
            system: `Du är en AI Board Compiler för en digital whiteboard. 
      Din uppgift är att tolka användarens kommandon (på svenska) och översätta dem till strukturerade BoardEvents.
      
      Nuvarande board context:
      ${JSON.stringify(boardContext?.nodes || [])}
      
      Regler:
      1. **Nodes**:
         - **Note**: För allmän information/idéer. (Gul)
         - **Action**: För uppgifter. MÅSTE ha en 'owner' (om ingen nämns, sätt 'Unassigned') och 'status' (todo/in-progress/done/blocked). Sätt 'deadline' om det nämns. (Blå)
         - **Decision**: För beslut. Kan ha 'context' (bakgrund) och 'selectedOption' (själva beslutet). (Grön)
         - **Cluster**: För att gruppera saker.
      
      2. **Edges**:
         - Om användaren säger "koppla", "visualisera flödet" eller implicerar en relation, skapa ett CREATE_EDGE event.
         - Försök att alltid koppla nya noder till relevanta existerande noder om det verkar logiskt (t.ex. Action kopplas till Beslut).

      3. **Placering**:
         - Placera aldrig noder exakt ovanpå varandra (0,0). 
         - Sprid ut dem. Om du skapar en kedja, placera dem horisontellt eller vertikalt med mellanrum.
         - **Clusters**: Om du skapar ett cluster, gör det stort (t.ex. 400x400). Om du ska placera noder "i" ett cluster, ge dem koordinater som faller inom clustrets area (t.ex. cluster på 0,0 -> noder på 50,50; 50,150).

      4. **Svar**:
         - Håll 'reply' kort, professionellt och coachande.
      `,
            messages: messages,
        });

        // Defensive: validate AI output server-side even if the SDK claims it matches
        const parsed = BoardEventSchema.safeParse(object);
        if (!parsed.success) {
            return Response.json({ error: 'AI response failed schema validation', details: parsed.error.flatten() }, { status: 502 });
        }

        return Response.json(parsed.data);
    } catch (error) {
        console.error('AI Error:', error);
        return Response.json({
            error: 'Failed to process command',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
