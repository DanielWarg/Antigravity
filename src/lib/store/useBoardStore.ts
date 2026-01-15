import { create } from 'zustand';
import * as Y from 'yjs';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import { handleLocalNodeChange, handleLocalEdgeChange, handleLocalConnect } from '@/lib/yjs-sync';

type BoardState = {
    nodes: Node[];
    edges: Edge[];
    yDoc: Y.Doc | null;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    addEdge: (edge: Edge) => void;
    updateNode: (id: string, data: any) => void;
    setYDoc: (doc: Y.Doc | null) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
    nodes: [],
    edges: [],
    yDoc: null,
    setYDoc: (yDoc) => set({ yDoc }),

    onNodesChange: (changes: NodeChange[]) => {
        const { nodes, yDoc } = get();
        const nextNodes = applyNodeChanges(changes, nodes);
        set({ nodes: nextNodes });

        if (yDoc) {
            yDoc.transact(() => {
                handleLocalNodeChange(yDoc, changes, nodes);
            }, 'local');
        }
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        const { edges, yDoc } = get();
        set({
            edges: applyEdgeChanges(changes, edges),
        });

        if (yDoc) {
            yDoc.transact(() => {
                handleLocalEdgeChange(yDoc, changes);
            }, 'local');
        }
    },

    onConnect: (connection: Connection) => {
        const { edges, yDoc } = get();
        set({
            edges: addEdge(connection, edges),
        });

        if (yDoc) {
            yDoc.transact(() => {
                handleLocalConnect(yDoc, connection);
            }, 'local');
        }
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    addNode: (node) => {
        const { nodes, yDoc } = get();
        set({ nodes: [...nodes, node] });

        if (yDoc) {
            yDoc.transact(() => {
                const yNodes = yDoc.getMap('nodes');
                yNodes.set(node.id, node);
            }, 'local');
        }
    },

    addEdge: (edge) => {
        const { edges, yDoc } = get();
        set({ edges: [...edges, edge] });

        if (yDoc) {
            yDoc.transact(() => {
                const yEdges = yDoc.getMap('edges');
                yEdges.set(edge.id, edge);
            }, 'local');
        }
    },

    updateNode: (id, data) => {
        const { nodes, yDoc } = get();
        const nextNodes = nodes.map((node) =>
            node.id === id ? { ...node, ...data } : node
        );
        set({ nodes: nextNodes });

        if (yDoc) {
            const node = nextNodes.find(n => n.id === id);
            if (node) {
                yDoc.transact(() => {
                    const yNodes = yDoc.getMap('nodes');
                    yNodes.set(id, node);
                }, 'local');
            }
        }
    },
}));
