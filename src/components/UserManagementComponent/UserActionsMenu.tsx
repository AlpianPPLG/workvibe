'use client';

import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit,
  Trash2, 
  UserCheck, 
  UserX, 
  UserCog,
  UserMinus
} from 'lucide-react';
import { User } from './types';

interface UserActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: User['status']) => void;
  className?: string;
}

export function UserActionsMenu({ 
  user, 
  onEdit, 
  onDelete, 
  onStatusChange}: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status: User['status']) => {
    onStatusChange(user.id, status);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleStatusChange('active')}>
          <UserCheck className={`mr-2 h-4 w-4 ${user.status === 'active' ? 'text-green-500' : ''}`} />
          <span className={user.status === 'active' ? 'font-semibold' : ''}>Set as Active</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
          <UserMinus className={`mr-2 h-4 w-4 ${user.status === 'inactive' ? 'text-gray-500' : ''}`} />
          <span className={user.status === 'inactive' ? 'font-semibold' : ''}>Set as Inactive</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
          <UserCog className={`mr-2 h-4 w-4 ${user.status === 'pending' ? 'text-yellow-500' : ''}`} />
          <span className={user.status === 'pending' ? 'font-semibold' : ''}>Set as Pending</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleStatusChange('suspended')}>
          <UserX className={`mr-2 h-4 w-4 ${user.status === 'suspended' ? 'text-red-500' : ''}`} />
          <span className={user.status === 'suspended' ? 'font-semibold' : ''}>Suspend User</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(user.id)}
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
