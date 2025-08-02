'use client';

import { Settings, Moon, Bell, User, Mail, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function HeaderSettings() {
  const { theme, setTheme } = useTheme();
  
  const settings = [
    {
      icon: <Moon className="h-4 w-4" />,
      label: 'Dark Mode',
      description: 'Switch between dark and light mode',
      action: (
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      ),
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: 'Notifications',
      description: 'Enable or disable notifications',
      action: <Switch defaultChecked />,
    },
    {
      icon: <Globe className="h-4 w-4" />,
      label: 'Language',
      description: 'Change application language',
      action: <span className="text-sm text-muted-foreground">English</span>,
    },
  ];

  const accountSettings = [
    { icon: <User className="h-4 w-4" />, label: 'Profile Settings' },
    { icon: <Mail className="h-4 w-4" />, label: 'Email Preferences' },
    { icon: <Lock className="h-4 w-4" />, label: 'Privacy & Security' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" align="end">
        <DropdownMenuLabel className="text-sm font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-2 py-1">
          {settings.map((item, index) => (
            <div key={index} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-muted">
                  {item.icon}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              {item.action}
            </div>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          ACCOUNT
        </DropdownMenuLabel>
        
        <div className="space-y-1 py-1">
          {accountSettings.map((item, index) => (
            <DropdownMenuItem key={index} className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer">
              <div className="p-1.5 rounded-md bg-muted">
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderSettings;
