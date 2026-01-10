'use client';

import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GavelIcon } from 'lucide-react';
import { memo } from 'react';

const DecisionNode = memo(({ data }: { data: any }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-primary" />
            <Card className="min-w-[240px] shadow-md border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
                <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
                        <GavelIcon className="w-3 h-3 mr-1" />
                        Decision
                    </Badge>
                    <div className="text-xs text-muted-foreground">{data.date || new Date().toLocaleDateString()}</div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="text-sm font-medium">{data.label}</div>
                    {data.context && (
                        <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                            <strong>Context:</strong> {data.context}
                        </div>
                    )}
                    {data.selectedOption && (
                        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/40 rounded text-xs">
                            <strong className="text-green-700 dark:text-green-300">Valt:</strong> {data.selectedOption}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-primary" />
        </>
    );
});

DecisionNode.displayName = 'DecisionNode';
export default DecisionNode;
