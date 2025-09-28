# Yuthukama

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/sameeraherath/yuthukama)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](./docs/LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19-blue.svg)](https://reactjs.org/)

A modern full-stack web application built with React and Node.js, featuring real-time communication capabilities and a robust authentication system.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Testing](#testing)
- [User Guide](#user-guide)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

Yuthukama is a comprehensive full-stack web application that demonstrates modern web development practices. Built with React 19 and Node.js, it provides a scalable foundation for real-time applications with features like secure authentication, file management, and responsive design. The application showcases best practices in both frontend and backend development, making it an excellent reference for modern web application architecture.

## Features

- **Real-time Communication**: Bidirectional communication using Socket.IO
- **Secure Authentication**: JWT-based authentication system with bcrypt password hashing
- **File Management**: AWS S3 integration for secure file uploads and storage
- **Responsive Design**: Mobile-first approach with Material-UI and TailwindCSS
- **Form Validation**: Robust form handling with Formik and Yup validation
- **State Management**: Centralized state management using Redux Toolkit
- **Modern Development**: Hot reload development environment with Vite
- **Database Integration**: MongoDB with Mongoose ODM for data persistence
- **Production Ready**: Optimized build process and deployment configuration

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Material-UI (MUI) v6** - Component library for consistent UI
- **Redux Toolkit** - State management solution
- **React Router v7** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Formik & Yup** - Form handling and validation
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **AWS S3** - Cloud file storage service
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing library

### Database
- **MongoDB** - Primary database for application data
- **Mongoose** - ODM for MongoDB integration

### Deployment
- **AWS Elastic Beanstalk** - Application deployment platform
- **AWS S3** - Static file hosting and storage
- **MongoDB Atlas** - Cloud database hosting

## Architecture

For detailed information about the system architecture, design patterns, and technical decisions, please refer to our [Architecture Documentation](./docs/ARCHITECTURE.md).

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **AWS Account** (for S3 integration)
- **npm** or **yarn** package manager

### Step-by-Step Setup

1. **Clone the repository**:
```bash
git clone https://github.com/sameeraherath/yuthukama.git
cd yuthukama
```

2. **Install dependencies**:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Configuration**:

Create a `.env` file in the server directory:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. **Database Setup**:
```bash
# If using local MongoDB
mongod

# Create database indexes (optional)
cd server
npm run setup-db
```

## Usage

### Development Environment

1. **Start the backend server**:
```bash
cd server
npm run dev
```

2. **Start the frontend development server**:
```bash
cd client
npm run dev
```

3. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Production Build

1. **Build the frontend**:
```bash
cd client
npm run build
```

2. **Start the production server**:
```bash
cd server
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |

## API Reference

For comprehensive API documentation including endpoints, request/response formats, and authentication details, see our [API Reference Guide](./docs/API_REFERENCE.md).

## Deployment

For detailed deployment instructions including AWS Elastic Beanstalk setup, environment configuration, and CI/CD pipeline setup, refer to our [Deployment Guide](./docs/DEPLOYMENT.md).

## Testing

For information about our testing strategy, test setup, and how to run tests, see our [Testing Documentation](./docs/TESTING.md).

## User Guide

For end-user documentation and feature walkthroughs, check out our [User Guide](./docs/USER_GUIDE.md).

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details on our code of conduct, development process, and how to submit pull requests.

## Changelog

See [CHANGELOG.md](./docs/CHANGELOG.md) for a detailed list of changes, new features, and bug fixes in each version.

## Troubleshooting

Having issues? Check our [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for common problems and solutions.

## License

This project is licensed under the ISC License. See [LICENSE.md](./docs/LICENSE.md) for details.

---

**Maintainer**: [Sameera Herath](https://github.com/sameeraherath)  
**Contact**: [sameerastar6@gmail.com](mailto:sameerastar6@gmail.com)
