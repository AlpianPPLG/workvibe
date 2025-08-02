import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, UserCheck, UserX, Mail } from 'lucide-react';
import { Member } from '@/types/member';
import { MemberCard } from './MemberCard';
import { useState } from 'react';

interface MembersListProps {
  members: Member[];
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (memberId: string) => void;
  onViewProfile?: (member: Member) => void;
}

export function MembersList({ 
  members, 
  onEditMember, 
  onDeleteMember,
  onViewProfile
}: MembersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // First filter by search term
  const filteredMembers = members.filter(member => 
    (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Then filter by status
  const activeMembers = filteredMembers.filter(m => m.status === 'active');
  const inactiveMembers = filteredMembers.filter(m => m.status === 'inactive');
  const invitedMembers = filteredMembers.filter(m => m.status === 'invited');
  
  // Only show active and inactive members in the main list
  const visibleMembers = filteredMembers.filter(m => m.status !== 'invited');

  const renderMemberGrid = (membersList: Member[]) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {membersList.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          onEdit={onEditMember}
          onDelete={onDeleteMember}
          onViewProfile={onViewProfile}
        />
      ))}
      {membersList.length === 0 && (
        <div className="col-span-full py-12 text-center text-muted-foreground">
          No members found
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Active {activeMembers.length > 0 && `(${activeMembers.length})`}
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Inactive {inactiveMembers.length > 0 && `(${inactiveMembers.length})`}
          </TabsTrigger>
          <TabsTrigger value="invited" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invited {invitedMembers.length > 0 && `(${invitedMembers.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {renderMemberGrid(activeMembers)}
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          {renderMemberGrid(inactiveMembers)}
        </TabsContent>
        <TabsContent value="invited" className="mt-6">
          {renderMemberGrid(invitedMembers)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
