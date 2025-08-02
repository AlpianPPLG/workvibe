# Component Library

This document provides documentation for the reusable UI components used throughout the Team Management application.

## Table of Contents

- [Component Structure](#component-structure)
- [Component List](#component-list)
- [Usage Guidelines](#usage-guidelines)
- [Component API](#component-api)
- [Best Practices](#best-practices)

## Component Structure

Each component follows a consistent structure:

```
components/
  ComponentName/
    ├── index.tsx      # Main component file
    ├── types.ts       # TypeScript types/interfaces
    ├── styles.module.css  # Component-specific styles
    ├── __tests__/     # Component tests
    └── README.md      # Component documentation (optional)
```

## Component List

### Core UI Components

| Component | Description |
|-----------|-------------|
| `Button` | A customizable button component with various styles and sizes |
| `Input` | Form input field with validation support |
| `Modal` | Reusable modal dialog component |
| `Table` | Data table with sorting and pagination |
| `Card` | Container component for content grouping |

### Form Components

| Component | Description |
|-----------|-------------|
| `Form` | Wrapper for forms with validation |
| `FormField` | Form field with label and error handling |
| `Select` | Dropdown select component |
| `Checkbox` | Custom checkbox input |
| `DatePicker` | Date selection component |

### Layout Components

| Component | Description |
|-----------|-------------|
| `Layout` | Main application layout |
| `Sidebar` | Navigation sidebar |
| `Header` | Top navigation bar |
| `Container` | Responsive content container |

## Usage Guidelines

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="lg">Large Primary Button</Button>

// With icon
<Button leftIcon={<Icon name="plus" />}>Add Item</Button>
```

### Input Component

```tsx
import { Input } from '@/components/ui/Input';

// Basic input
<Input 
  label="Email"
  name="email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  {...register('email')}
/>
```

## Component API

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'danger' | 'primary' | Button style variant |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| `isLoading` | boolean | false | Show loading state |
| `disabled` | boolean | false | Disable the button |
| `leftIcon` | ReactNode | undefined | Icon to display on the left |
| `rightIcon` | ReactNode | undefined | Icon to display on the right |
| `onClick` | () => void | undefined | Click handler |

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | '' | Input label |
| `name` | string | - | Input name (required) |
| `type` | string | 'text' | Input type |
| `placeholder` | string | '' | Input placeholder |
| `error` | string | undefined | Error message to display |
| `disabled` | boolean | false | Disable the input |
| `required` | boolean | false | Mark as required |
| `register` | UseFormRegister | - | React Hook Form register function |

## Best Practices

1. **Props Naming**
   - Use clear, descriptive prop names
   - Prefix boolean props with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`)
   - Use consistent naming across similar components

2. **Styling**
   - Use CSS Modules for component-specific styles
   - Follow BEM naming convention for class names
   - Use design tokens for consistent theming

3. **Accessibility**
   - Include proper ARIA attributes
   - Ensure keyboard navigation works
   - Add appropriate roles and labels

4. **Performance**
   - Use `React.memo` for pure components
   - Implement proper prop types and default props
   - Avoid inline function definitions in render

5. **Testing**
   - Write unit tests for component logic
   - Include accessibility tests
   - Test different states and edge cases

## Creating a New Component

1. Create a new directory in `src/components`
2. Follow the component structure shown above
3. Export the component from `src/components/index.ts`
4. Add documentation in the component's README.md
5. Write tests in the `__tests__` directory

## Contributing

When contributing new components or modifying existing ones:

1. Follow the existing code style and patterns
2. Update the relevant documentation
3. Add or update tests
4. Ensure the component is accessible
5. Get your changes reviewed before merging
