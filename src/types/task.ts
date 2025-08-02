export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'canceled';
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement' | 'story' | 'epic';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadedAt: string;
  uploadedBy: User;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  tags: string[];
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignee?: User;
  reporter: User;
  dueDate?: string;
  estimatedHours?: number;
  timeSpent?: number;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  project: {
    id: string;
    name: string;
    color: string;
  };
  subtasks: SubTask[];
  comments: Comment[];
  attachments: Attachment[];
  relatedTasks: string[];
  storyPoints?: number;
}

export interface TaskFilter {
  status?: TaskStatus[];
  assignee?: string[];
  priority?: TaskPriority[];
  type?: TaskType[];
  project?: string[];
  label?: string[];
  dueDate?: {
    from?: string;
    to?: string;
  };
  search?: string;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  byType: Record<TaskType, number>;
  byAssignee: Array<{ user: User; count: number }>;
  byProject: Array<{ project: { id: string; name: string }; count: number }>;
  overdue: number;
  dueThisWeek: number;
  completedThisWeek: number;
  createdThisWeek: number;
}
