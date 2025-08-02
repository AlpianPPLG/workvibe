import { Progress } from '@/components/ui/progress';
import { TaskStats as TaskStatsType } from '@/types/task';
import { BarChart4, CheckCircle, Clock, FileText, ListChecks, Users } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const stats: TaskStatsType = {
  total: 124,
  byStatus: {
    backlog: 12,
    todo: 24,
    in_progress: 18,
    in_review: 8,
    done: 58,
    canceled: 4,
  },
  byPriority: {
    low: 34,
    medium: 56,
    high: 24,
    urgent: 10,
  },
  byType: {
    task: 45,
    bug: 23,
    feature: 32,
    improvement: 15,
    story: 8,
    epic: 1,
  },
  byAssignee: [
    { user: { id: '1', name: 'Alex Johnson', email: 'alex@example.com' }, count: 24 },
    { user: { id: '2', name: 'Sarah Kim', email: 'sarah@example.com' }, count: 18 },
    { user: { id: '3', name: 'Jamie Smith', email: 'jamie@example.com' }, count: 15 },
  ],
  byProject: [
    { project: { id: 'p1', name: 'Platform' }, count: 42 },
    { project: { id: 'p2', name: 'Mobile App' }, count: 36 },
    { project: { id: 'p3', name: 'Marketing Site' }, count: 22 },
  ],
  overdue: 8,
  dueThisWeek: 15,
  completedThisWeek: 32,
  createdThisWeek: 18,
};

export function TaskStats() {
  const totalTasks = stats.total;
  const completedPercentage = Math.round((stats.byStatus.done / totalTasks) * 100);
  const inProgressPercentage = Math.round(
    ((stats.byStatus.in_progress + stats.byStatus.in_review) / totalTasks) * 100
  );
  const todoPercentage = Math.round((stats.byStatus.todo / totalTasks) * 100);
  const backlogPercentage = Math.round((stats.byStatus.backlog / totalTasks) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={stats.total.toString()}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description={`${stats.completedThisWeek} completed this week`}
      />
      <StatCard
        title="In Progress"
        value={`${stats.byStatus.in_progress + stats.byStatus.in_review}`}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        description={`${stats.byStatus.in_progress} in progress, ${stats.byStatus.in_review} in review`}
      />
      <StatCard
        title="Completed"
        value={stats.byStatus.done.toString()}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        description={`${stats.completedThisWeek} completed this week`}
      />
      <StatCard
        title="Overdue"
        value={stats.overdue.toString()}
        icon={<ListChecks className="h-4 w-4 text-muted-foreground" />}
        description={`${stats.dueThisWeek} due this week`}
      />

      <div className="col-span-full rounded-lg border p-4">
        <h3 className="mb-4 flex items-center text-sm font-medium">
          <BarChart4 className="mr-2 h-4 w-4" />
          Task Distribution
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Done</span>
              <span className="text-sm text-muted-foreground">
                {stats.byStatus.done} ({completedPercentage}%)
              </span>
            </div>
            <Progress value={completedPercentage} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">In Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats.byStatus.in_progress + stats.byStatus.in_review} ({inProgressPercentage}%)
              </span>
            </div>
            <Progress value={inProgressPercentage} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">To Do</span>
              <span className="text-sm text-muted-foreground">
                {stats.byStatus.todo} ({todoPercentage}%)
              </span>
            </div>
            <Progress value={todoPercentage} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backlog</span>
              <span className="text-sm text-muted-foreground">
                {stats.byStatus.backlog} ({backlogPercentage}%)
              </span>
            </div>
            <Progress value={backlogPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="col-span-full rounded-lg border p-4">
        <h3 className="mb-4 flex items-center text-sm font-medium">
          <Users className="mr-2 h-4 w-4" />
          Tasks by Assignee
        </h3>
        <div className="space-y-4">
          {stats.byAssignee.map((assignee) => {
            const percentage = Math.round((assignee.count / totalTasks) * 100);
            return (
              <div key={assignee.user.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{assignee.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {assignee.count} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
