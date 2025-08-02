export const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    MEMBER: "member",
  } as const
  
  export const TASK_STATUS = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    REVIEW: "review",
    DONE: "done",
  } as const
  
  export const TASK_PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent",
  } as const
  
  export const ACTIVITY_TYPES = {
    TASK_CREATED: "task_created",
    TASK_UPDATED: "task_updated",
    TASK_COMPLETED: "task_completed",
    MEMBER_ADDED: "member_added",
    TEAM_CREATED: "team_created",
    COMMENT_ADDED: "comment_added",
  } as const
  
  export const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR", "Finance", "Operations"]
  
  export const SKILLS = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Design",
    "UI/UX",
    "Project Management",
    "Data Analysis",
    "Marketing",
    "Sales",
    "Leadership",
    "Communication",
  ]
  
  export const TEAM_COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#84CC16", // Lime
  ]
  
  export const PRIORITY_COLORS = {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#F97316",
    urgent: "#EF4444",
  }
  
  export const STATUS_COLORS = {
    todo: "#6B7280",
    "in-progress": "#3B82F6",
    review: "#F59E0B",
    done: "#10B981",
  }
  