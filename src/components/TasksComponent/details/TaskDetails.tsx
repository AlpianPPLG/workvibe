'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, TaskPriority, TaskStatus, TaskType } from '@/types/task';
import { TeamMember } from '@/types/team';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Clock, AlertCircle, CheckCircle, Circle, Clock4, Flag, Tag, Calendar, User as UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const priorityIcons = {
  low: <Flag className="h-4 w-4 text-blue-500" />,
  medium: <Flag className="h-4 w-4 text-yellow-500" />,
  high: <Flag className="h-4 w-4 text-orange-500" />,
  urgent: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusIcons = {
  backlog: <Circle className="h-4 w-4 text-gray-500" />,
  todo: <Circle className="h-4 w-4 text-blue-500" />,
  in_progress: <Clock4 className="h-4 w-4 text-yellow-500" />,
  in_review: <Clock4 className="h-4 w-4 text-purple-500" />,
  done: <CheckCircle className="h-4 w-4 text-green-500" />,
  canceled: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  canceled: 'Canceled',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const typeLabels: Record<TaskType, string> = {
  task: 'Task',
  bug: 'Bug',
  feature: 'Feature',
  improvement: 'Improvement',
  story: 'User Story',
  epic: 'Epic',
};

type TaskDetailsProps = {
  task: Task;
  onEdit: () => void;
  members: TeamMember[];
};

export function TaskDetails({ task, onEdit, members }: TaskDetailsProps) {
  const assignee = members.find(member => member.id === task.assignee?.id);
  const reporter = members.find(member => member.id === task.reporter?.id);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
            <Badge variant="outline" className="ml-2">
              {task.id}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created on {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {task.description && (
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-sm whitespace-pre-line">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {statusIcons[task.status]}
                  <span>{statusLabels[task.status]}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority</span>
                <div className="flex items-center gap-2">
                  {priorityIcons[task.priority]}
                  <span>{priorityLabels[task.priority]}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>{typeLabels[task.type]}</span>
                </div>
              </div>
              
              {task.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              )}
              
              {task.estimatedHours && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimate</span>
                  <span>{task.estimatedHours} hours</span>
                </div>
              )}
              
              {task.timeSpent && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Spent</span>
                  <span>{task.timeSpent} hours</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              People
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assignee</p>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {assignee.avatar && <AvatarImage src={assignee.avatar} />}
                      <AvatarFallback>
                        {assignee.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{assignee.name}</p>
                      <p className="text-xs text-muted-foreground">{assignee.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Unassigned</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Reporter</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {reporter?.avatar && <AvatarImage src={reporter.avatar} />}
                    <AvatarFallback>
                      {reporter?.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{reporter?.name}</p>
                    <p className="text-xs text-muted-foreground">{reporter?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {task.labels && task.labels.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Labels</p>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Activity</h3>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Task created on {format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
            {task.updatedAt !== task.createdAt && (
              <p className="mt-1">Last updated on {format(new Date(task.updatedAt), 'MMM d, yyyy')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
