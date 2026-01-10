import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Antigravity</h1>
            <p className="text-muted-foreground">Prompt-first collaborative canvas.</p>
          </div>
          <Button asChild>
            <Link href={`/board/${Date.now()}`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Board
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-dashed border-2 flex items-center justify-center p-8">
            <Link href={`/board/${Date.now()}`} className="flex flex-col items-center text-muted-foreground hover:text-foreground">
              <PlusIcon className="h-8 w-8 mb-2" />
              <span className="font-medium">Create New Board</span>
            </Link>
          </Card>

          <Link href="/board/demo-board">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <LayoutGridIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
                <CardTitle className="mt-2 text-lg">Demo Board</CardTitle>
                <CardDescription>A playground to test AI actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-background" />
                  <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-background" />
                  <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-background" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
