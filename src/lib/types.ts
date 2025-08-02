export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: "admin" | "manager" | "member"
    department: string
    joinDate: string
    status: "active" | "inactive" | "pending"
    skills: string[]
    phone?: string
    location?: string
  }
  
  export interface Team {
    id: string
    name: string
    description: string
    color: string
    leaderId: string
    memberIds: string[]
    createdAt: string
    status: "active" | "inactive"
    department: string
    budget?: number
    goals: string[]
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    status: "todo" | "in-progress" | "review" | "done"
    priority: "low" | "medium" | "high" | "urgent"
    assigneeId: string
    teamId: string
    createdBy: string
    createdAt: string
    dueDate: string
    estimatedHours?: number
    actualHours?: number
    tags: string[]
    attachments: string[]
    progress: number
  }
  
  export interface Comment {
    id: string
    taskId: string
    userId: string
    content: string
    createdAt: string
    updatedAt?: string
    mentions: string[]
    attachments: string[]
  }
  
  export interface Activity {
    id: string
    type: "task_created" | "task_updated" | "task_completed" | "member_added" | "team_created" | "comment_added"
    userId: string
    targetId: string
    targetType: "task" | "team" | "user"
    description: string
    createdAt: string
    metadata?: Record<string, never>
  }
  
  export interface CalendarEvent {
    id: string
    title: string
    description?: string
    startDate: string
    endDate: string
    type: "meeting" | "deadline" | "milestone" | "review"
    attendeeIds: string[]
    teamId?: string
    location?: string
    isRecurring: boolean
    recurrenceRule?: string
  }
  
  export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    type: "info" | "warning" | "error" | "success"
    isRead: boolean
    createdAt: string
    actionUrl?: string
  }
  
  export interface DashboardStats {
    totalTeams: number
    totalMembers: number
    activeTasks: number
    completedTasks: number
    overdueTasks: number
    teamPerformance: Array<{
      teamId: string
      teamName: string
      completionRate: number
      activeTasks: number
    }>
    memberPerformance: Array<{
      userId: string
      userName: string
      completedTasks: number
      activeTasks: number
      efficiency: number
    }>
    tasksByStatus: Array<{
      status: string
      count: number
    }>
    tasksByPriority: Array<{
      priority: string
      count: number
    }>
  }
  