'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnalyticsFilterProps } from './types';

const FILTER_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

export function AnalyticsFilter({ 
  onFilterChange, 
  activeFilter, 
  className 
}: AnalyticsFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={activeFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.value)}
          className={cn(
            'rounded-full px-4',
            activeFilter === option.value ? 'bg-primary text-primary-foreground' : ''
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
