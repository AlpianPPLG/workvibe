import { Metadata } from 'next';
import { DepartmentsComponent } from '@/components/DepartmentsComponent/DepartmentsComponent';

export const metadata: Metadata = {
  title: 'Departments',
  description: 'Manage your organization\'s departments',
};

export default function DepartmentsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <DepartmentsComponent />
    </main>
  );
}
