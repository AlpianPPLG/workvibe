"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, MessageSquare, UserPlus, FolderPlus, Edit, Clock, GitCommit } from "lucide-react"
import { mockActivities, mockUsers } from "@/lib/mock-data"

const activityIcons = {
  task_created: FolderPlus,
  task_updated: Edit,
  task_completed: CheckCircle,
  member_added: UserPlus,
  team_created: FolderPlus,
  comment_added: MessageSquare,
}

const activityColors = {
  task_created: "text-blue-600",
  task_updated: "text-orange-600",
  task_completed: "text-green-600",
  member_added: "text-purple-600",
  team_created: "text-indigo-600",
  comment_added: "text-gray-600",
}

export function ActivityFeed() {
  const activities = mockActivities.slice(0, 10) // Show latest 10 activities

  const getUserById = (id: string) => {
    return mockUsers.find((user) => user.id === id)
  }

  const formatActivityTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates from your teams and projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const user = getUserById(activity.userId)
              const IconComponent = activityIcons[activity.type]
              const iconColor = activityColors[activity.type]

              return (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-xs">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${iconColor}`} />
                      <p className="text-sm">
                        <span className="font-medium">{user?.name}</span> {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatActivityTime(activity.createdAt)}
                      <Badge variant="outline" className="text-xs">
                        {activity.targetType}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
