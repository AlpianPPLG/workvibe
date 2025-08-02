"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { mockDashboardStats } from "@/lib/mock-data"
import { PRIORITY_COLORS, STATUS_COLORS } from "@/lib/constants"

export function TaskStatusChart() {
  const data = mockDashboardStats.tasksByStatus.map((item) => ({
    name: item.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: item.count,
    fill: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
        <CardDescription>Distribution of tasks across different statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: { name: string; percent?: number }) => 
                `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TaskPriorityChart() {
  const data = mockDashboardStats.tasksByPriority.map((item) => ({
    name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    value: item.count,
    fill: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Priority</CardTitle>
        <CardDescription>Task distribution based on priority levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TeamPerformanceChart() {
  const data = mockDashboardStats.teamPerformance.map((team) => ({
    name: team.teamName.replace(" Team", ""),
    completion: team.completionRate,
    active: team.activeTasks,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Completion rates and active tasks by team</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="completion" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function MemberEfficiencyChart() {
  const data = mockDashboardStats.memberPerformance.map((member) => ({
    name: member.userName.split(" ")[0], // First name only
    efficiency: member.efficiency,
    completed: member.completedTasks,
    active: member.activeTasks,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Efficiency</CardTitle>
        <CardDescription>Individual performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
