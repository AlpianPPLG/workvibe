import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export function TeamStats() {
  const stats = [
    {
      title: 'Total Members',
      value: '24',
      icon: Users,
      description: 'Across all departments',
      change: '+12% from last month',
    },
    {
      title: 'Active Now',
      value: '18',
      icon: CheckCircle,
      description: 'Currently working',
      change: '+3 from yesterday',
    },
    {
      title: 'On Leave',
      value: '3',
      icon: Clock,
      description: 'Away from work',
      change: '2 scheduled returns',
    },
    {
      title: 'Inactive',
      value: '3',
      icon: XCircle,
      description: 'Not active',
      change: 'No change',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-start">
              <div className="mr-4 rounded-lg bg-primary/10 p-3 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description} • <span className="text-green-500">{stat.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
