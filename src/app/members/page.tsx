'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Plus } from 'lucide-react';
import { Member } from '@/types/member';
import { MembersList } from '@/components/MembersComponent/MembersList';
import { MemberForm } from '@/components/MembersComponent/MemberForm';
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
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

// Client component that uses useSearchParams
function MembersPageContent() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { members, addMember, updateMember, deleteMember, addInvitedMember } = useTeamMembers();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);
  
  // Handle search and pagination
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Check URL for addMember query parameter
  useEffect(() => {
    const shouldOpenAddDialog = searchParams.get('addMember') === 'true';
    if (shouldOpenAddDialog) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setIsAddDialogOpen(true);
        // Clean up the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('addMember');
        window.history.replaceState({}, '', url.toString());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleInviteClick = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteMember = async (values: { email: string; role: string }) => {
    setIsSubmitting(true);
    try {
      // Create a new invited member with all required fields
      const email = values.email;
      const name = email.split('@')[0];
      const nickname = name.charAt(0).toUpperCase() + name.slice(1);
      
      await addInvitedMember({
        email,
        role: values.role as 'admin' | 'member' | 'guest',
        name,
        nickname,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        skills: [],
        projects: [],
        bio: '',
        phone: '',
        position: '',
        department: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=random`,
      });
      
      toast.success(`Invitation sent to ${values.email}`);
      setIsInviteDialogOpen(false);
      
      // If we came from Teams page, navigate back
      if (searchParams.get('from') === 'teams') {
        setTimeout(() => {
          router.push('/teams');
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProfile = (member: Member) => {
    setViewingMember(member);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsAddDialogOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(memberId);
        toast.success('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        toast.error('Failed to delete member');
      }
    }
  };

  // Define the form values type based on what the form expects
  type MemberFormValues = {
    name: string;
    email: string;
    role: 'admin' | 'member' | 'guest';
    status: 'active' | 'inactive' | 'invited';
    position?: string;
    department?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  };

  const handleSubmit = async (values: MemberFormValues, isInvitation = false) => {
    setIsSubmitting(true);
    
    try {
      if (editingMember) {
        // Update existing member with all required fields
        await updateMember(editingMember.id, {
          ...values,
          // Keep existing nickname or generate from email if not set
          nickname: values.email?.split('@')[0],
          joinDate: editingMember.joinDate, // Preserve existing join date
          lastActive: new Date().toISOString(), // Update last active time
          skills: editingMember.skills || [],
          projects: editingMember.projects || [],
          bio: values.bio || '',
          phone: values.phone || '',
          position: values.position || '',
          department: values.department || '',
          avatar: values.avatar || editingMember.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random`
        });
        toast.success('Member updated successfully');
      } else {
        // Create new member with all required fields
        const newMember = {
          ...values,
          status: (isInvitation ? 'invited' : 'active') as 'active' | 'inactive' | 'invited',
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          skills: [],
          projects: [],
          bio: values.bio || '',
          phone: values.phone || '',
          position: values.position || '',
          department: values.department || '',
          avatar: values.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random`
        };
        
        const addedMember = await addMember(newMember);
        toast.success(isInvitation 
          ? `Invitation sent to ${addedMember.nickname || addedMember.email}` 
          : `Member ${addedMember.nickname || addedMember.name} added successfully`
        );
      }
      
      setIsAddDialogOpen(false);
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Failed to save member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state on server-side or initial load
  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleInviteClick}
            className="ml-4"
          >
            <Mail className="mr-2 h-4 w-4" /> Invite Member
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="ml-4"
            data-testid="add-member-button"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <MembersList 
        members={paginatedMembers}
        onEditMember={handleEdit}
        onDeleteMember={handleDeleteMember}
        onViewProfile={handleViewProfile}
      />

      {/* Pagination */}
      {members.length > itemsPerPage && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Add/Edit Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update the member details' : 'Add a new team member to your organization'}
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            member={editingMember || undefined}
            existingMembers={members}
            onSubmit={handleSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your team. Theyll receive an email with instructions and will appear in the Teams page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invite Team Member</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInviteDialogOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <InviteMemberForm
              existingMembers={members}
              onSubmit={handleInviteMember}
              onCancel={() => setIsInviteDialogOpen(false)}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="absolute right-4 top-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setViewingMember(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {viewingMember && (
            <MemberProfile 
              member={viewingMember} 
              onEdit={() => {
                setViewingMember(null);
                setEditingMember(viewingMember);
                setIsAddDialogOpen(true);
              }}
              onClose={() => setViewingMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main page component with Suspense boundary
export default function MembersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <MembersPageContent />
    </Suspense>
  );
}
