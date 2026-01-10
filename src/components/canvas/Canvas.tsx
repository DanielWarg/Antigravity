'use client';

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    NodeTypes,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';

import NoteNode from './nodes/NoteNode';
import DecisionNode from './nodes/DecisionNode';
import ActionNode from './nodes/ActionNode';
import ClusterNode from './nodes/ClusterNode';

interface CanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}

export function Canvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: CanvasProps) {

    const nodeTypes = useMemo<NodeTypes>(() => ({
        note: NoteNode,
        decision: DecisionNode,
        action: ActionNode,
        cluster: ClusterNode,
    }), []);

    return (
        <div className="w-full h-full bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
