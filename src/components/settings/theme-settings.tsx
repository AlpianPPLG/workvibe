'use client';

import { useState } from 'react';

export function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState('system');
  
  const themes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'System', value: 'system' },
  ];

  const handleThemeChange = (themeValue: string) => {
    setCurrentTheme(themeValue);
    // Here you would typically update the theme in your app's state or context
    console.log('Theme changed to:', themeValue);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Theme</h3>
          <p className="text-sm text-muted-foreground">
            Select your preferred theme
          </p>
        </div>
        <div className="flex items-center gap-2">
          {themes.map((theme) => (
            <button
              key={theme.value}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                currentTheme === theme.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => handleThemeChange(theme.value)}
              aria-label={`Set theme to ${theme.name}`}
              title={`Set theme to ${theme.name}`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
