# Yuthukama

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/sameeraherath/yuthukama)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8+-blue.svg)](https://socket.io/)

A comprehensive social media and mentorship platform built with modern web technologies, featuring real-time communication, AI-powered assistance, and community building tools.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

Yuthukama is a modern full-stack social media and mentorship platform designed to connect communities through meaningful interactions. Built with React 19 and Node.js, it provides a comprehensive ecosystem for users to share knowledge, engage in real-time conversations, and participate in mentorship programs.

### Vision
To create a platform where knowledge sharing, mentorship, and community building thrive through innovative technology and user-centric design.

### Key Highlights
- **Real-time Communication**: Instant messaging with advanced features like typing indicators, read receipts, and message reactions
- **AI Integration**: Powered by Gemini AI for intelligent assistance and chatbot functionality
- **Social Features**: Complete social media experience with posts, likes, comments, follows, and personalized feeds
- **Mentorship Program**: Dedicated features for connecting mentors and mentees
- **Admin Dashboard**: Comprehensive analytics and user management tools
- **Mobile-First Design**: Responsive interface optimized for all devices

## Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Password Security**: Bcrypt hashing with salt rounds for password protection
- **Password Reset**: Email-based password recovery system
- **Role-based Access**: User and admin role management
- **Rate Limiting**: Protection against brute force attacks

### 💬 Real-time Communication
- **Instant Messaging**: 1-on-1 conversations with Socket.IO
- **Typing Indicators**: Real-time typing status display
- **Read Receipts**: Message read status tracking
- **Message Reactions**: Emoji reactions on messages
- **File Attachments**: Support for images, documents, and media files
- **Online Status**: Real-time user presence indicators

### 🤖 AI-Powered Features
- **AI Chatbot**: Intelligent assistant powered by Gemini AI
- **Mentorship Support**: AI-assisted guidance and recommendations

### 📱 Social Media Features
- **Post Creation**: Rich text posts with image support
- **Engagement**: Users can like and comment on posts.
- **Follow System**: Follow/unfollow users with notifications
- **Personalized Feeds**: "For You" and "Following" feed algorithms
- **Trending Posts**: Popular content discovery
- **Saved Posts**: Bookmark posts for later reference
- **Advanced Search**: Search posts by content

### 👥 Community & Mentorship
- **User Profiles**: Simple user profiles with essential details
- **Follower System**: Social connections and networking
- **Event Announcements**: Community event notifications

### 🔔 Notifications System
- **Real-time Notifications**: Instant notification delivery
- **Multiple Types**: Likes, comments, follows, mentions, messages

### 📊 Admin Features
- **Dashboard Analytics**: Comprehensive platform statistics
- **User Management**: Admin tools for user oversight
- **Content Moderation**: Post and user management tools

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Material-UI
- **Performance Optimization**: Fast loading and smooth interactions

## Tech Stack

### Frontend Technologies
- **React 19** - Latest React with concurrent features and improved performance
- **Redux Toolkit** - Redux Toolkit – Centralized state management (auth, posts, chat) with thunk-based API integration
- **React Router v7** - Declarative routing with data loading capabilities
- **Material-UI (MUI) v6** - Comprehensive component library with theming
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **Socket.IO Client** - Real-time bidirectional communication
- **Formik & Yup** - Form handling with validation schema
- **Framer Motion** - Animation library for smooth interactions
- **Date-fns** - Modern date utility library
- **Recharts** - Data visualization and analytics charts
- **Vite** - Fast build tool with hot module replacement

### Backend Technologies
- **Node.js** - JavaScript runtime with ES modules support
- **Express.js** - Minimal web framework with middleware support
- **Socket.IO** - Real-time communication with room management
- **MongoDB** - NoSQL document database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling with validation
- **JWT** - JSON Web Tokens for stateless authentication
- **Bcrypt** - Password hashing with salt rounds
- **Multer** - File upload handling with memory storage
- **Helmet** - Security middleware for HTTP headers
- **CORS** - Cross-origin resource sharing configuration
- **Express Rate Limit** - Rate limiting middleware for API protection
- **Swagger/OpenAPI** - API documentation and testing

### Cloud & External Services
- **AWS S3** - Scalable object storage for file uploads
- **Gemini AI** - Google's AI model for chatbot functionality
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Vercel** - Frontend deployment and hosting platform
- **AWS EC2** - Virtual servers for hosting and running backend application

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting (via ESLint integration)
- **Nodemon** - Development server with auto-restart
- **PostCSS** - CSS processing with TailwindCSS
- **Autoprefixer** - CSS vendor prefix automation

## Architecture

### System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React 19)    │    │   (Node.js)     │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React Router  │◄──►│ • Express.js    │◄──►│ • MongoDB Atlas │
│ • Redux Toolkit │    │ • Socket.IO     │    │ • AWS S3        │
│ • Material-UI   │    │ • Mongoose      │    │ • Gemini AI     │
│ • Socket.IO     │    │ • JWT Auth      │    │ • Email Service │
│ • TailwindCSS   │    │ • Rate Limiting │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── articles/       # Article-related components
│   ├── chat/          # Chat and messaging components
│   ├── LoadingStates/ # Loading and skeleton components
│   └── Toast/         # Notification components
├── features/          # Redux feature slices
│   ├── auth/          # Authentication state management
│   ├── chat/          # Chat state management
│   ├── notifications/ # Notification state management
│   ├── posts/         # Posts state management
│   └── ui/            # UI state management
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── pages/             # Page components
├── store/             # Redux store configuration
├── theme/             # Material-UI theme configuration
└── utils/             # Utility functions and helpers
```

### Backend Architecture

```
server/
├── config/            # Configuration files
│   ├── config.js     # Environment configuration
│   ├── db.js         # Database connection
│   └── swagger.js    # API documentation setup
├── controllers/       # Route handlers and business logic
├── middleware/       # Custom middleware functions
├── models/           # Mongoose data models
├── routes/           # Express route definitions
├── utils/            # Utility functions and helpers
└── server.js         # Main server entry point
```

### Data Flow Architecture

1. **Authentication Flow**:
   - User login → JWT token generation → Token storage in HTTP-only cookies
   - Protected routes → Token validation → User context

2. **Real-time Communication**:
   - Socket.IO connection → User authentication → Room management
   - Message events → Database persistence → Real-time broadcasting

3. **State Management**:
   - Redux Toolkit slices → API calls → State updates → Component re-renders
   - RTK Query for caching and synchronization

4. **File Upload Flow**:
   - Client upload → Multer processing → AWS S3 storage → Database URL storage

### Security Architecture

- **Authentication**: JWT tokens with HTTP-only cookies
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Per-IP request limiting for API protection
- **CORS**: Configured for specific origins
- **Helmet**: Security headers for XSS and CSRF protection
- **Input Validation**: Express-validator for request validation
- **Password Security**: Bcrypt with salt rounds

## Installation

### Prerequisites

Before installing Yuthukama, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### Optional Prerequisites

- **AWS Account** - For S3 file storage integration
- **Google Cloud Account** - For Gemini AI integration
- **Email Service** - For password reset and verification emails

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/sameeraherath/yuthukama.git
cd yuthukama
```

2. **Install Frontend Dependencies**
```bash
cd client
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../server
npm install
```

4. **Environment Configuration**

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yuthukama
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/yuthukama

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

5. **Database Setup**

For local MongoDB:
```bash
# Start MongoDB service
mongod

# Or using MongoDB Compass for GUI management
```

For MongoDB Atlas:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in `.env`

6. **Verify Installation**

Start the development servers:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## Environment Variables

For detailed information about all environment variables, see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/yuthukama` |
| `JWT_SECRET` | Secret key for JWT token signing | `your_super_secret_key_minimum_32_chars` |
| `PORT` | Server port number | `5000` |

### Optional Variables

| Variable | Description | Default | Required For |
|----------|-------------|---------|--------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | - | File uploads |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | - | File uploads |
| `AWS_REGION` | AWS region for S3 | `us-east-1` | File uploads |
| `AWS_S3_BUCKET` | S3 bucket name | - | File uploads |
| `GEMINI_API_KEY` | Google Gemini AI API key | - | AI chatbot |
| `EMAIL_HOST` | SMTP server host | - | Email features |
| `EMAIL_PORT` | SMTP server port | `587` | Email features |
| `EMAIL_USER` | SMTP username | - | Email features |
| `EMAIL_PASS` | SMTP password | - | Email features |

## Usage

### Development Environment

1. **Start the Backend Server**
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:5000`

2. **Start the Frontend Development Server**
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

3. **Access the Application**
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`
   - **API Documentation**: `http://localhost:5000/api-docs`

### Production Build

1. **Build the Frontend**
```bash
cd client
npm run build
```

2. **Start the Production Server**
```bash
cd server
npm start
```

### Available Scripts

#### Frontend Scripts (client/)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

#### Backend Scripts (server/)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |

### Application Features Usage

#### User Registration and Authentication
1. Visit the landing page at `http://localhost:5173`
2. Click "Sign Up" to create a new account
3. Fill in username, email, and password
4. Verify your email (if email service is configured)
5. Login with your credentials

#### Social Media Features
- **Create Posts**: Click the "+" button on the home screen
- **Like Posts**: Click the heart icon on any post
- **Comment**: Click the comment icon and add your thoughts
- **Follow Users**: Visit user profiles and click "Follow"
- **Save Posts**: Click the bookmark icon to save posts

#### Real-time Chat
- **Start Conversations**: Click on user profiles and select "Message"
- **Send Messages**: Type in the chat input and press Enter
- **File Attachments**: Click the attachment icon to send files
- **Message Reactions**: Hover over messages and click the reaction button

#### AI Chatbot
- **Access AI**: Click the AI assistant icon in the navigation
- **Ask Questions**: Type your questions and get AI-powered responses
- **Mentorship Support**: Ask for guidance on various topics

## API Documentation

### Interactive API Documentation

The application includes comprehensive API documentation powered by Swagger/OpenAPI:

- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-backend-url.com/api-docs`

### API Endpoints Overview

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/change-password` - Change password

#### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/username` - Update username
- `PUT /api/users/profile-pic` - Update profile picture
- `GET /api/users/search` - Search users
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

#### Posts Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/user/:userId` - Get user's posts
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Toggle post like
- `POST /api/posts/:id/comments` - Add comment

#### Chat Endpoints
- `GET /api/chat` - Get user conversations
- `GET /api/chat/user/:receiverId` - Get/create conversation
- `GET /api/chat/:conversationId/messages` - Get messages
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/:messageId` - Edit message
- `DELETE /api/chat/messages/:messageId` - Delete message

#### Admin Endpoints
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user
- `DELETE /api/admin/users/:userId` - Delete user

For detailed API documentation with request/response examples, see [API_REFERENCE.md](./API_REFERENCE.md).

## WebSocket Events

The application uses Socket.IO for real-time communication. For detailed WebSocket event documentation, see [WEBSOCKET_EVENTS.md](./WEBSOCKET_EVENTS.md).

### Key WebSocket Events

#### Client to Server Events
- `authenticate` - Authenticate user with Socket.IO
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `typing` - Indicate user is typing
- `stop_typing` - Stop typing indicator
- `add_reaction` - Add reaction to message
- `mark_message_read` - Mark message as read

#### Server to Client Events
- `receive_message` - Receive new message
- `message_delivered` - Message delivery confirmation
- `message_read` - Message read confirmation
- `typing` - User typing indicator
- `stop_typing` - Stop typing indicator
- `user_status_change` - User online/offline status
- `message_reaction` - Message reaction update

## Development

### Development Workflow

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/yuthukama.git
cd yuthukama
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**
   - Follow the coding standards outlined in [CONTRIBUTING.md](./CONTRIBUTING.md)
   - Write tests for new features
   - Update documentation as needed

4. **Test Your Changes**
```bash
# Frontend tests
cd client
npm run lint

# Backend tests
cd ../server
npm run lint
```

5. **Commit and Push**
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

6. **Create Pull Request**
   - Open a pull request on GitHub
   - Follow the PR template
   - Request review from maintainers

### Code Structure Guidelines

#### Frontend Structure
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Page-level components in `src/pages/`
- **Features**: Redux slices in `src/features/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Utils**: Utility functions in `src/utils/`

#### Backend Structure
- **Controllers**: Business logic in `server/controllers/`
- **Models**: Database models in `server/models/`
- **Routes**: API routes in `server/routes/`
- **Middleware**: Custom middleware in `server/middleware/`
- **Utils**: Utility functions in `server/utils/`

### Testing

#### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd ../server
npm test
```

#### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Overview

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

#### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong secret key for production
- `AWS_ACCESS_KEY_ID` - AWS credentials for file uploads
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - S3 bucket name
- `GEMINI_API_KEY` - AI service API key

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information about:

- Code of conduct
- Development workflow
- Coding standards
- Pull request process
- Issue reporting
- Community guidelines

### Quick Contribution Guide

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests**
5. **Update documentation**
6. **Submit a pull request**

## License

This project is licensed under the ISC License. See [LICENSE.md](./LICENSE.md) for details.

## Support

### Getting Help

- **Documentation**: Check the comprehensive documentation in this repository
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/sameeraherath/yuthukama/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/sameeraherath/yuthukama/discussions)

### Contact Information

- **Maintainer**: [Sameera Herath](https://github.com/sameeraherath)
- **Email**: [sameerastar6@gmail.com](mailto:sameerastar6@gmail.com)
- **Project Repository**: [https://github.com/sameeraherath/yuthukama](https://github.com/sameeraherath/yuthukama)

### Community

- **Discord**: [Join our Discord server](https://discord.gg/yuthukama) (if available)
- **Twitter**: [@Yuthukama](https://twitter.com/yuthukama) (if available)
- **LinkedIn**: [Yuthukama Page](https://linkedin.com/company/yuthukama) (if available)

---

**Thank you for using Yuthukama!** 🚀
