import { StatsCards, TeamPerformanceCards, MemberPerformanceCards } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import {
  TaskStatusChart,
  TaskPriorityChart,
  TeamPerformanceChart,
  MemberEfficiencyChart,
} from "@/components/dashboard/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Plus, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Heres whats happening with your teams today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <TaskStatusChart />
        <TaskPriorityChart />
      </div>

      {/* Team Performance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Team Performance</h3>
          <Button variant="outline" size="sm">
            View All Teams
          </Button>
        </div>
        <TeamPerformanceCards />
      </div>

      {/* Performance Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <TeamPerformanceChart />
        <MemberEfficiencyChart />
      </div>

      {/* Member Performance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Member Performance</h3>
          <Button variant="outline" size="sm">
            View All Members
          </Button>
        </div>
        <MemberPerformanceCards />
      </div>

      {/* Activity Feed and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ActivityFeed />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sprint Planning</p>
                  <p className="text-xs text-muted-foreground">Today, 9:00 AM</p>
                </div>
                <Badge variant="outline">Meeting</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Design Review</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                </div>
                <Badge variant="outline">Review</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Deadline</p>
                  <p className="text-xs text-muted-foreground">Feb 5, 11:59 PM</p>
                </div>
                <Badge variant="destructive">Deadline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-sm font-medium">12 tasks completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Velocity</span>
                <span className="text-sm font-medium">+15% from last week</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">On-time Delivery</span>
                <span className="text-sm font-medium">87%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
