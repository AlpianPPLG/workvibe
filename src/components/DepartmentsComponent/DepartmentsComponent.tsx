'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2, Users, Building2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Department {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  head: {
    name: string;
    email: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
}

interface DepartmentsComponentProps {
  className?: string;
}

export function DepartmentsComponent({ className = '' }: DepartmentsComponentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Department; direction: 'asc' | 'desc' } | null>(null);

  // Mock data - Replace with API calls in a real application
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      description: 'Software development and technical operations',
      memberCount: 24,
      head: { name: 'Alex Johnson', email: 'alex.johnson@example.com' },
      status: 'active',
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      name: 'Marketing',
      description: 'Brand management and digital marketing',
      memberCount: 12,
      head: { name: 'Sarah Williams', email: 'sarah.w@example.com' },
      status: 'active',
      createdAt: '2023-02-20',
    },
    {
      id: '3',
      name: 'Human Resources',
      description: 'Talent acquisition and employee relations',
      memberCount: 8,
      head: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      status: 'active',
      createdAt: '2023-01-05',
    },
  ]);

  const handleSort = (key: keyof Department) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredDepartments = sortedDepartments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.head.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedDepartment) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setDepartments(departments.filter((dept) => dept.id !== selectedDepartment.id));
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      toast(`${selectedDepartment.name} has been successfully deleted.`);
    }, 1000);
  };

  const handleCreateDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!name || !description) {
      toast('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newDepartment: Department = {
        id: (departments.length + 1).toString(),
        name,
        description,
        memberCount: 0,
        head: { name: 'New Head', email: 'new.head@example.com' },
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setDepartments([...departments, newDepartment]);
      setIsSubmitting(false);
      setIsCreateDialogOpen(false);
      
      toast('Department created successfully!');
    }, 1000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">
            Manage your organizations departments and their members
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateDepartment}>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name *</Label>
                  <Input id="name" name="name" placeholder="e.g., Engineering" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the department"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search departments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Users className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      Department
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('memberCount')}
                  >
                    <div className="flex items-center">
                      Members
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>
                        <p className="line-clamp-1 max-w-xs">{department.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {department.head.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{department.head.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {department.head.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {department.memberCount} {department.memberCount === 1 ? 'member' : 'members'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={department.status === 'active' ? 'default' : 'secondary'}>
                          {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/departments/${department.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(department)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No departments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredDepartments.length}</strong> of <strong>{departments.length}</strong> departments
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedDepartment?.name}</span>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
