// Common types that can be used across different parts of the application
export type MemberStatus = 'active' | 'inactive' | 'invited' | 'away' | 'on leave';

export interface BaseMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'guest'; // Using inline type since MemberRole is defined in member.ts
  status: MemberStatus;
  avatar?: string;
  lastActive: string;
}
