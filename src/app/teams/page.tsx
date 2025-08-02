'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Pagination } from '@/components/ui/pagination';

// Import types from the codebase
import type { TeamMember } from '@/types/team';
import type { MemberRole } from '@/types/member';

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

export default function TeamsPage() {
  const router = useRouter();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { members: allMembers, addInvitedMember } = useTeamMembers();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid
  
  // Filter and paginate members
  const filteredMembers = allMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers
    .map(toTeamMember)
    .slice(startIndex, startIndex + itemsPerPage);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle member invitation - only shows in Teams page
  const handleInvite = async (values: { email: string; role: MemberRole }) => {
    try {
      // Add the invited member through our shared hook
      // This will only appear in Teams page, not Members page
      await addInvitedMember({
        name: values.email.split('@')[0],
        email: values.email,
        role: values.role,
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
  const handleViewMember = (member: TeamMember) => {
    // Check for required fields
    if (!member.id || !member.name || !member.email || !member.role || !member.status) {
      console.error('Required member information is missing');
      toast.error('Cannot view member: Required information is missing');
      return;
    }

    setSelectedMember(member);
  };

  // Handle Add Members button click - navigate to Members page with query parameter
  const handleAddMembersClick = useCallback(() => {
    // Navigate to members page with from=teams parameter
    router.push('/members?addMember=true&from=teams');
  }, [router]);

  // Save team members to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamMembers', JSON.stringify(allMembers));
    }
  }, [allMembers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onInviteClick={() => setIsInviteDialogOpen(true)}
        onAddMembersClick={handleAddMembersClick}
      />
      
      {/* Top Section: Team Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 border-b pb-8">
        {/* Team Overview - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4"></h2>
          <div className="border rounded-lg p-4">
            <TeamStats members={filteredMembers} />
          </div>
        </div>
        
        {/* Recent Activity - Takes 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4"></h2>
          <div className="border rounded-lg p-4">
            <TeamActivity />
          </div>
        </div>
      </div>

      {/* Team Grid - Full width below */}
      <div>
        <TeamGrid 
          members={paginatedMembers} 
          onViewProfile={handleViewMember} 
        />
        
        {/* Pagination */}
        {filteredMembers.length > itemsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
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
            existingMembers={allMembers}
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
