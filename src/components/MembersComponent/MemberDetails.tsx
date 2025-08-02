import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Member } from '@/types/member';
import { Mail, Phone, Briefcase, Users, Calendar, Clock, Pencil, Trash2 } from 'lucide-react';

interface MemberDetailsProps {
  member: Member;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: string) => void;
  onClose?: () => void;
}

export function MemberDetails({ member, onEdit, onDelete }: MemberDetailsProps) {
  const getStatusVariant = () => {
    switch (member.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'invited':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {member.avatar ? (
                <AvatarImage src={member.avatar} alt={member.name} />
              ) : (
                <AvatarFallback className="text-lg">
                  {getInitials(member.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                <Badge variant="outline" className={getStatusVariant()}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{member.position || 'No position'}</span>
                {member.department && (
                  <span className="mx-2">•</span>
                )}
                <span>{member.department || ''}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(member.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${member.email}`} className="hover:underline">
                    {member.email}
                  </a>
                </div>
                {member.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <div className="mt-2">
                <Badge variant="secondary" className="capitalize">
                  {member.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Activity</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined on {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Last active: {new Date(member.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {member.skills && member.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {member.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {member.bio && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
            <p className="text-sm">{member.bio}</p>
          </div>
        )}

        {member.projects && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Projects</h3>
            {Array.isArray(member.projects) ? (
              member.projects.length > 0 ? (
                <div className="space-y-2">
                  {member.projects.map((project) => (
                    <div key={project.id} className="flex items-center p-2 border rounded-md">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No projects assigned</p>
              )
            ) : (
              <div className="flex items-center p-2 border rounded-md">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Assigned to {member.projects} projects</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
