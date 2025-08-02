'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TeamHeader } from '@/components/TeamComponent/TeamHeader';
import { TeamGrid } from '@/components/TeamComponent/TeamGrid';
import { TeamStats } from '@/components/TeamComponent/TeamStats';
import { TeamActivity } from '@/components/TeamComponent/TeamActivity';
import { Member } from '@/types/member';
import { InviteMemberForm } from '@/components/MembersComponent/InviteMemberForm';
import { MemberProfile } from '@/components/MembersComponent/MemberProfile';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Import types from the codebase
import type { TeamMember as TeamMemberType } from '@/types/team';
import type { MemberStatus, MemberRole } from '@/types/member';

// Local TeamMember type that matches the expected shape for this component
interface TeamMember extends Omit<Member, 'projects' | 'skills' | 'avatar'> {
  projects: Array<{ id: string; name: string; role: string }>;
  skills: string[];
  avatar: string;
  status: MemberStatus;
  role: MemberRole;
  position?: string;
  department?: string;
  phone?: string;
  joinDate: string;
  lastActive: string;
  bio?: string;
}

// Convert Member to TeamMember format for the Teams page
const toTeamMember = (member: Member): TeamMember => {
  let projects: Array<{ id: string; name: string; role: string }> = [];
  
  // Handle different possible types of member.projects
  if (Array.isArray(member.projects)) {
    // If it's already an array, use it directly
    projects = member.projects as Array<{ id: string; name: string; role: string }>;
  } else if (typeof member.projects === 'number') {
    // If it's a number, create a default project
    projects = [{
      id: '1',
      name: `Project ${member.projects}`,
      role: 'Team Member'
    }];
  }
  
  // Use nickname if available, otherwise fall back to name
  const displayName = member.nickname || member.name;
  const avatar = member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
  
  return {
    ...member,
    name: displayName, // Use nickname here if available
    skills: member.skills || [],
    projects: projects,
    avatar: avatar,
    position: member.position || '',
    department: member.department || '',
    phone: member.phone || '',
    joinDate: member.joinDate || new Date().toISOString(),
    lastActive: member.lastActive || new Date().toISOString(),
    bio: member.bio || '',
  };
};

// Default team members data
const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'admin',
    status: 'active',
    position: 'Project Manager',
    department: 'Management',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15T00:00:00Z',
    lastActive: new Date().toISOString(),
    avatar: '/avatars/alex.jpg',
    bio: 'Experienced project manager with 8+ years in the industry.',
    skills: ['Project Management', 'Agile', 'Scrum'],
    projects: [
      { id: '1', name: 'Project Alpha', role: 'Project Manager' },
      { id: '2', name: 'Project Beta', role: 'Lead' },
      { id: '3', name: 'Project Gamma', role: 'Manager' },
      { id: '4', name: 'Project Delta', role: 'Coordinator' },
      { id: '5', name: 'Project Epsilon', role: 'Supervisor' }
    ],
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'member',
    status: 'active',
    position: 'Frontend Developer',
    department: 'Engineering',
    phone: '+1 (555) 987-6543',
    joinDate: '2023-03-22T00:00:00Z',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    avatar: '/avatars/sarah.jpg',
    skills: ['React', 'TypeScript', 'Next.js'],
    projects: [
      { id: '1', name: 'Project Alpha', role: 'Frontend Lead' },
      { id: '2', name: 'Project Beta', role: 'UI Developer' },
      { id: '6', name: 'Project Zeta', role: 'React Developer' }
    ],
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'guest',
    status: 'inactive',
    position: 'UX Designer',
    department: 'Design',
    phone: '+1 (555) 456-7890',
    joinDate: '2023-02-10T00:00:00Z',
    lastActive: new Date(Date.now() - 604800000).toISOString(),
    avatar: '/avatars/michael.jpg',
    bio: 'Passionate about creating intuitive user experiences.',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    projects: [
      { id: '3', name: 'Project Gamma', role: 'UX Designer' },
      { id: '7', name: 'Project Eta', role: 'UI/UX Specialist' }
    ],
  },
];

export default function TeamsPage() {
  const router = useRouter();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [filters, setFilters] = useState<{
    status?: string[];
    role?: string[];
    search?: string;
  }>({});
  
  // Use the shared team members hook
  const { teamMembers, addMember } = useTeamMembers();
  
  // Convert members to team members format
  const allTeamMembers = teamMembers.length > 0 
    ? teamMembers.map(toTeamMember) 
    : defaultTeamMembers;

  // Filter team members based on active filters
  const filteredMembers = allTeamMembers.filter((member) => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(member.status)) {
      return false;
    }
    if (filters.role && filters.role.length > 0 && !filters.role.includes(member.role)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        (member.position?.toLowerCase().includes(searchLower) ?? false) ||
        (member.department?.toLowerCase().includes(searchLower) ?? false) ||
        member.skills.some((skill) => skill.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const handleFilterChange = (newFilters: {
    status?: string[];
    role?: string[];
    search?: string;
  }) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Handle member invitation
  const handleInvite = async (values: { email: string; role: MemberRole }) => {
    try {
      // Add the new member through our shared hook
      // The addMember function will handle nickname generation and other defaults
      await addMember({
        name: values.email.split('@')[0],
        email: values.email,
        role: values.role,
        status: 'invited',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        projects: [],
        skills: [],
        bio: '',
        phone: '',
        position: '',
        department: '',
      });
      
      setIsInviteDialogOpen(false);
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to send invitation');
    }
  };

  // Handle member view
  const handleViewMember = (member: TeamMemberType) => {
    // Check for required fields
    if (!member.id || !member.name || !member.email || !member.role || !member.status) {
      console.error('Required member information is missing');
      toast.error('Cannot view member: Required information is missing');
      return;
    }

    // Convert to Member format first
    const memberForProfile: Member = {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      position: member.position || '',
      department: member.department || '',
      phone: member.phone || '',
      joinDate: member.joinDate || new Date().toISOString(),
      lastActive: member.lastActive || new Date().toISOString(),
      avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`,
      bio: member.bio || '',
      skills: member.skills || [],
      projects: member.projects // This will be a number in TeamMemberType
    };
    
    // Convert to TeamMember using the existing helper function
    const teamMember = toTeamMember(memberForProfile);
    setSelectedMember(teamMember);
  };

  // Save team members to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamMembers', JSON.stringify(allTeamMembers));
    }
  }, [allTeamMembers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamHeader 
        onInviteClick={() => setIsInviteDialogOpen(true)}
        onAddMembersClick={() => router.push('/members?addMember=true')}
        onFilterChange={handleFilterChange}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TeamGrid 
            members={filteredMembers.map(m => ({
              ...m,
              // Ensure all required TeamMemberType fields are present
              projects: m.projects || 0,
              skills: m.skills || [],
              avatar: m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`
            })) as TeamMemberType[]} 
            onViewProfile={handleViewMember} 
          />
        </div>
        <div className="space-y-6">
          <TeamStats />
          <TeamActivity />
        </div>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your team. Theyll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          <InviteMemberForm
            existingMembers={allTeamMembers}
            onSubmit={handleInvite}
            onCancel={() => setIsInviteDialogOpen(false)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>

      {/* Member Profile Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMember && (
            <MemberProfile 
              member={{
                ...selectedMember,
                status: selectedMember.status as 'active' | 'inactive' | 'invited',
                joinDate: selectedMember.joinDate || new Date().toISOString(),
                bio: selectedMember.bio || 'No bio available',
                position: selectedMember.role,
                phone: selectedMember.phone || 'Not specified',
                skills: selectedMember.skills || [],
                projects: selectedMember.projects || []
              }} 
              onClose={() => setSelectedMember(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
