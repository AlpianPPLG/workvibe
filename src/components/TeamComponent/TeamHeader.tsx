import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, UserPlus, X, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type FilterOptions = {
  status: string[];
  role: string[];
};

interface TeamHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onInviteClick: () => void;
  onAddMembersClick: () => void;
}

export function TeamHeader({ searchTerm, onSearchChange, onInviteClick, onAddMembersClick }: TeamHeaderProps) {
  const [filters, setFilters] = useState<FilterOptions>({ status: [], role: [] });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = ['active', 'inactive', 'invited', 'away', 'on leave'];
  const roleOptions = ['admin', 'member', 'guest'];

  const handleFilterChange = (type: 'status' | 'role', value: string) => {
    const newFilters = { ...filters };
    
    if (newFilters[type].includes(value)) {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    } else {
      newFilters[type] = [...newFilters[type], value];
    }
    
    setFilters(newFilters);
    onSearchChange('');
  };

  const clearFilters = () => {
    setFilters({ status: [], role: [] });
    onSearchChange('');
  };

  const hasActiveFilters = filters.status.length > 0 || filters.role.length > 0;
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search team members..."
            className="w-full pl-8 sm:w-[200px] md:w-[300px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 relative">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {filters.status.length + filters.role.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={clearFilters}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => handleFilterChange('status', status)}
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="text-sm font-medium leading-none capitalize cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`role-${role}`}
                        checked={filters.role.includes(role)}
                        onCheckedChange={() => handleFilterChange('role', role)}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none capitalize cursor-pointer"
                      >
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="outline"
          className="h-10"
          onClick={onAddMembersClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Members
        </Button>
        <Button 
          className="h-10"
          onClick={onInviteClick}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
    </div>
  );
}
