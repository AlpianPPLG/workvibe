import { BaseMember } from './common';

export interface Project {
  id: string;
  name: string;
  role: string;
}

export interface TeamMember extends BaseMember {
  position: string | undefined;
  avatar: string;
  skills: string[];
  projects: Project[];  // Changed from number to Project[]
  joinDate?: string;
  bio?: string;
  department?: string;
  location?: string;
  phone?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface TeamActivity {
  id: string;
  type: 'project_update' | 'new_member' | 'milestone' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar: string;
  };
  project?: {
    name: string;
    id: string;
  };
}
