import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTeamMembers } from '@/hooks/useTeamMembers';

// Mock the localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTeamMembers', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty members', () => {
    const { result } = renderHook(() => useTeamMembers());
    
    expect(result.current.members).toEqual([]);
    expect(result.current.teamMembers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add a new member', async () => {
    const { result } = renderHook(() => useTeamMembers());
    
    const newMember = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'member' as const,
      position: 'Developer',
      department: 'Engineering',
      status: 'active' as const,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    await act(async () => {
      await result.current.addMember(newMember);
    });

    expect(result.current.members).toHaveLength(1);
    expect(result.current.members[0].name).toBe('John Doe');
    expect(result.current.members[0].status).toBe('active');
    expect(result.current.members[0].nickname).toBe('John');
  });

  it('should add an invited member', async () => {
    const { result } = renderHook(() => useTeamMembers());
    
    const invitedMember = {
      email: 'invite@example.com',
      role: 'guest' as const,
    };

    await act(async () => {
      await result.current.addInvitedMember({
        ...invitedMember,
        name: 'Invited User',
        joinDate: '',
        lastActive: ''
      });
    });

    // Invited member should be in allMembers but not in members
    expect(result.current.allMembers).toHaveLength(1);
    expect(result.current.members).toHaveLength(0);
    expect(result.current.invitedMembers).toHaveLength(1);
    expect(result.current.invitedMembers[0].email).toBe('invite@example.com');
    expect(result.current.invitedMembers[0].status).toBe('invited');
  });

  it('should update a member', async () => {
    const { result } = renderHook(() => useTeamMembers());
    
    // First add a member
    await act(async () => {
      await result.current.addMember({
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'member',
        position: 'Designer',
        department: 'Engineering',
        status: 'active' as const,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        });
    });

    const memberId = result.current.members[0].id;
    
    // Then update the member
    await act(async () => {
      await result.current.updateMember(memberId, {
        position: 'Senior Designer',
      });
    });

    expect(result.current.members[0].position).toBe('Senior Designer');
  });

  it('should delete a member', async () => {
    const { result } = renderHook(() => useTeamMembers());
    
    // First add a member
    await act(async () => {
      await result.current.addMember({
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'admin',
        position: 'Designer',
        department: 'Engineering',
        status: 'active' as const,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      });
    });

    const memberId = result.current.members[0].id;
    
    // Then delete the member
    await act(async () => {
      await result.current.deleteMember(memberId);
    });

    expect(result.current.members).toHaveLength(0);
  });

  it('should persist members in localStorage', async () => {
    const { result } = renderHook(() => useTeamMembers());
    
    // Add a member
    await act(async () => {
      await result.current.addMember({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        position: 'Designer',
        department: 'Engineering',
        status: 'active' as const,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      });
    });

    // Get the stored data from localStorage
    const storedData = window.localStorage.getItem('team-members-data');
    expect(storedData).not.toBeNull();
    
    if (storedData) {
      const members = JSON.parse(storedData);
      expect(members).toHaveLength(1);
      expect(members[0].name).toBe('Alice Johnson');
    }
  });
});
