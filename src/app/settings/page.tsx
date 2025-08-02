import { Metadata } from 'next';
import { Header } from '@/components/shared/header';
import { ThemeSettings } from '@/components/settings/theme-settings';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account and application settings',
};

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and application settings
              </p>
            </div>
            
            <div className="space-y-6">
              <SettingsSection 
                title="Appearance" 
                description="Customize the look and feel of the application"
              >
                <ThemeSettings />
              </SettingsSection>

              <SettingsSection 
                title="Notifications" 
                description="Configure how you receive notifications"
              >
                <NotificationSettings />
              </SettingsSection>

              <SettingsSection 
                title="Account" 
                description="Manage your account settings"
              >
                <AccountSettings />
              </SettingsSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}

function NotificationSettings() {
  const notificationTypes = [
    { id: 'email', label: 'Email notifications', defaultChecked: true },
    { id: 'push', label: 'Push notifications', defaultChecked: true },
    { id: 'sms', label: 'SMS notifications', defaultChecked: false },
  ];

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-base font-medium">Notification Preferences</h3>
      <div className="space-y-4">
        {notificationTypes.map((type) => (
          <div key={type.id} className="flex items-center justify-between">
            <label htmlFor={type.id} className="text-sm font-medium">
              {type.label}
            </label>
            <input
              type="checkbox"
              id={type.id}
              defaultChecked={type.defaultChecked}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="John"
                placeholder="Enter your first name"
                aria-label="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="Doe"
                placeholder="Enter your last name"
                aria-label="Last Name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="john.doe@example.com"
              placeholder="Enter your email address"
              aria-label="Email Address"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
