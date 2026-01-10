'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const ClusterNode = memo(({ data, selected }: { data: any, selected?: boolean }) => {
    return (
        <>
            {/* Transparent handles for connections */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <div className={`relative group transition-all duration-200 ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wider font-bold rounded shadow-sm border z-10">
                    Cluster
                </div>
                <div
                    className="min-w-[400px] min-h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 flex flex-col"
                    style={{
                        backgroundColor: data.color ? `${data.color}20` : undefined,
                        borderColor: data.color || undefined
                    }}
                >
                    <div className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">
                        {data.label}
                    </div>
                    {/* Content area that visually groups items beneath it */}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </>
    );
});

ClusterNode.displayName = 'ClusterNode';
export default ClusterNode;
