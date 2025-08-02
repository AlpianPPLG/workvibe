'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

// Client component that uses useSearchParams
function MembersPageContent() {
  const searchParams = useSearchParams();
  const { members, addMember, updateMember, deleteMember } = useTeamMembers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle hydration issues with localStorage
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for addMember query parameter on component mount
  useEffect(() => {
    const shouldOpenAddDialog = searchParams.get('addMember') === 'true';
    if (shouldOpenAddDialog) {
      setIsAddDialogOpen(true);
      // Clean up the URL without refreshing the page
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('addMember');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsAddDialogOpen(true);
  };

  const handleInviteMember = () => {
    setIsInviteDialogOpen(true);
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

  const handleInvite = async (values: { email: string; role: 'admin' | 'member' | 'guest' }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a complete member object with all required fields
      const newMember = {
        name: values.email.split('@')[0],
        email: values.email,
        role: values.role,
        status: 'invited' as const,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        skills: [],
        projects: [],
        bio: '',
        phone: '',
        position: '',
        department: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(values.email.split('@')[0])}&background=random`
      };
      
      // Add the new member - this will handle the nickname generation and persistence
      const addedMember = await addMember(newMember);
      toast.success(`Invitation sent to ${addedMember.nickname || addedMember.email}`);
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleInviteMember}>
            <Mail className="mr-2 h-4 w-4" /> Invite Member
          </Button>
          <Button onClick={handleAddMember}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <MembersList 
        members={members}
        onEditMember={handleEdit}
        onDeleteMember={handleDeleteMember}
        onViewProfile={handleViewProfile}
      />

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
              Invite a new member to join your team. They&apos;ll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          <InviteMemberForm
            existingMembers={members}
            onSubmit={handleInvite}
            onCancel={() => setIsInviteDialogOpen(false)}
            isLoading={isLoading || isSubmitting}
          />
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
