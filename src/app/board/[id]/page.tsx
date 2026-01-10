import { CollaborativeCanvas } from '@/components/canvas/CollaborativeCanvas';
import { ChatPanel } from '@/components/chat/ChatPanel';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="flex-1 h-full relative">
                <CollaborativeCanvas roomId={id} />
                <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border shadow-sm">
                    <h1 className="font-semibold text-sm">Board {id}</h1>
                </div>
            </div>
            <div className="w-[400px] h-full shadow-xl z-20">
                <ChatPanel />
            </div>
        </div>
    );
}
