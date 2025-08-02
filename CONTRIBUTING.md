# Contributing to Team Management

Thank you for your interest in contributing to the Team Management application! We welcome all contributions, whether it's bug reports, feature requests, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/team-management.git
   cd team-management
   ```
3. **Set up the development environment**
   ```bash
   # Install dependencies
   npm install
   
   # Create a .env file
   cp .env.example .env.local
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number-description
   ```

2. **Make your changes** following the code style guidelines

3. **Run tests** to ensure nothing is broken
   ```bash
   npm test
   ```

4. **Commit your changes** with a descriptive message
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with login"
   ```

5. **Push to your fork**
   ```bash
   git push origin your-branch-name
   ```

6. **Open a Pull Request** from your fork to the main repository

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code Style

We use the following tools to maintain code quality:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

### Formatting

Run the formatter before committing:

```bash
npm run format
```

### Linting

Run the linter to catch common issues:

```bash
npm run lint
```

## Testing

We use Jest and React Testing Library for testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run coverage report
npm test -- --coverage
```

### Writing Tests

- Place test files next to the code they test with a `.test.tsx` or `.test.ts` extension
- Test files should be named `ComponentName.test.tsx` for components and `module.test.ts` for utilities
- Use `@testing-library/react` for component testing
- Mock external dependencies when necessary

## Documentation

We value good documentation. When adding new features or modifying existing ones:

1. Update the relevant documentation in the `docs/` directory
2. Add JSDoc comments to new functions and components
3. Update the README if there are any setup or usage changes

## Reporting Bugs

Before creating a bug report, please check if the issue has already been reported.

### How to Report a Bug

1. **Use the GitHub issue search** to check if the issue has already been reported.
2. **Check if the issue has been fixed** by trying to reproduce it using the latest `main` branch in the repository.
3. **Isolate the problem** to make sure the bug is in our code and not in your environment.

A good bug report includes:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or error messages (if applicable)
- Your environment (browser, OS, Node.js version, etc.)

## Feature Requests

We welcome feature requests. Before submitting a feature request:

1. Check if the feature has already been requested
2. Consider if the feature fits within the scope of the project
3. Be specific about the problem you're trying to solve

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
