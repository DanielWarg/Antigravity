'use client';

import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, UserCircle } from 'lucide-react';
import { memo } from 'react';

const ActionNode = memo(({ data }: { data: any }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-primary" />
            <Card className="min-w-[240px] shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
                    <Badge variant="secondary" className="text-xs font-normal">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-blue-500" />
                        Action
                    </Badge>
                    {data.status && (
                        <Badge
                            variant={data.status === 'done' ? 'default' : 'secondary'}
                            className={`text-[10px] uppercase font-bold tracking-wider ${data.status === 'done' ? 'bg-green-500 hover:bg-green-600' :
                                    data.status === 'blocked' ? 'bg-red-500 hover:bg-red-600' : ''
                                }`}
                        >
                            {data.status}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-3 pt-2 space-y-2">
                    <div className="text-sm">{data.label}</div>
                    <div className="flex items-center pt-2 border-t mt-2">
                        <UserCircle className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{data.owner || 'Unassigned'}</span>
                        {data.deadline && (
                            <span className={`ml-auto text-xs ${new Date(data.deadline) < new Date() ? 'text-red-500 font-bold' : 'text-muted-foreground'
                                }`}>
                                {data.deadline}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-primary" />
        </>
    );
});

ActionNode.displayName = 'ActionNode';
export default ActionNode;
