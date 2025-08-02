# Getting Started

This guide will help you set up the Team Management application on your local machine for development and testing purposes.

## Prerequisites

- Node.js 18.0.0 or later
- npm (comes with Node.js) or Yarn
- Git
- A code editor (VS Code recommended)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/team-management.git
   cd team-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Application
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Database (example with MongoDB)
   MONGODB_URI=your-mongodb-connection-string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm start` - Starts the production server
- `npm test` - Runs the test suite
- `npm run lint` - Runs ESLint for code quality checks
- `npm run format` - Formats code using Prettier

## First Steps

1. **Create an account**
   - Navigate to the registration page
   - Fill in your details
   - Verify your email (if email verification is enabled)

2. **Explore the dashboard**
   - View your teams
   - Create a new team
   - Invite team members

## Need Help?

If you encounter any issues during setup, please check our [FAQ](../docs/faq.md) or open an issue on our [GitHub repository](https://github.com/yourusername/team-management/issues).
