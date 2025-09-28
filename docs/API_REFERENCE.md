# API Reference

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

## User Endpoints

### GET /users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "avatar_url",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "bio": "Updated bio"
    }
  }
}
```

### POST /users/change-password
Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## File Upload Endpoints

### POST /files/upload
Upload a file to AWS S3.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: <binary-file-data>
category: "profile" | "document" | "image"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_id",
      "filename": "example.jpg",
      "originalName": "my-photo.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "url": "https://s3-bucket-url/file-path",
      "category": "image",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### GET /files
Get user's uploaded files.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file_id",
        "filename": "example.jpg",
        "originalName": "my-photo.jpg",
        "mimetype": "image/jpeg",
        "size": 1024000,
        "url": "https://s3-bucket-url/file-path",
        "category": "image",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### DELETE /files/:fileId
Delete a file.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Real-time Events (Socket.IO)

### Connection
Connect to Socket.IO server with JWT authentication:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Client to Server Events

**join_room**
```javascript
socket.emit('join_room', {
  roomId: 'room_123'
});
```

**leave_room**
```javascript
socket.emit('leave_room', {
  roomId: 'room_123'
});
```

**send_message**
```javascript
socket.emit('send_message', {
  roomId: 'room_123',
  message: 'Hello, world!',
  type: 'text'
});
```

#### Server to Client Events

**user_connected**
```javascript
socket.on('user_connected', (data) => {
  console.log('User connected:', data.userId);
});
```

**user_disconnected**
```javascript
socket.on('user_disconnected', (data) => {
  console.log('User disconnected:', data.userId);
});
```

**new_message**
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
  // data structure:
  // {
  //   id: 'message_id',
  //   roomId: 'room_123',
  //   userId: 'user_id',
  //   message: 'Hello, world!',
  //   type: 'text',
  //   timestamp: '2024-01-01T00:00:00.000Z'
  // }
});
```

**room_joined**
```javascript
socket.on('room_joined', (data) => {
  console.log('Joined room:', data.roomId);
});
```

**error**
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_EMAIL` | Email already exists |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `TOKEN_EXPIRED` | JWT token has expired |
| `FILE_TOO_LARGE` | File size exceeds limit |
| `INVALID_FILE_TYPE` | File type not allowed |
| `UPLOAD_FAILED` | File upload failed |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **File upload endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (starting from 1)
- `limit`: Number of items per page (max 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict |
| `422` | Validation Error |
| `429` | Too Many Requests |
| `500` | Internal Server Error |

## SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Upload file
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', 'image');
  
  const response = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    setToken(response.data.data.token);
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  };
  
  return { api, login, token };
};
```
