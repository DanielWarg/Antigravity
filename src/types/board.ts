export type NodeType = 'note' | 'decision' | 'action' | 'cluster';

export interface NodeData {
    label: string;
    [key: string]: any;
}

export interface Node {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: NodeData;
    width?: number;
    height?: number;
}

export interface Edge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export type BoardEventType =
    | 'CREATE_NODE'
    | 'UPDATE_NODE'
    | 'DELETE_NODE'
    | 'CREATE_EDGE'
    | 'DELETE_EDGE';

export interface BoardEvent {
    type: BoardEventType;
    payload: any;
    description: string; // Human readable description of what this event does
}

export interface CreateNodeEvent extends BoardEvent {
    type: 'CREATE_NODE';
    payload: Node;
}

export interface UpdateNodeEvent extends BoardEvent {
    type: 'UPDATE_NODE';
    payload: {
        id: string;
        data?: Partial<NodeData>;
        position?: { x: number; y: number };
        type?: NodeType;
    };
}

export interface CreateEdgeEvent extends BoardEvent {
    type: 'CREATE_EDGE';
    payload: Edge;
}

export type BoardEventResponse = {
    events: BoardEvent[];
    reply: string; // Text reply to the user
};
