'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

type MyTasksHeaderProps = {
  onAddTask: () => void;
  onSearch: (query: string) => void;
};

export function MyTasksHeader({ onAddTask, onSearch }: MyTasksHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-auto">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">Manage your assigned tasks</p>
      </div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 w-full md:w-[300px]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button className="gap-2" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
}
