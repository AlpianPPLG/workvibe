'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UserRoleBadgeProps, UserStatusBadgeProps } from './types';

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleConfig = {
    admin: {
      label: 'Admin',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    manager: {
      label: 'Manager',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    member: {
      label: 'Member',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    guest: {
      label: 'Guest',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    },
  };

  return (
    <Badge 
      className={cn(
        'font-medium whitespace-nowrap',
        roleConfig[role].className,
        className
      )}
    >
      {roleConfig[role].label}
    </Badge>
  );
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  return (
    <div className="flex items-center">
      <span 
        className={cn(
          'h-2 w-2 rounded-full mr-2',
          status === 'active' ? 'bg-green-500' :
          status === 'inactive' ? 'bg-gray-500' :
          status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
        )} 
      />
      <span 
        className={cn(
          'text-sm font-medium',
          statusConfig[status].className,
          className
        )}
      >
        {statusConfig[status].label}
      </span>
    </div>
  );
}
