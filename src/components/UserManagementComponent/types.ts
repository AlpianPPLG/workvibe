export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastActive: Date;
  avatar?: string;
  department?: string;
  position?: string;
  joinDate: Date;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: User['status']) => void;
  className?: string;
}

export interface UserFormProps {
  user?: User | null;
  onSave: (user: Omit<User, 'id' | 'lastActive' | 'joinDate'>) => void;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
}

export interface UserFilterProps {
  onFilter: (filters: {
    search?: string;
    role?: string;
    status?: string;
    department?: string;
  }) => void;
  className?: string;
}

export interface UserRoleBadgeProps {
  role: User['role'];
  className?: string;
}

export interface UserStatusBadgeProps {
  status: User['status'];
  className?: string;
}

export interface UserActionsMenuProps {
  userId: string;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: User['status']) => void;
  className?: string;
}
