import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: 'bg-gray-100 text-gray-800',
  todo: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

// Mock data - in a real app, this would come from an API
const tasks: Task[] = [
  {
    id: 'TASK-1',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication with refresh tokens',
    status: 'in_progress',
    priority: 'high',
    type: 'feature',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '/avatars/alex.jpg',
    },
    reporter: {
      id: '2',
      name: 'Sarah Kim',
      email: 'sarah@example.com',
    },
    dueDate: '2023-12-15',
    estimatedHours: 8,
    timeSpent: 4,
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2023-11-25T14:30:00Z',
    labels: ['authentication', 'security', 'backend'],
    project: {
      id: 'p1',
      name: 'Platform',
      color: '#3b82f6',
    },
    subtasks: [
      { id: 'sub1', title: 'Set up JWT', completed: true, createdAt: '2023-11-20T10:00:00Z', updatedAt: '2023-11-22T09:30:00Z' },
      { id: 'sub2', title: 'Implement refresh tokens', completed: true, createdAt: '2023-11-20T10:00:00Z', updatedAt: '2023-11-24T11:15:00Z' },
      { id: 'sub3', title: 'Write unit tests', completed: false, createdAt: '2023-11-20T10:00:00Z', updatedAt: '2023-11-20T10:00:00Z' },
    ],
    comments: [],
    attachments: [],
    relatedTasks: [],
    storyPoints: 5,
    tags: []
  },
  // More tasks...
];

interface TaskListProps {
  assignedToMe?: boolean;
}

export function TaskList({ assignedToMe = false }: TaskListProps) {
  // In a real app, this would come from your authentication context
  const currentUserId = '1'; // Replace with actual user ID from auth context
  
  // Filter tasks based on assignedToMe prop
  const filteredTasks = assignedToMe 
    ? tasks.filter(task => task.assignee?.id === currentUserId)
    : tasks;
    
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead className="w-[300px]">
              <Button variant="ghost" className="p-0">
                Task
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
{filteredTasks.length === 0 ? (
            <TableRow key="no-tasks">
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {assignedToMe 
                  ? "You don't have any assigned tasks yet."
                  : "No tasks found."
                }
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
            <TableRow key={task.id} className="group hover:bg-muted/50">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-muted-foreground">{task.id}</span>
                  <span className="truncate">{task.title}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.project.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[task.status]}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      {task.assignee.avatar && (
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      )}
                      <AvatarFallback>
                        {task.assignee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {task.dueDate ? (
                    <time dateTime={task.dueDate}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </time>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">42</span> tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
