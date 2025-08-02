import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Member } from '@/types/member';
import { Loader2 } from 'lucide-react';

// Create a function to validate if email or other fields already exist
const createFormSchema = (existingMembers: Member[] = [], currentMemberId?: string) => 
  z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .refine(
        (name) => {
          if (!existingMembers.length) return true;
          return !existingMembers.some(
            (member) => 
              member.name.toLowerCase() === name.toLowerCase() && 
              member.id !== currentMemberId
          );
        },
        {
          message: 'This name is already in use',
        }
      ),
    email: z
      .string()
      .email('Invalid email address')
      .refine(
        (email) => {
          if (!existingMembers.length) return true;
          return !existingMembers.some(
            (member) => 
              member.email.toLowerCase() === email.toLowerCase() && 
              member.id !== currentMemberId
          );
        },
        {
          message: 'This email is already in use',
        }
      ),
    phone: z
      .string()
      .optional()
      .refine(
        (phone) => {
          if (!phone || !existingMembers.length) return true;
          return !existingMembers.some(
            (member) => 
              member.phone && 
              member.phone === phone && 
              member.id !== currentMemberId
          );
        },
        {
          message: 'This phone number is already in use',
        }
      ),
    role: z.enum(['admin', 'member', 'guest']),
    status: z.enum(['active', 'inactive', 'invited']),
    department: z.string().optional(),
    position: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
  });

// Define the form schema type
type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

interface MemberFormProps {
  member?: Member;
  existingMembers?: Member[];
  onSubmit: (values: FormSchema, isInvitation?: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isInvite?: boolean;
}

export function MemberForm({ 
  member, 
  existingMembers = [], 
  onSubmit, 
  onCancel, 
  isLoading, 
  isInvite = false 
}: MemberFormProps) {
  // Create form schema with current members for validation
  const formSchema = useMemo(
    () => createFormSchema(existingMembers, member?.id),
    [existingMembers, member?.id]
  );

  const [isInviting, setIsInviting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: member ? {
      ...member,
      // Ensure status is one of the allowed values, default to 'inactive' if not
      status: (member.status === 'active' || member.status === 'inactive' || member.status === 'invited')
        ? member.status
        : 'inactive'
    } : {
      name: '',
      email: '',
      role: 'member',
      position: '',
      department: '',
      phone: '',
      bio: '',
      status: 'active',
      avatar: '',
    },
  });

  // Auto-fill name from email when email changes and name is empty
  const email = form.watch('email');
  const name = form.watch('name');
  
  useEffect(() => {
    if (!member && email && !name) {
      // Extract the part before @ and capitalize first letter of each word
      const nameFromEmail = email.split('@')[0]
        .split(/[.\-_]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      form.setValue('name', nameFromEmail, { shouldValidate: true });
    }
  }, [email, name, form, member]);

  const handleFormSubmit = async (values: FormSchema) => {
    if (isInvite) {
      try {
        setIsInviting(true);
        // Here you would typically call your API to send an invitation
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Show success message
        toast.success('Invitation sent successfully!');
        
        // Submit the form
        onSubmit(values);
      } catch (error) {
        console.error('Error sending invitation:', error);
        toast.error('Failed to send invitation. Please try again.');
      } finally {
        setIsInviting(false);
      }
    } else {
      // Regular form submission
      onSubmit(values);
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
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-6"
      >
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            {form.watch('avatar') ? (
              <AvatarImage src={form.watch('avatar')} alt={form.watch('name')} />
            ) : (
              <AvatarFallback className="text-2xl">
                {form.watch('name') ? getInitials(form.watch('name')) : 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {member ? 'Update member details' : 'Add a new team member'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Engineering" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about this team member"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <div>
            {isInvite && (
              <p className="text-sm text-muted-foreground">
                An invitation email will be sent to the members email address.
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isInviting}
            >
              Cancel
            </Button>
            {isInvite ? (
              <Button 
                type="submit" 
                disabled={isLoading || isInviting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {member ? 'Updating...' : 'Adding...'}
                  </>
                ) : member ? (
                  'Update Member'
                ) : (
                  'Add Member'
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
