'use client';

import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { memo } from 'react';

const NoteNode = memo(({ data }: { data: any }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
            <Card className="min-w-[200px] shadow-sm bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardHeader className="p-3 pb-0">
                    <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-500 uppercase">Note</div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="text-sm">{data.label}</div>
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </>
    );
});

NoteNode.displayName = 'NoteNode';
export default NoteNode;
