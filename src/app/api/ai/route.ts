import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { BoardEventSchema } from '@/lib/schema';

export async function POST(req: Request) {
    const { messages, boardContext } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Fallback if no API key is set
    if (!process.env.OPENAI_API_KEY) {
        console.log('No OpenAI API key found, returning mock response for testing.');

        // Simple mock logic for testing without API key
        const mockEvents = [];
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

        return Response.json({
            reply: "OBS: Kör i mock-mode (ingen API-nyckel). Jag hörde att du ville skapa något!",
            events: mockEvents
        });
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

        return Response.json(object);
    } catch (error) {
        console.error('AI Error:', error);
        return Response.json({
            error: 'Failed to process command',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
