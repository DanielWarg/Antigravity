'use client';

import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { Canvas } from './Canvas';

export function CollaborativeCanvas({ roomId }: { roomId: string }) {
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, setYDoc } = useBoardStore();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const doc = new Y.Doc();
        setYDoc(doc);

        const wsUrl =
            process.env.NEXT_PUBLIC_YJS_URL ||
            process.env.NEXT_PUBLIC_HOCUSPOCUS_URL ||
            'ws://localhost:1234';

        const provider = new HocuspocusProvider({
            url: wsUrl,
            name: roomId,
            document: doc,
            onConnect() {
                console.log('📡 Hocuspocus: Connected');
                setIsConnected(true);
            },
            onDisconnect() {
                console.log('📡 Hocuspocus: Disconnected');
                setIsConnected(false);
            },
            onSynced() {
                console.log('📡 Hocuspocus: Synced');
                const yNodes = doc.getMap('nodes');
                const yEdges = doc.getMap('edges');
                const initialNodes = Array.from(yNodes.values()) as any[];
                const initialEdges = Array.from(yEdges.values()) as any[];

                if (initialNodes.length > 0) setNodes(initialNodes);
                if (initialEdges.length > 0) setEdges(initialEdges);
            },
            onStatus({ status }) {
                console.log(`📡 Hocuspocus Status: ${status}`);
            }
        });

        providerRef.current = provider;

        const yNodes = doc.getMap('nodes');

        // Sync remote updates
        doc.on('update', (update, origin) => {
            if (origin !== 'local' && origin !== provider) {
                const newNodes = Array.from(yNodes.values()) as any[];
                const newEdges = Array.from(doc.getMap('edges').values()) as any[];
                setNodes(newNodes);
                setEdges(newEdges);
            }
        });

        return () => {
            provider.destroy();
            doc.destroy();
            setYDoc(null);
            providerRef.current = null;
        };
    }, [roomId, setNodes, setEdges, setYDoc]);

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-2 right-2 z-50 text-xs bg-background/80 backdrop-blur p-2 rounded shadow border">
                {isConnected ? '🟢 Live' : '🔴 Offline'}
            </div>
            <Canvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            />
        </div>
    );
}
