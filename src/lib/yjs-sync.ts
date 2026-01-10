import * as Y from 'yjs';
import { NodeChange, EdgeChange, Node, Edge, Connection } from '@xyflow/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const syncNodesCheck = (doc: Y.Doc, nodes: Node[]) => {
    // Helper to verify consistency (optional for debug)
};

export const applyYjsUpdatesToStore = (
    doc: Y.Doc,
    setNodes: (n: Node[]) => void,
    setEdges: (e: Edge[]) => void
) => {
    const yNodes = doc.getMap('nodes');
    const yEdges = doc.getMap('edges');

    const nodes = Array.from(yNodes.values()) as Node[];
    const edges = Array.from(yEdges.values()) as Edge[];

    setNodes(nodes);
    setEdges(edges);
};

export const handleLocalNodeChange = (doc: Y.Doc, changes: NodeChange[], currentNodes: Node[]) => {
    const yNodes = doc.getMap('nodes');

    // Apply changes locally to calculate new state (React Flow helper calculates layout)
    // Actually, React Flow changes are typically creating "updates".
    // We need to translate "NodeChange" (e.g. position change) to Yjs Map updates.

    changes.forEach((change) => {
        switch (change.type) {
            case 'position': {
                // update position in yNodes
                if (change.position) {
                    const node = yNodes.get(change.id) as Node;
                    if (node) {
                        yNodes.set(change.id, { ...node, position: change.position });
                    }
                } else if (change.dragging) {
                    // Optimistic update often handled by local store, 
                    // but we should update Yjs on drag end or throttle.
                    // For now, let's update.
                }
                break;
            }
            case 'add': {
                yNodes.set(change.item.id, change.item);
                break;
            }
            case 'remove': {
                yNodes.delete(change.id);
                break;
            }
            case 'select': {
                // Handle selection presence later
                break;
            }
            case 'dimensions': {
                const node = yNodes.get(change.id) as Node;
                if (node && change.dimensions) {
                    yNodes.set(change.id, {
                        ...node,
                        measured: { ...node.measured, ...change.dimensions },
                        width: change.dimensions.width,
                        height: change.dimensions.height
                    });
                }
                break;
            }
        }
    });
};

export const handleLocalEdgeChange = (doc: Y.Doc, changes: EdgeChange[]) => {
    const yEdges = doc.getMap('edges');
    changes.forEach((change) => {
        if (change.type === 'remove') {
            yEdges.delete(change.id);
        }
        // Add/select handling
    });
};

export const handleLocalConnect = (doc: Y.Doc, connection: Connection) => {
    const yEdges = doc.getMap('edges');
    const newEdge = { ...connection, id: `e${connection.source}-${connection.target}`, type: 'default' };
    yEdges.set(newEdge.id, newEdge);
};
