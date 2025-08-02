# Project Structure

This document outlines the structure of the Team Management application's codebase.

## Root Directory

```
.
├── .github/            # GitHub workflows and issue templates
├── .next/              # Next.js build output (generated)
├── public/             # Static files (images, fonts, etc.)
├── src/                # Application source code
│   ├── app/            # App Router pages and layouts
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configurations
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables (not versioned)
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Detailed Structure

### `/src/app`

Contains all the application routes following the Next.js 13+ App Router convention.

```
app/
├── (auth)/             # Authentication related routes
│   ├── login/          # Login page
│   └── register/       # Registration page
├── dashboard/          # Main dashboard
│   └── teams/          # Team management
│       └── [id]/       # Specific team view
├── api/                # API routes
│   ├── auth/           # Authentication API
│   └── teams/          # Teams API
├── layout.tsx          # Root layout
└── page.tsx            # Home page
```

### `/src/components`

Reusable UI components organized by feature or category.

```
components/
├── auth/               # Authentication components
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── dashboard/          # Dashboard components
│   ├── Sidebar.tsx
│   └── Header.tsx
├── teams/              # Team-related components
│   ├── TeamCard.tsx
│   └── TeamForm.tsx
├── ui/                 # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
└── index.ts            # Barrel exports
```

### `/src/hooks`

Custom React hooks for state management and side effects.

```
hooks/
├── useAuth.ts          # Authentication state
├── useTeams.ts         # Team data fetching
└── useToast.ts         # Toast notifications
```

### `/src/lib`

Utility functions and configurations.

```
lib/
├── api/               # API client configuration
│   ├── client.ts
│   └── endpoints.ts
├── constants/         # Application constants
├── utils/             # Utility functions
└── validation/        # Form validation schemas
```

### `/public`

Static assets served at the root path.

```
public/
├── images/            # Image assets
├── fonts/             # Custom fonts
└── favicon.ico        # Favicon
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused on a single responsibility
   - Use PascalCase for component file names
   - Co-locate component-specific styles and tests

2. **File Naming**
   - Use kebab-case for route segments
   - Use PascalCase for component files
   - Use camelCase for utility files and hooks

3. **Imports**
   - Use absolute imports for cleaner import paths
   - Group imports: external libraries first, then internal modules
   - Separate component imports from utility/hook imports

4. **TypeScript**
   - Use TypeScript interfaces/types for all props and API responses
   - Avoid using `any` type
   - Create type definitions in the `types` directory for shared types

For more information on specific parts of the application, please refer to their respective documentation sections.
