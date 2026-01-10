'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, SendIcon, Sparkles } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { BoardEvent } from '@/lib/schema';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    events?: BoardEvent[];
    applied?: boolean;
    discarded?: boolean;
};

export function ChatPanel() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Välkommen! Skriv vad du vill göra, t.ex. "Skapa en note om projektbudget".' }
    ]);

    const { nodes, addNode, updateNode, addEdge } = useBoardStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }],
                    boardContext: { nodes }
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply,
                events: data.events
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Något gick fel. Försök igen.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = (msgIndex: number, events: BoardEvent[]) => {
        events.forEach(event => {
            if (event.type === 'CREATE_NODE') {
                addNode(event.payload as any);
            } else if (event.type === 'UPDATE_NODE') {
                const payload = event.payload;
                // Handle type change if present
                if (payload.type) {
                    updateNode(payload.id, { type: payload.type, data: { ...payload.data } });
                } else if (payload.data) {
                    updateNode(payload.id, { data: { ...payload.data } });
                }
            } else if (event.type === 'CREATE_EDGE') {
                addEdge({ ...event.payload, type: 'default' } as any);
            }
        });

        setMessages(prev => prev.map((msg, idx) =>
            idx === msgIndex ? { ...msg, applied: true } : msg
        ));
    };

    const handleDiscard = (msgIndex: number) => {
        setMessages(prev => prev.map((msg, idx) =>
            idx === msgIndex ? { ...msg, discarded: true } : msg
        ));
    };

    return (
        <div className="flex flex-col h-full border-l bg-card">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Team Chat
                </h2>
                <Badge variant="secondary" className="text-xs">
                    {nodes.length} Noder
                </Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                                }`}>
                                {msg.content}
                            </div>

                            {msg.events && msg.events.length > 0 && !msg.applied && !msg.discarded && (
                                <Card className="mt-2 w-[85%] p-3 border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900">
                                    <div className="text-xs font-medium text-purple-800 dark:text-purple-300 mb-2">
                                        Föreslagna ändringar:
                                    </div>
                                    <ul className="list-disc list-inside text-xs text-muted-foreground mb-3 space-y-1">
                                        {msg.events.map((event, i) => (
                                            <li key={i}>{event.description}</li>
                                        ))}
                                    </ul>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-7"
                                            onClick={() => handleApply(idx, msg.events!)}
                                        >
                                            Apply Changes
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs h-7"
                                            onClick={() => handleDiscard(idx)}
                                        >
                                            Discard
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {msg.applied && (
                                <div className="mt-1 text-[10px] text-muted-foreground flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                                    Ändringar applicerade
                                </div>
                            )}

                            {msg.discarded && (
                                <div className="mt-1 text-[10px] text-muted-foreground flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 mr-1" />
                                    Förslag kasserat
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Tänker...
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <form className="flex gap-2" onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="T.ex. Skapa en note..."
                        className="flex-1"
                    />
                    <Button size="icon" type="submit" disabled={isLoading}>
                        <SendIcon className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
