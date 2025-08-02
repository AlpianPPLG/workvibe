# State Management

This document outlines the state management strategy used in the Team Management application, including how to manage local and global state effectively.

## Table of Contents

- [State Management Overview](#state-management-overview)
- [Local State](#local-state)
- [Global State](#global-state)
- [Server State](#server-state)
- [State Persistence](#state-persistence)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Performance Considerations](#performance-considerations)

## State Management Overview

We use a combination of React's built-in state management and external libraries to handle different types of state:

- **Local State**: Component-level state using `useState` and `useReducer`
- **Global State**: Application-wide state using React Context and/or Zustand
- **Server State**: Data fetched from APIs using React Query
- **URL State**: State managed through URL parameters and Next.js router
- **Form State**: Form handling with React Hook Form

## Local State

### When to Use Local State

- UI state that's only relevant to a single component
- Simple state that doesn't need to be shared across components
- Form inputs and controlled components

### Implementation

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

## Global State

### When to Use Global State

- User authentication state
- Theme preferences
- Application-wide settings
- Data that needs to be accessed by many components

### Implementation with Zustand

1. **Create a store**

```tsx
// stores/useStore.ts
import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () => 
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  user: null,
  setUser: (user) => set({ user }),
}));
```

2. **Use the store in components**

```tsx
import { useStore } from '@/stores/useStore';

function UserProfile() {
  const { user, theme } = useStore();
  
  return (
    <div className={theme}>
      <h2>Welcome, {user?.name}</h2>
      {/* ... */}
    </div>
  );
}
```

## Server State

### When to Use Server State

- Data fetched from an API
- Data that needs to be cached
- Data that needs background updates

### Implementation with React Query

1. **Set up QueryClientProvider**

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

2. **Create custom hooks for queries**

```tsx
// hooks/useTeams.ts
import { useQuery } from '@tanstack/react-query';
import { Team } from '@/types';

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      return response.json();
    },
  });
}
```

3. **Use the hook in components**

```tsx
import { useTeams } from '@/hooks/useTeams';

function TeamsList() {
  const { data: teams, isLoading, error } = useTeams();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading teams</div>;
  
  return (
    <ul>
      {teams?.map((team) => (
        <li key={team.id}>{team.name}</li>
      ))}
    </ul>
  );
}
```

## State Persistence

### Persisting State to localStorage

```tsx
// hooks/usePersistedState.ts
import { useState, useEffect } from 'react';

export function usePersistedState<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## Best Practices

1. **Colocate State**
   - Keep state as close as possible to where it's used
   - Lift state up only when necessary

2. **Derived State**
   - Derive state from existing state when possible
   - Use `useMemo` for expensive calculations

3. **State Updates**
   - Use functional updates when the new state depends on the old state
   - Batch state updates when possible

4. **Performance**
   - Memoize components with `React.memo` when necessary
   - Use `useCallback` for callbacks passed to child components
   - Use `useMemo` for expensive computations

## Common Patterns

### Lifting State Up

```tsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <ChildA count={count} />
      <ChildB onIncrement={() => setCount(c => c + 1)} />
    </div>
  );
}
```

### State Reducer Pattern

```tsx
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error('Unknown action type');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

## Performance Considerations

1. **Avoid Unnecessary Rerenders**
   - Use `React.memo` for pure components
   - Use `useCallback` and `useMemo` to stabilize references

2. **Optimize Context Usage**
   - Split contexts by domain
   - Use multiple contexts instead of a single large one

3. **Virtualize Long Lists**
   - Use `react-window` or `react-virtualized` for large lists

4. **Code Splitting**
   - Use dynamic imports for large components
   - Split code by routes
