'use client';

import { Task } from '@/types/task';
import { TaskCard } from '../list/TaskCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type OverdueTasksProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
};

export function OverdueTasks({ tasks, onTaskClick }: OverdueTasksProps) {
  // Filter tasks that are overdue
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'done' && task.status !== 'canceled';
  });

  if (overdueTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Alert variant="default" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No overdue tasks</AlertTitle>
          <AlertDescription>
            Great job! You dont have any overdue tasks right now.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Overdue Tasks</h2>
        <p className="text-muted-foreground">
          {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} past due date
        </p>
      </div>
      
      <div className="space-y-4">
        {overdueTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20"
          />
        ))}
      </div>
    </div>
  );
}
