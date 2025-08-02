import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TeamActivity } from '@/types/team';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Clock, GitBranch, MessageSquare, PlusCircle, Users } from 'lucide-react';

export function TeamActivity() {
  // Mock activities data
  const activities: TeamActivity[] = [
    {
      id: '1',
      type: 'project_update',
      title: 'Project Alpha Milestone',
      description: 'Completed the dashboard redesign',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      user: {
        name: 'Sarah Kim',
        avatar: '/avatars/sarah.jpg',
      },
      project: {
        name: 'Alpha',
        id: 'p1',
      },
    },
    {
      id: '2',
      type: 'new_member',
      title: 'New Team Member',
      description: 'Alex Chen joined the team',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      user: {
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
      },
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Beta Launch',
      description: 'Successfully launched Beta version',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      project: {
        name: 'Beta',
        id: 'p2',
      },
    },
  ];

  const getActivityIcon = (type: TeamActivity['type']) => {
    switch (type) {
      case 'project_update':
        return <GitBranch className="h-4 w-4 text-blue-500" />;
      case 'new_member':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'milestone':
        return <PlusCircle className="h-4 w-4 text-purple-500" />;
      case 'announcement':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="mr-3 mt-0.5">
              {activity.user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {activity.title}
                  {activity.project && (
                    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                      {activity.project.name}
                    </span>
                  )}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center pt-2">
          <button className="flex items-center text-sm font-medium text-primary hover:underline">
            <Clock className="mr-1 h-4 w-4" />
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
