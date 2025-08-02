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
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 15) || 'user';
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
    // Make sure we don't save duplicates and validate data
    const uniqueMembers = Array.from(
      new Map(newMembers.map(member => {
        const validatedMember = {
          ...member,
          nickname: member.nickname || generateNicknameFromEmail(member.email),
          joinDate: member.joinDate || new Date().toISOString(),
          lastActive: member.lastActive || new Date().toISOString(),
          status: member.status || 'active',
          skills: member.skills || [],
          projects: member.projects || [],
          avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.nickname || member.name || '')}&background=random`,
        };
        return [validatedMember.id, validatedMember];
      })).values()
    );
    
    setMembers(prevMembers => {
      // Only update if there are actual changes
      if (JSON.stringify(prevMembers) !== JSON.stringify(uniqueMembers)) {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(uniqueMembers));
        return uniqueMembers;
      }
      return prevMembers;
    });
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
    }));
  }, [members]);

  // Add a new member with auto-generated nickname
  const addMember = useCallback((member: Omit<Member, 'id' | 'nickname'> & { nickname?: string }) => {
    const nickname = member.nickname || generateNicknameFromEmail(member.email);
    
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      nickname,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: member.status || 'active',
      skills: member.skills || [],
      projects: member.projects || [],
      phone: member.phone || '',
      avatar: member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=random`,
    };

    setMembers(prev => {
      // Check if member with same email already exists
      const existingMemberIndex = prev.findIndex(m => m.email.toLowerCase() === newMember.email.toLowerCase());
      
      if (existingMemberIndex >= 0) {
        // Update existing member if exists
        const updated = [...prev];
        updated[existingMemberIndex] = { ...updated[existingMemberIndex], ...newMember };
        saveMembers(updated);
        return updated;
      }
      
      // Add new member
      const updated = [...prev, newMember];
      saveMembers(updated);
      return updated;
    });
    
    return newMember;
  }, [saveMembers]);

  // Update an existing member
  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    setMembers(prev => {
      const updated = prev.map(member => 
        member.id === id ? { ...member, ...updates, lastActive: new Date().toISOString() } : member
      );
      saveMembers(updated);
      return updated;
    });
  }, [saveMembers]);

  // Delete a member
  const deleteMember = useCallback((id: string) => {
    setMembers(prev => {
      const updated = prev.filter(member => member.id !== id);
      saveMembers(updated);
      return updated;
    });
  }, [saveMembers]);

  // Get team members (computed from members)
  const teamMembers = getTeamMembers();

  return {
    members,
    teamMembers,
    isLoading: isLoading || !isInitialized,
    addMember,
    updateMember,
    deleteMember,
  };
}
