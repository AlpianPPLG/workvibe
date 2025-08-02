import { Metadata } from 'next';
import { UserManagementComponent } from '@/components/UserManagementComponent';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage your team members and their permissions',
};

export default function UserManagementPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions in one place
          </p>
        </div>
        
        <div className="rounded-lg border bg-card shadow-sm">
          <UserManagementComponent />
        </div>
      </div>
    </main>
  );
}
