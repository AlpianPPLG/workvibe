"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FolderKanban, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { mockDashboardStats } from "@/lib/mock-data"

export function StatsCards() {
  const stats = mockDashboardStats

  const cards = [
    {
      title: "Total Teams",
      value: stats.totalTeams,
      description: "Active teams in organization",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      description: "Active members across all teams",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      description: "Tasks currently in progress",
      icon: FolderKanban,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      description: "Tasks completed this month",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      description: "Tasks past their deadline",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Team Efficiency",
      value: "87%",
      description: "Average completion rate",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TeamPerformanceCards() {
  const stats = mockDashboardStats

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.teamPerformance.map((team) => (
        <Card key={team.teamId}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{team.teamName}</CardTitle>
              <Badge variant="secondary">{team.activeTasks} active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completion Rate</span>
                <span className="font-medium">{team.completionRate}%</span>
              </div>
              <Progress value={team.completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function MemberPerformanceCards() {
  const stats = mockDashboardStats

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.memberPerformance.map((member) => (
        <Card key={member.userId}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{member.userName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <Badge variant="outline">{member.completedTasks}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active</span>
              <Badge variant="secondary">{member.activeTasks}</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-medium">{member.efficiency}%</span>
              </div>
              <Progress value={member.efficiency} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
