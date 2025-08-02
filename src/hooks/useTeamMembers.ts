import { useState, useEffect, useCallback } from 'react';
import { Member } from '@/types/member';

type TeamMember = Omit<Member, 'position' | 'department' | 'bio'> & {
  projects: number;
  skills: string[];
};

type MemberStatus = 'active' | 'inactive' | 'away' | 'invited';

const MEMBERS_KEY = 'team-members-data';

// Helper function to generate nickname from email
const generateNicknameFromEmail = (email: string): string => {
  if (!email) return 'user';
  return email.split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim()
    .slice(0, 15) || 'user';
};

export function useTeamMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(MEMBERS_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Ensure all members have required fields
          const validatedData = parsedData.map((member: Member) => ({
            ...member,
            nickname: member.nickname || generateNicknameFromEmail(member.email),
            joinDate: member.joinDate || new Date().toISOString(),
            lastActive: member.lastActive || new Date().toISOString(),
            status: member.status || 'active',
            skills: member.skills || [],
            projects: member.projects || [],
            avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.nickname || member.name || '')}&background=random`,
          }));
          setMembers(validatedData);
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  const saveMembers = useCallback((newMembers: Member[]) => {
    try {
      // Make sure we don't save duplicates and validate data
      const uniqueMembers = Array.from(
        new Map(newMembers.map(member => {
          const validatedMember = {
            ...member,
            id: member.id || Date.now().toString(), // Ensure ID exists
            nickname: member.nickname || generateNicknameFromEmail(member.email),
            joinDate: member.joinDate || new Date().toISOString(),
            lastActive: member.lastActive || new Date().toISOString(),
            status: member.status || 'active',
            skills: member.skills || [],
            projects: member.projects || [],
            bio: member.bio || '',
            phone: member.phone || '',
            position: member.position || '',
            department: member.department || '',
            avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.nickname || member.name || '')}&background=random`,
          };
          return [validatedMember.id, validatedMember];
        })).values()
      ) as Member[];
      
      // Save to localStorage first
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(uniqueMembers));
      
      // Then update state
      setMembers(uniqueMembers);
      
      return uniqueMembers;
    } catch (error) {
      console.error('Error saving members to localStorage:', error);
      return [];
    }
  }, []);

  // Get team members in the format needed for the team page
  const getTeamMembers = useCallback((): TeamMember[] => {
    return members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status as MemberStatus,
      avatar: member.avatar,
      lastActive: member.lastActive,
      joinDate: member.joinDate || new Date().toISOString(),
      skills: member.skills || [],
      projects: Array.isArray(member.projects) ? member.projects.length : (member.projects || 0),
      phone: member.phone || '',
      nickname: member.nickname,
    }));
  }, [members]);

  // Add a new member with auto-generated nickname
  const addMember = useCallback(async (member: Omit<Member, 'id' | 'nickname'> & { nickname?: string }) => {
    try {
      const nickname = member.nickname || generateNicknameFromEmail(member.email);
      
      const newMember: Member = {
        ...member,
        id: Date.now().toString(),
        nickname,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'active', // Always set to active for new members
        skills: member.skills || [],
        projects: member.projects || [],
        bio: member.bio || '',
        phone: member.phone || '',
        position: member.position || '',
        department: member.department || '',
        avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=random`,
      };

      await saveMembers([...members, newMember]);
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }, [members, saveMembers]);

  // Add invited member (only appears in Teams page, not Members page)
  const addInvitedMember = useCallback(async (member: Omit<Member, 'id' | 'nickname' | 'status'> & { nickname?: string }) => {
    try {
      const nickname = member.nickname || generateNicknameFromEmail(member.email);
      
      const newMember: Member = {
        ...member,
        id: `invite-${Date.now()}`,
        nickname,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'invited',
        skills: member.skills || [],
        projects: member.projects || [],
        bio: member.bio || '',
        phone: member.phone || '',
        position: member.position || '',
        department: member.department || '',
        avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=random`,
      };

      await saveMembers([...members, newMember]);
      return newMember;
    } catch (error) {
      console.error('Error adding invited member:', error);
      throw error;
    }
  }, [members, saveMembers]);

  // Update an existing member
  const updateMember = useCallback(async (id: string, updates: Partial<Member>) => {
    try {
      const updatedMembers = members.map(member => 
        member.id === id ? { 
          ...member, 
          ...updates, 
          lastActive: new Date().toISOString(),
          // Update nickname if email was changed and no nickname was provided
          nickname: updates.email && !updates.nickname 
            ? generateNicknameFromEmail(updates.email) 
            : (updates.nickname || member.nickname)
        } : member
      );
      
      await saveMembers(updatedMembers);
      return updatedMembers.find(member => member.id === id);
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  }, [members, saveMembers]);

  // Delete a member
  const deleteMember = useCallback(async (id: string) => {
    try {
      const updatedMembers = members.filter(member => member.id !== id);
      await saveMembers(updatedMembers);
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }, [members, saveMembers]);

  // Get team members (computed from members)
  const teamMembers = getTeamMembers();

  // Get members for Members page (exclude invited members)
  const membersPageMembers = members.filter(member => member.status !== 'invited');

  // Get all members including invited (for Teams page)
  const allMembers = [...members];
  
  // Get only invited members
  const invitedMembers = members.filter(member => member.status === 'invited');

  return {
    members: membersPageMembers, // For Members page (excludes invited)
    teamMembers, // For Teams page (converted format)
    allMembers, // All members including invited
    invitedMembers, // Only invited members
    isLoading: isLoading || !isInitialized,
    addMember,
    addInvitedMember,
    updateMember,
    deleteMember,
  };
}
