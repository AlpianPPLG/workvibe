import { BaseMember } from './common';
import type { MemberStatus } from './common';

export type MemberRole = 'admin' | 'member' | 'guest';
// Re-export MemberStatus from common
export type { MemberStatus };

export interface Member extends BaseMember {
  id: string;
  name: string;
  email: string;
  nickname?: string;
  role: MemberRole;
  status: MemberStatus;
  position?: string;
  department?: string;
  phone?: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  projects?: number | Array<{ id: string; name: string; role?: string }>;
}
