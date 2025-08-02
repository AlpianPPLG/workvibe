import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types/member';
import { Calendar, Mail, Phone, Briefcase, Users, Clock, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface MemberProfileProps {
  member: Member;
  onEdit?: () => void;
  onClose?: () => void;
}

export function MemberProfile({ member, onEdit, onClose }: MemberProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      invited: 'bg-blue-100 text-blue-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleIcons = {
      admin: <Shield className="w-4 h-4 mr-1" />,
      member: <User className="w-4 h-4 mr-1" />,
      guest: <User className="w-4 h-4 mr-1" />,
    };

    const roleLabels = {
      admin: 'Admin',
      member: 'Member',
      guest: 'Guest',
    };

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {roleIcons[role as keyof typeof roleIcons]}
        {roleLabels[role as keyof typeof roleLabels] || role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          {member.avatar ? (
            <AvatarImage src={member.avatar} alt={member.name} />
          ) : (
            <AvatarFallback className="text-2xl">
              {getInitials(member.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <div className="flex items-center justify-center space-x-2 mt-1">
            {getRoleBadge(member.role)}
            {getStatusBadge(member.status)}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{member.email}</p>
            </div>
          </div>
          
          {member.phone && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{member.phone}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium">
                {member.joinDate ? format(new Date(member.joinDate), 'MMMM d, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Last active</p>
              <p className="font-medium">
                {member.lastActive}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(member.position || member.department) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.position && (
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{member.position}</p>
                </div>
              </div>
            )}
            
            {member.department && (
              <div className="flex items-start">
                <Users className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{member.department}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {member.bio && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{member.bio}</p>
          </CardContent>
        </Card>
      )}

      {(onEdit || onClose) && (
        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
          {onEdit && (
            <Button onClick={onEdit}>
              Edit Profile
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
