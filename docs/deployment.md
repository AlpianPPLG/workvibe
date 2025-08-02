# Deployment Guide

This guide provides instructions for deploying the Team Management application to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel)
  - [Docker](#docker)
  - [Self-Hosted](#self-hosted)
- [CI/CD Setup](#cicd-setup)
- [Environment Configuration](#environment-configuration)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- Git installed
- An account on your chosen deployment platform
- Database credentials and connection string
- Any required API keys

## Environment Variables

Create a `.env.production` file in the root directory with the following variables:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-production-url.com

# Authentication
NEXTAUTH_SECRET=generate-a-secure-secret
NEXTAUTH_URL=https://your-production-url.com

# Database
DATABASE_URL=your-database-connection-string

# Email (if using email features)
EMAIL_SERVER=smtp://user:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

> **Security Note:** Never commit `.env` files to version control. Add them to `.gitignore`.

## Deployment Options

### Vercel (Recommended)

1. **Install Vercel CLI** (if deploying manually)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add all variables from `.env.production`

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t team-management .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL=your-db-connection \
     team-management
   ```

### Self-Hosted

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## CI/CD Setup

### GitHub Actions

1. Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          vercel-args: '--prod'
```

## Environment Configuration

### Staging Environment

1. Create a new Vercel project for staging
2. Set `NEXT_PUBLIC_APP_URL` to your staging URL
3. Use a separate database for staging
4. Configure environment-specific API keys

### Production Environment

1. Set up a custom domain
2. Enable HTTPS
3. Configure backups for your database
4. Set up monitoring and alerting

## Scaling

### Vertical Scaling

- Upgrade your server resources (CPU, RAM)
- Use a more powerful database instance

### Horizontal Scaling

- Use multiple instances behind a load balancer
- Configure a CDN for static assets
- Use a managed database service

## Monitoring

### Recommended Tools

- **Application Monitoring**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Web Vitals
- **Uptime**: UptimeRobot, Better Stack
- **Logs**: Papertrail, LogDNA

### Setting Up Monitoring

1. **Error Tracking**
   - Sign up for a Sentry account
   - Add the Sentry SDK to your project
   - Configure error boundaries in your React components

2. **Performance Monitoring**
   - Enable Vercel Analytics
   - Set up Web Vitals tracking
   - Monitor API response times

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify connection string
   - Check if the database is running
   - Ensure proper network access

2. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Restart the server after changing variables

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Getting Help

If you encounter issues:

1. Check the application logs
2. Search the [GitHub issues](https://github.com/yourusername/team-management/issues)
3. Open a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
