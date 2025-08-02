import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Member } from '@/types/member';
import { Mail, Phone, User, Briefcase, Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface MemberCardProps {
  member: Member;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: string) => void;
  onViewProfile?: (member: Member) => void;
}

export function MemberCard({ member, onEdit, onDelete, onViewProfile }: MemberCardProps) {
  const getStatusVariant = () => {
    switch (member.status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'invited':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger view profile if the click wasn't on a button or link
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a') && onViewProfile) {
      onViewProfile(member);
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md group"
      onClick={handleCardClick}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {member.avatar ? (
                <AvatarImage src={member.avatar} alt={member.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  {member.nickname && member.nickname !== member.name ? (
                    <>
                      <span className="font-medium">{member.nickname}</span>
                      <span className="text-muted-foreground text-sm ml-1">({member.name})</span>
                    </>
                  ) : (
                    member.name
                  )}
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                {member.position || 'Team Member'}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewProfile && (
                <DropdownMenuItem 
                  onClick={() => onViewProfile(member)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem 
                  onClick={() => onEdit(member)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(member.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="flex justify-between items-start">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewProfile) onViewProfile(member);
            }}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
        <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-2 h-4 w-4" />
          <span className="truncate">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <span>{member.phone}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-2 h-4 w-4" />
          <Badge variant={getStatusVariant()} className="capitalize">
            {member.status}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Briefcase className="mr-2 h-4 w-4" />
          <span>{member.role}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
        </div>
      </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button variant="outline" size="sm" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
