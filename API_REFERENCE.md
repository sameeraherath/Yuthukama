# API Reference

This document provides comprehensive API documentation for the Yuthukama platform, including all endpoints, request/response formats, authentication, and examples.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Posts Endpoints](#posts-endpoints)
- [Chat Endpoints](#chat-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [AI Chat Endpoints](#ai-chat-endpoints)
- [Response Formats](#response-formats)
- [Status Codes](#status-codes)

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend-url.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are sent via HTTP-only cookies or Authorization header.

### Authentication Methods

#### Method 1: HTTP-Only Cookies (Recommended)
```javascript
// Cookies are automatically sent with requests
fetch('/api/users/profile', {
  credentials: 'include'
});
```

#### Method 2: Authorization Header
```javascript
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Getting a Token

```javascript
// Login to get token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Token is automatically set in HTTP-only cookie
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

```javascript
// Rate limit headers in response
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Handling

### Error Response Format

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

Register a new user account.

#### Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Validation Rules

- `username`: Required, 3-30 characters, alphanumeric and underscores only
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### Login User

**POST** `/api/auth/login`

Authenticate user and return JWT token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": "/uploads/profile-pics/default.jpg",
    "isEmailVerified": true
  }
}
```

**Error (401 Unauthorized)**
```json
{
  "message": "Invalid credentials"
}
```

### Logout User

**POST** `/api/auth/logout`

Logout user and clear authentication token.

#### Response

**Success (200 OK)**
```json
{
  "message": "Logged out successfully"
}
```

### Check Authentication

**GET** `/api/auth/check`

Check if user is authenticated and return user data.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": "/uploads/profile-pics/default.jpg",
    "isEmailVerified": true,
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

**Error (401 Unauthorized)**
```json
{
  "message": "Not authorized, no token provided"
}
```

### Forgot Password

**POST** `/api/auth/forgot-password`

Request password reset email.

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Password reset email sent"
}
```

### Reset Password

**POST** `/api/auth/reset-password/:resetToken`

Reset password using token from email.

#### URL Parameters

- `resetToken`: Password reset token from email

#### Request Body

```json
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Password reset successfully"
}
```

**Error (400 Bad Request)**
```json
{
  "message": "Invalid or expired reset token"
}
```

### Change Password

**PUT** `/api/auth/change-password`

Change password for authenticated user.

#### Headers

```
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Password changed successfully"
}
```

## User Management Endpoints

### Get User Profile

**GET** `/api/users/profile`

Get authenticated user's profile.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": "/uploads/profile-pics/user123.jpg",
    "isEmailVerified": true,
    "followers": [],
    "following": [],
    "createdAt": "2023-07-20T10:30:00.000Z"
  }
}
```

### Get User by ID

**GET** `/api/users/:id`

Get user profile by ID.

#### URL Parameters

- `id`: User ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "jane_doe",
    "profilePicture": "/uploads/profile-pics/user456.jpg",
    "followers": ["60f7b3b3b3b3b3b3b3b3b3b4"],
    "following": ["60f7b3b3b3b3b3b3b3b3b3b5"],
    "createdAt": "2023-07-19T15:20:00.000Z"
  }
}
```

### Update Username

**PUT** `/api/users/username`

Update authenticated user's username.

#### Headers

```
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "username": "new_username"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "new_username",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Update Profile Picture

**PUT** `/api/users/profile-pic`

Update authenticated user's profile picture.

#### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body

Form data with `profilePic` file field.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "profilePicture": "https://s3.amazonaws.com/bucket/profile-pics/user123.jpg"
  }
}
```

### Search Users

**GET** `/api/users/search`

Search for users by username or email.

#### Query Parameters

- `query`: Search query (required)
- `role`: Filter by role (optional)
- `limit`: Limit results (optional, default: 20)

#### Example Request

```
GET /api/users/search?query=john&limit=10
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "users": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "john_doe",
      "profilePicture": "/uploads/profile-pics/user123.jpg",
      "followers": 150,
      "following": 75
    }
  ],
  "total": 1
}
```

### Get Recommended Users

**GET** `/api/users/recommended`

Get recommended users to follow.

#### Query Parameters

- `limit`: Limit results (optional, default: 10)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "users": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "username": "jane_doe",
      "profilePicture": "/uploads/profile-pics/user456.jpg",
      "followers": 200,
      "mutualConnections": 5
    }
  ]
}
```

### Follow User

**POST** `/api/users/:id/follow`

Follow a user.

#### URL Parameters

- `id`: User ID to follow

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Successfully followed user",
  "followStatus": true
}
```

### Unfollow User

**DELETE** `/api/users/:id/follow`

Unfollow a user.

#### URL Parameters

- `id`: User ID to unfollow

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Successfully unfollowed user",
  "followStatus": false
}
```

### Get Followers

**GET** `/api/users/:id/followers`

Get user's followers list.

#### URL Parameters

- `id`: User ID

#### Query Parameters

- `limit`: Limit results (optional, default: 20)
- `offset`: Offset for pagination (optional, default: 0)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "followers": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "username": "follower_user",
      "profilePicture": "/uploads/profile-pics/user789.jpg",
      "followedAt": "2023-07-20T12:00:00.000Z"
    }
  ],
  "total": 150,
  "hasMore": true
}
```

### Get Following

**GET** `/api/users/:id/following`

Get user's following list.

#### URL Parameters

- `id`: User ID

#### Query Parameters

- `limit`: Limit results (optional, default: 20)
- `offset`: Offset for pagination (optional, default: 0)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "following": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "username": "following_user",
      "profilePicture": "/uploads/profile-pics/user101.jpg",
      "followedAt": "2023-07-19T14:30:00.000Z"
    }
  ],
  "total": 75,
  "hasMore": true
}
```

### Get Follow Status

**GET** `/api/users/:id/follow-status`

Check if current user is following a specific user.

#### URL Parameters

- `id`: User ID to check

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "isFollowing": true
}
```

### Get User Stats

**GET** `/api/users/:id/stats`

Get user statistics (posts, likes, comments).

#### URL Parameters

- `id`: User ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "stats": {
    "posts": 25,
    "likes": 150,
    "comments": 89,
    "followers": 200,
    "following": 75
  }
}
```

## Posts Endpoints

### Get All Posts

**GET** `/api/posts`

Get all posts with pagination.

#### Query Parameters

- `page`: Page number (optional, default: 1)
- `limit`: Posts per page (optional, default: 20)
- `sortBy`: Sort by field (optional: 'createdAt', 'likes', 'comments')

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "My First Post",
      "description": "This is my first post on Yuthukama!",
      "image": "https://s3.amazonaws.com/bucket/posts/post123.jpg",
      "user": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe",
        "profilePicture": "/uploads/profile-pics/user123.jpg"
      },
      "likes": ["60f7b3b3b3b3b3b3b3b3b3b4"],
      "comments": [
        {
          "id": "60f7b3b3b3b3b3b3b3b3b3b8",
          "content": "Great post!",
          "user": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b4",
            "username": "jane_doe"
          },
          "createdAt": "2023-07-20T15:30:00.000Z"
        }
      ],
      "views": 45,
      "createdAt": "2023-07-20T14:00:00.000Z",
      "updatedAt": "2023-07-20T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Create Post

**POST** `/api/posts`

Create a new post.

#### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body

Form data with:
- `title`: Post title (required)
- `description`: Post description (required)
- `image`: Image file (optional)

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "post": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "title": "My First Post",
    "description": "This is my first post on Yuthukama!",
    "image": "https://s3.amazonaws.com/bucket/posts/post123.jpg",
    "user": "60f7b3b3b3b3b3b3b3b3b3b3",
    "likes": [],
    "comments": [],
    "views": 0,
    "createdAt": "2023-07-20T14:00:00.000Z"
  }
}
```

### Get User Posts

**GET** `/api/posts/user/:userId`

Get all posts by a specific user.

#### URL Parameters

- `userId`: User ID

#### Query Parameters

- `page`: Page number (optional, default: 1)
- `limit`: Posts per page (optional, default: 20)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "User's Post",
      "description": "Post content here",
      "image": "https://s3.amazonaws.com/bucket/posts/post123.jpg",
      "likes": ["60f7b3b3b3b3b3b3b3b3b3b4"],
      "comments": [],
      "views": 25,
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalPosts": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Update Post

**PUT** `/api/posts/:id`

Update a post (only by post owner).

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "Updated Post Title",
  "description": "Updated post description"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "post": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "title": "Updated Post Title",
    "description": "Updated post description",
    "image": "https://s3.amazonaws.com/bucket/posts/post123.jpg",
    "updatedAt": "2023-07-20T16:00:00.000Z"
  }
}
```

### Delete Post

**DELETE** `/api/posts/:id`

Delete a post (only by post owner or admin).

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Post deleted successfully"
}
```

### Toggle Post Like

**PUT** `/api/posts/:id/like`

Like or unlike a post.

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "liked": true,
  "likesCount": 15
}
```

### Save Post

**PUT** `/api/posts/:id/save`

Save or unsave a post.

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "saved": true,
  "message": "Post saved successfully"
}
```

### Add Comment

**POST** `/api/posts/:id/comments`

Add a comment to a post.

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "content": "This is a great post!"
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "comment": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b8",
    "content": "This is a great post!",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "john_doe",
      "profilePicture": "/uploads/profile-pics/user123.jpg"
    },
    "createdAt": "2023-07-20T15:30:00.000Z"
  }
}
```

### Delete Comment

**DELETE** `/api/posts/:id/comments/:commentId`

Delete a comment (only by comment owner or admin).

#### URL Parameters

- `id`: Post ID
- `commentId`: Comment ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Comment deleted successfully"
}
```

### Search Posts

**GET** `/api/posts/search`

Search posts by title, description, or content.

#### Query Parameters

- `query`: Search query (required)
- `category`: Filter by category (optional)
- `sortBy`: Sort by field (optional: 'createdAt', 'likes', 'comments')
- `limit`: Limit results (optional, default: 20)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "Search Result Post",
      "description": "This post matches your search query",
      "user": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe"
      },
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ],
  "total": 5
}
```

### Get Trending Posts

**GET** `/api/posts/trending`

Get trending/popular posts.

#### Query Parameters

- `limit`: Limit results (optional, default: 20)
- `days`: Consider posts from last N days (optional, default: 7)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "Trending Post",
      "description": "This post is trending!",
      "likes": ["60f7b3b3b3b3b3b3b3b3b3b4", "60f7b3b3b3b3b3b3b3b3b3b5"],
      "comments": [],
      "views": 500,
      "trendingScore": 85.5,
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ]
}
```

### Get Saved Posts

**GET** `/api/posts/saved`

Get user's saved posts.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "Saved Post",
      "description": "This is a saved post",
      "user": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe"
      },
      "savedAt": "2023-07-20T16:00:00.000Z",
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ]
}
```

### Get Following Posts

**GET** `/api/posts/following`

Get posts from users that the current user follows.

#### Query Parameters

- `limit`: Limit results (optional, default: 20)
- `page`: Page number (optional, default: 1)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "Post from Followed User",
      "description": "Content from someone you follow",
      "user": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "username": "jane_doe"
      },
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalPosts": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get For You Posts

**GET** `/api/posts/for-you`

Get personalized "For You" feed with algorithmic recommendations.

#### Query Parameters

- `limit`: Limit results (optional, default: 20)
- `page`: Page number (optional, default: 1)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "posts": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "title": "Recommended Post",
      "description": "This post is recommended for you",
      "user": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b6",
        "username": "recommended_user"
      },
      "recommendationScore": 0.85,
      "createdAt": "2023-07-20T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalPosts": 200,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Report Post

**POST** `/api/posts/:id/report`

Report a post for inappropriate content.

#### URL Parameters

- `id`: Post ID

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "reason": "inappropriate",
  "description": "This post contains inappropriate content"
}
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Post reported successfully"
}
```

## Chat Endpoints

### Get User Conversations

**GET** `/api/chat`

Get all conversations for the authenticated user.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b9",
      "participants": [
        {
          "id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "username": "john_doe",
          "profilePicture": "/uploads/profile-pics/user123.jpg"
        },
        {
          "id": "60f7b3b3b3b3b3b3b3b3b3b4",
          "username": "jane_doe",
          "profilePicture": "/uploads/profile-pics/user456.jpg"
        }
      ],
      "lastMessage": "Hello! How are you?",
      "lastMessageTimestamp": "2023-07-20T16:30:00.000Z",
      "unreadCount": 2,
      "createdAt": "2023-07-20T10:00:00.000Z"
    }
  ]
}
```

### Get or Create Conversation

**GET** `/api/chat/user/:receiverId`

Get or create a conversation with another user.

#### URL Parameters

- `receiverId`: ID of the other user

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "conversation": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "participants": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe",
        "profilePicture": "/uploads/profile-pics/user123.jpg"
      },
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "username": "jane_doe",
        "profilePicture": "/uploads/profile-pics/user456.jpg"
      }
    ],
    "createdAt": "2023-07-20T10:00:00.000Z"
  }
}
```

### Get Conversation Messages

**GET** `/api/chat/:conversationId/messages`

Get all messages in a conversation.

#### URL Parameters

- `conversationId`: Conversation ID

#### Query Parameters

- `page`: Page number (optional, default: 1)
- `limit`: Messages per page (optional, default: 50)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "messages": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3ba",
      "text": "Hello! How are you?",
      "sender": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe",
        "profilePicture": "/uploads/profile-pics/user123.jpg"
      },
      "read": false,
      "readAt": null,
      "reactions": [],
      "createdAt": "2023-07-20T16:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalMessages": 75,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Send Message

**POST** `/api/chat/messages`

Send a message with optional file attachment.

#### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body

Form data with:
- `conversationId`: Conversation ID (required)
- `text`: Message text (required if no file)
- `file`: File attachment (optional)

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": {
    "id": "60f7b3b3b3b3b3b3b3b3b3ba",
    "text": "Hello! How are you?",
    "sender": "60f7b3b3b3b3b3b3b3b3b3b3",
    "conversationId": "60f7b3b3b3b3b3b3b3b3b3b9",
    "read": false,
    "attachment": null,
    "createdAt": "2023-07-20T16:30:00.000Z"
  }
}
```

### Edit Message

**PUT** `/api/chat/messages/:messageId`

Edit a message (only by message sender).

#### URL Parameters

- `messageId`: Message ID

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "text": "Updated message text"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": {
    "id": "60f7b3b3b3b3b3b3b3b3b3ba",
    "text": "Updated message text",
    "edited": true,
    "editedAt": "2023-07-20T16:35:00.000Z"
  }
}
```

### Delete Message

**DELETE** `/api/chat/messages/:messageId`

Delete a message (only by message sender).

#### URL Parameters

- `messageId`: Message ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Message deleted successfully"
}
```

### Mark Messages as Read

**PUT** `/api/chat/:conversationId/read`

Mark all messages in a conversation as read.

#### URL Parameters

- `conversationId`: Conversation ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Messages marked as read"
}
```

### Get Unread Count

**GET** `/api/chat/:conversationId/unread-count`

Get unread message count for a conversation.

#### URL Parameters

- `conversationId`: Conversation ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "unreadCount": 5
}
```

## Notification Endpoints

### Get User Notifications

**GET** `/api/notifications`

Get user's notifications.

#### Query Parameters

- `page`: Page number (optional, default: 1)
- `limit`: Notifications per page (optional, default: 20)
- `type`: Filter by notification type (optional)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3bb",
      "type": "like",
      "content": "liked your post",
      "sender": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "username": "jane_doe",
        "profilePicture": "/uploads/profile-pics/user456.jpg"
      },
      "relatedPost": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "title": "My Post"
      },
      "isRead": false,
      "createdAt": "2023-07-20T17:00:00.000Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalNotifications": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Mark Notification as Read

**PATCH** `/api/notifications/:id/read`

Mark a specific notification as read.

#### URL Parameters

- `id`: Notification ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Notification marked as read"
}
```

### Mark All Notifications as Read

**PATCH** `/api/notifications/mark-all-read`

Mark all notifications as read.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "All notifications marked as read"
}
```

### Delete Notification

**DELETE** `/api/notifications/:id`

Delete a specific notification.

#### URL Parameters

- `id`: Notification ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "Notification deleted successfully"
}
```

### Delete All Notifications

**DELETE** `/api/notifications`

Delete all notifications.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "All notifications deleted successfully"
}
```

## Admin Endpoints

### Get Dashboard Stats

**GET** `/api/admin/dashboard-stats`

Get comprehensive dashboard statistics.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 1250,
      "active": 1100,
      "newThisMonth": 150
    },
    "posts": {
      "total": 5000,
      "thisMonth": 500,
      "reported": 25
    },
    "messages": {
      "total": 15000,
      "today": 150
    },
    "system": {
      "uptime": "99.9%",
      "responseTime": "120ms",
      "storage": "2.5GB"
    }
  }
}
```

### Get All Users

**GET** `/api/admin/users`

Get all users with pagination and filtering.

#### Query Parameters

- `page`: Page number (optional, default: 1)
- `limit`: Users per page (optional, default: 20)
- `role`: Filter by role (optional)
- `search`: Search by username or email (optional)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "users": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "posts": 25,
      "followers": 200,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "lastActive": "2023-07-20T18:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalUsers": 1250,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Update User

**PUT** `/api/admin/users/:userId`

Update user information (admin only).

#### URL Parameters

- `userId`: User ID

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "role": "admin",
  "isEmailVerified": true
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin",
    "isEmailVerified": true
  }
}
```

### Delete User

**DELETE** `/api/admin/users/:userId`

Delete a user (admin only).

#### URL Parameters

- `userId`: User ID

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "message": "User deleted successfully"
}
```

### Get Analytics

**GET** `/api/admin/analytics`

Get detailed analytics data.

#### Query Parameters

- `period`: Time period (optional: 'day', 'week', 'month', 'year')
- `startDate`: Start date (optional)
- `endDate`: End date (optional)

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "analytics": {
    "userGrowth": [
      {
        "date": "2023-07-20",
        "newUsers": 15,
        "totalUsers": 1250
      }
    ],
    "postActivity": [
      {
        "date": "2023-07-20",
        "posts": 25,
        "likes": 150,
        "comments": 45
      }
    ],
    "engagement": {
      "avgPostsPerUser": 4.2,
      "avgLikesPerPost": 12.5,
      "avgCommentsPerPost": 3.8
    }
  }
}
```

## AI Chat Endpoints

### Send AI Message

**POST** `/api/chat/ai-message`

Send a message to the AI assistant.

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "message": "What is the best way to learn React?",
  "conversationId": "60f7b3b3b3b3b3b3b3b3b3bc"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "response": "Learning React effectively involves several key steps:\n\n1. **Start with JavaScript fundamentals** - Make sure you understand ES6+ features like arrow functions, destructuring, and modules.\n\n2. **Learn React basics** - Start with components, JSX, props, and state.\n\n3. **Practice with projects** - Build small projects to apply what you learn.\n\n4. **Use official documentation** - The React docs are excellent and regularly updated.\n\n5. **Join the community** - Participate in forums, Discord servers, and local meetups.\n\nWould you like me to elaborate on any of these points?",
  "conversationId": "60f7b3b3b3b3b3b3b3b3b3bc",
  "timestamp": "2023-07-20T18:30:00.000Z"
}
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "hasNext": true,
    "hasPrev": false,
    "limit": 20
  }
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

For interactive API documentation, visit `/api-docs` when running the server locally or in production.
