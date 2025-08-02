"use client";

import { TaskList } from '@/components/TasksComponent/list/TaskList';
import { TaskFilters } from '@/components/TasksComponent/shared/TaskFilters';
import { TaskStats } from '@/components/TasksComponent/stats/TaskStats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            View and manage tasks assigned to you
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskStats />

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TaskFilters />
        </div>

        <TabsContent value="list" className="space-y-4">
          <TaskList assignedToMe={true} />
        </TabsContent>
        <TabsContent value="board">
          <div className="flex h-[600px] items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-muted-foreground">Board View (Coming Soon)</p>
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <div className="flex h-[600px] items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-muted-foreground">Calendar View (Coming Soon)</p>
          </div>
        </TabsContent>
        <TabsContent value="timeline">
          <div className="flex h-[600px] items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-muted-foreground">Timeline View (Coming Soon)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
