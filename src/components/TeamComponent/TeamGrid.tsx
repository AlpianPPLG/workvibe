import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TeamMember } from '@/types/team';
import { MoreVertical, Mail, Phone, MessageSquare, UserPlus } from 'lucide-react';

interface TeamGridProps {
  members: TeamMember[];
  onViewProfile?: (member: TeamMember) => void;
}

export function TeamGrid({ members, onViewProfile }: TeamGridProps) {
  if (members.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <UserPlus className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No team members</h3>
        <p className="mb-4 text-sm text-muted-foreground">Get started by adding a new team member</p>
        <Button>Add Team Member</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {members.map((member) => (
        <Card key={member.id} className="overflow-hidden transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Call</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="mr-4">
                <div className="font-medium">Status</div>
                <Badge variant={member.status === 'active' ? 'default' : 'outline'} className="mt-1">
                  {member.status}
                </Badge>
              </div>
              <div>
                <div className="font-medium">Last Active</div>
                <div className="mt-1">{member.lastActive}</div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-muted-foreground">Skills</div>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewProfile?.(member)}
            >
              View Profile
            </Button>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{member.projects.length}</span> projects
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
