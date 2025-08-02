'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { User } from './types';
import { toast } from 'sonner';

export function UserManagementComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users - in a real app, this would be an API call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would come from your API
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            status: 'active',
            department: 'Engineering',
            position: 'CTO',
            lastActive: new Date('2025-07-30T14:30:00'),
            joinDate: new Date('2020-01-15'),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'manager',
            status: 'active',
            department: 'Marketing',
            position: 'Marketing Director',
            lastActive: new Date('2025-07-29T09:15:00'),
            joinDate: new Date('2021-03-22'),
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            role: 'member',
            status: 'inactive',
            department: 'Sales',
            position: 'Sales Representative',
            lastActive: new Date('2025-07-25T16:45:00'),
            joinDate: new Date('2022-06-10'),
          },
          {
            id: '4',
            name: 'Emily Davis',
            email: 'emily@example.com',
            role: 'member',
            status: 'pending',
            department: 'Design',
            position: 'UI/UX Designer',
            lastActive: new Date('2025-07-28T11:20:00'),
            joinDate: new Date('2023-01-05'),
          },
          {
            id: '5',
            name: 'Michael Brown',
            email: 'michael@example.com',
            role: 'guest',
            status: 'suspended',
            department: 'Operations',
            position: 'Operations Manager',
            lastActive: new Date('2025-07-20T13:10:00'),
            joinDate: new Date('2023-05-18'),
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleAddUser = useCallback((userData: Omit<User, 'id' | 'lastActive' | 'joinDate'>) => {
    // In a real app, this would be an API call
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      lastActive: new Date(),
      joinDate: new Date(),
    };
    
    setUsers(prevUsers => [newUser, ...prevUsers]);
    setIsFormOpen(false);
    toast.success('User added successfully');
  }, []);

  const handleUpdateUser = useCallback((userData: Omit<User, 'id' | 'lastActive' | 'joinDate'>) => {
    if (!editingUser) return;
    
    // In a real app, this would be an API call
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      )
    );
    
    setEditingUser(null);
    setIsFormOpen(false);
    toast.success('User updated successfully');
  }, [editingUser]);

  const handleDeleteUser = useCallback((userId: string) => {
    // In a real app, this would be an API call
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  }, []);

  const handleStatusChange = useCallback((userId: string, status: User['status']) => {
    // In a real app, this would be an API call
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      )
    );
    
    toast.success(`User status updated to ${status}`);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback((userData: Omit<User, 'id' | 'lastActive' | 'joinDate'>) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleAddUser(userData);
    }
  }, [editingUser, handleAddUser, handleUpdateUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button 
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onStatusChange={handleStatusChange}
        />
      </div>
      
      <UserForm
        user={editingUser}
        onSave={handleFormSubmit}
        onCancel={() => {
          setEditingUser(null);
          setIsFormOpen(false);
        }}
        isOpen={isFormOpen}
        isLoading={isLoading}
      />
    </div>
  );
}
