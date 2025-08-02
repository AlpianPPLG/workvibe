import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  className?: string;
};

export function TaskCard({ task, onClick, className = '' }: TaskCardProps) {
  return (
    <Card 
      className={`mb-4 cursor-pointer hover:bg-accent/50 transition-colors ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          {task.priority && (
            <Badge 
              variant={
                task.priority === 'high' ? 'destructive' : 
                task.priority === 'medium' ? 'secondary' : 'default'
              }
            >
              {task.priority}
            </Badge>
          )}
        </div>
        {task.dueDate && (
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
