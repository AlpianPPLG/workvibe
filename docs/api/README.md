# API Documentation

This document provides a comprehensive guide to the Team Management API, covering authentication, endpoints, request/response formats, and error handling.

## Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#users-endpoints)
  - [Teams](#teams-endpoints)
  - [Tasks](#tasks-endpoints)
- [Pagination](#pagination)
- [Filtering & Sorting](#filtering--sorting)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

All API endpoints (except public ones) require authentication. The API uses JWT (JSON Web Tokens) for authentication.

### Obtaining a Token

1. Send a POST request to `/api/auth/login` with email and password
2. The response will include an `accessToken`
3. Include this token in the `Authorization` header for subsequent requests

```http
Authorization: Bearer your-access-token-here
```

## Base URL

All API endpoints are prefixed with `/api`.

- Development: `http://localhost:3000/api`
- Production: `https://your-production-url.com/api`

## Endpoints

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "your-jwt-token"
}
```

### Users Endpoints

#### Get Current User

```http
GET /api/users/me
```

**Response:**
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "user@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Teams Endpoints

#### Get All Teams

```http
GET /api/teams
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (e.g., `name`, `createdAt`)
- `order` - Sort order (`asc` or `desc`)

**Response:**
```json
{
  "data": [
    {
      "id": "team-123",
      "name": "Development Team",
      "description": "Frontend development team",
      "members": ["user-123", "user-456"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Tasks Endpoints

#### Create Task

```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Set up JWT authentication",
  "status": "todo",
  "assigneeId": "user-123",
  "teamId": "team-123"
}
```

**Response:**
```json
{
  "id": "task-123",
  "title": "Implement user authentication",
  "description": "Set up JWT authentication",
  "status": "todo",
  "assigneeId": "user-123",
  "teamId": "team-123",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

The API is rate limited to prevent abuse. By default, the limit is set to 100 requests per 15 minutes per IP address.

**Headers included in rate-limited responses:**
- `X-RateLimit-Limit` - Request limit per time window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Time when the rate limit resets (Unix timestamp)
