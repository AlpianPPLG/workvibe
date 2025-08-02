'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TaskFilter } from '@/types/task';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

type FilterOption = {
  id: string;
  label: string;
  field: keyof TaskFilter;
  options: { value: string; label: string }[];
};

const filterOptions: FilterOption[] = [
  {
    id: 'status',
    label: 'Status',
    field: 'status',
    options: [
      { value: 'backlog', label: 'Backlog' },
      { value: 'todo', label: 'To Do' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'in_review', label: 'In Review' },
      { value: 'done', label: 'Done' },
      { value: 'canceled', label: 'Canceled' },
    ],
  },
  {
    id: 'priority',
    label: 'Priority',
    field: 'priority',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
  {
    id: 'type',
    label: 'Type',
    field: 'type',
    options: [
      { value: 'task', label: 'Task' },
      { value: 'bug', label: 'Bug' },
      { value: 'feature', label: 'Feature' },
      { value: 'improvement', label: 'Improvement' },
      { value: 'story', label: 'User Story' },
      { value: 'epic', label: 'Epic' },
    ],
  },
];

export function TaskFilters() {
  const [filters, setFilters] = useState<TaskFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).reduce(
    (count, value) => count + (Array.isArray(value) ? value.length : value ? 1 : 0),
    0
  );

  const handleFilterChange = (field: keyof TaskFilter, value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentValues = (prev[field] as string[]) || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return {
        ...prev,
        [field]: newValues.length > 0 ? newValues : undefined,
      };
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search tasks..."
          className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Filters</h4>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">{filter.label}</h5>
                <div className="grid grid-cols-2 gap-2">
                  {filter.options.map((option) => {
                    const isChecked = (filters[filter.field] as string[])?.includes(option.value);
                    return (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filter.id}-${option.value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleFilterChange(filter.field, option.value, checked === true)
                          }
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={clearFilters}
        >
          Clear all
          <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
