import { z } from 'zod';

export const BoardEventSchema = z.object({
    reply: z.string().describe('A helpful text reply to the user explaining what you did or asking for clarification.'),
    events: z.array(
        z.object({
            type: z.enum(['CREATE_NODE', 'UPDATE_NODE', 'CREATE_EDGE']),
            description: z.string(),
            payload: z.object({
                id: z.string(),
                // Node props
                type: z.enum(['note', 'decision', 'action', 'cluster']).nullable(),
                position: z.object({ x: z.number(), y: z.number() }).nullable(),
                data: z.object({
                    label: z.string().nullable(),
                    color: z.string().nullable(),
                    owner: z.string().nullable(),
                    status: z.string().nullable(),
                }).nullable(),
                // Edge props
                source: z.string().nullable(),
                target: z.string().nullable(),
                label: z.string().nullable(),
            }),
        })
    ).describe('List of changes to apply to the board'),
});

export type BoardEventResponse = z.infer<typeof BoardEventSchema>;
export type BoardEvent = BoardEventResponse['events'][number];
