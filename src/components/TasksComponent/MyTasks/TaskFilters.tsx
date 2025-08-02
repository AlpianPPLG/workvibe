'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TaskFilter } from '@/types/task';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

type FilterOption = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
};

const filterOptions: FilterOption[] = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'todo', label: 'To Do' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'in_review', label: 'In Review' },
      { value: 'done', label: 'Done' },
    ],
  },
  {
    id: 'priority',
    label: 'Priority',
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
    options: [
      { value: 'task', label: 'Task' },
      { value: 'bug', label: 'Bug' },
      { value: 'feature', label: 'Feature' },
      { value: 'improvement', label: 'Improvement' },
    ],
  },
];

type TaskFiltersProps = {
  filters: TaskFilter;
  onFilterChange: (filters: TaskFilter) => void;
};

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const [] = useState<string | null>(null);

  type FilterKey = 'status' | 'priority' | 'type' | 'assignee' | 'project' | 'label';
  
  // Map filter IDs to their corresponding FilterKey
  const filterIdToKey: Record<string, FilterKey> = {
    status: 'status',
    priority: 'priority',
    type: 'type',
    assignee: 'assignee',
    project: 'project',
    label: 'label'
  };
  
  const getFilterKey = (id: string): FilterKey => {
    const key = filterIdToKey[id];
    if (!key) {
      console.warn(`Unknown filter ID: ${id}, defaulting to 'status'`);
      return 'status';
    }
    return key;
  };
  
  const handleFilterChange = (filterType: FilterKey, value: string, checked: boolean) => {
    const currentValues = [...(filters[filterType] || [])] as string[];
    
    if (checked) {
      onFilterChange({
        ...filters,
        [filterType]: [...currentValues, value]
      });
    } else {
      onFilterChange({
        ...filters,
        [filterType]: currentValues.filter(v => v !== value)
      });
    }
  };

  const clearFilter = (filterType: FilterKey, value: string) => {
    const currentValues = [...(filters[filterType] || [])] as string[];
    onFilterChange({
      ...filters,
      [filterType]: currentValues.filter(v => v !== value)
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: [],
      priority: [],
      type: [],
      assignee: [],
      project: [],
      label: []
    });
  };

  const isFilterActive = (filterType: FilterKey, value: string) => {
    return (filters[filterType] as string[] || []).includes(value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="space-y-4 p-4">
              {filterOptions.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <h4 className="text-sm font-medium">{filter.label}</h4>
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filter.id}-${option.value}`}
                          checked={isFilterActive(getFilterKey(filter.id), option.value)}
                          onCheckedChange={(checked) => 
                            handleFilterChange(getFilterKey(filter.id), option.value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {filter.id !== filterOptions[filterOptions.length - 1].id && <Separator />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {Object.entries(filters).flatMap(([filterType, values]) => {
          if (!values || Array.isArray(values) && values.length === 0) return null;
          if (filterType === 'search' || filterType === 'dueDate') return null;
          
          return (values as string[]).map(value => (
            <div key={`${filterType}-${value}`} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
              <span className="capitalize">{filterType}: {value}</span>
              <Button
                type="button"
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-primary/20"
                onClick={() => clearFilter(filterType as FilterKey, value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ));
        })}

        {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 lg:px-3 text-xs"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
