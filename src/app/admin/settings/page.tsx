import { Metadata } from 'next';
import { SettingsComponent } from '@/components/SettingsComponent/SettingsComponent';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <SettingsComponent />
    </main>
  );
}
