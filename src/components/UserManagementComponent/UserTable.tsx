'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserTableProps } from './types';
import { UserRoleBadge, UserStatusBadge } from './UserBadges';
import { UserActionsMenu } from './UserActionsMenu';

type SortField = 'name' | 'email' | 'role' | 'status' | 'lastActive';
type SortDirection = 'asc' | 'desc' | null;

export function UserTable({
  users,
  onEdit,
  onDelete,
  onStatusChange,
  className = '',
}: UserTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: 'name', direction: 'asc' });

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      
      return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
      if (!sortConfig.direction) return 0;
      
      let aValue, bValue;
      
      switch (sortConfig.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastActive':
          aValue = new Date(a.lastActive).getTime();
          bValue = new Date(b.lastActive).getTime();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: 
        prev.field === field && prev.direction === 'asc' 
          ? 'desc' 
          : prev.field === field && prev.direction === 'desc'
          ? null
          : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
    if (sortConfig.direction === 'asc') return <ChevronUp className="ml-1 h-4 w-4" />;
    if (sortConfig.direction === 'desc') return <ChevronDown className="ml-1 h-4 w-4" />;
    return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
  };

  // Get unique roles and statuses for filters
  const roles = useMemo(() => {
    const roleSet = new Set(users.map(user => user.role));
    return Array.from(roleSet);
  }, [users]);

  const statuses = useMemo(() => {
    const statusSet = new Set(users.map(user => user.status));
    return Array.from(statusSet);
  }, [users]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {roleFilter || 'All Roles'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                key="all-roles"
                checked={!roleFilter}
                onCheckedChange={() => setRoleFilter(null)}
              >
                All Roles
              </DropdownMenuCheckboxItem>
              {roles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={roleFilter === role}
                  onCheckedChange={(checked) =>
                    setRoleFilter(checked ? role : null)
                  }
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : 'All Statuses'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                key="all-statuses"
                checked={!statusFilter}
                onCheckedChange={() => setStatusFilter(null)}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={(checked) =>
                    setStatusFilter(checked ? status : null)
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <button 
                  className="flex items-center font-medium"
                  onClick={() => handleSort('name')}
                >
                  User
                  {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center font-medium"
                  onClick={() => handleSort('email')}
                >
                  Email
                  {getSortIcon('email')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center font-medium"
                  onClick={() => handleSort('role')}
                >
                  Role
                  {getSortIcon('role')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center font-medium"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  className="flex items-center font-medium"
                  onClick={() => handleSort('lastActive')}
                >
                  Last Active
                  {getSortIcon('lastActive')}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/users/${user.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {user.department && (
                          <div className="text-xs text-muted-foreground">
                            {user.department}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.lastActive).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActionsMenu
                      user={user}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">{filteredUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> users
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
