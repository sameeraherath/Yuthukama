# Deployment Guide

This guide provides comprehensive instructions for deploying the Yuthukama platform to various hosting services.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [Domain Configuration](#domain-configuration)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)

## Overview

The Yuthukama platform consists of:

- **Frontend**: React application (deployed to Vercel)
- **Backend**: Node.js/Express API (deployed to Railway/Heroku)
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: AWS S3 (for images and files)
- **AI Service**: Google Gemini API

## Prerequisites

Before deploying, ensure you have:

- **GitHub Account**: For repository hosting
- **Vercel Account**: For frontend deployment
- **Railway/Heroku Account**: For backend deployment
- **MongoDB Atlas Account**: For database hosting
- **AWS Account**: For S3 file storage
- **Google Cloud Account**: For Gemini AI API
- **Domain Name**: (optional) For custom domain

## Environment Setup

### Required Environment Variables

Create a comprehensive `.env` file for production:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yuthukama?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long

# Server Configuration
PORT=5000
NODE_ENV=production

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket-name

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Backend URL
BACKEND_URL=https://your-backend-domain.railway.app
```

### Security Considerations

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
2. **Database Credentials**: Use strong passwords and enable IP whitelisting
3. **AWS Credentials**: Use IAM roles with minimal required permissions
4. **API Keys**: Store securely and rotate regularly
5. **Environment Variables**: Never commit to version control

## Frontend Deployment

### Vercel Deployment

Vercel is the recommended platform for frontend deployment due to its excellent React support and automatic deployments.

#### Step 1: Prepare Frontend for Production

1. **Update API URLs**:
```javascript
// client/src/utils/axiosConfig.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.railway.app'
  : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

2. **Update Socket.IO URL**:
```javascript
// client/src/services/socketService.js
const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain.railway.app'
  : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});
```

3. **Build Optimization**:
```javascript
// client/vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
```

#### Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` folder as root directory

2. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the following variables:
   ```
   VITE_API_URL=https://your-backend-domain.railway.app
   VITE_SOCKET_URL=https://your-backend-domain.railway.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-project.vercel.app`

#### Step 3: Custom Domain (Optional)

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### Alternative: Netlify Deployment

If you prefer Netlify:

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

3. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add your environment variables

## Backend Deployment

### Railway Deployment

Railway is recommended for its simplicity and excellent Node.js support.

#### Step 1: Prepare Backend for Production

1. **Update CORS Configuration**:
```javascript
// server/server.js
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://your-frontend-domain.vercel.app",
  "https://your-custom-domain.com"
];
```

2. **Add Health Check Endpoint**:
```javascript
// server/server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

3. **Optimize for Production**:
```javascript
// server/server.js
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
}
```

#### Step 2: Deploy to Railway

1. **Connect Repository**:
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
   - Go to Variables tab
   - Add all required environment variables from the list above

4. **Deploy**:
   - Railway will automatically deploy on every push to main branch
   - Your API will be available at `https://your-project.railway.app`

#### Step 3: Custom Domain (Optional)

1. **Add Domain**:
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Alternative: Heroku Deployment

If you prefer Heroku:

1. **Install Heroku CLI**:
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

2. **Create Heroku App**:
```bash
# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox
```

3. **Configure Environment Variables**:
```bash
# Set environment variables
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set AWS_ACCESS_KEY_ID=your_aws_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret
heroku config:set AWS_S3_BUCKET=your_bucket_name
heroku config:set GEMINI_API_KEY=your_gemini_key
```

4. **Deploy**:
```bash
# Deploy to Heroku
git push heroku main
```

### Alternative: DigitalOcean App Platform

For more control and better performance:

1. **Create App**:
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Source**: GitHub repository
   - **Type**: Web Service
   - **Source Directory**: `/server`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`

3. **Set Environment Variables**:
   - Add all required environment variables

4. **Deploy**:
   - Click "Create Resources"
   - Wait for deployment to complete

## Database Setup

### MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Choose appropriate tier (M0 for development, M10+ for production)

2. **Configure Security**:
   - Create database user with read/write permissions
   - Set up IP whitelist (add 0.0.0.0/0 for Railway/Heroku)
   - Enable authentication

3. **Get Connection String**:
   - Go to Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Production Optimizations**:
   - Enable automatic backups
   - Set up monitoring alerts
   - Configure indexes for performance

### Database Indexes

Create the following indexes for optimal performance:

```javascript
// User collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })

// Post collection
db.posts.createIndex({ "user": 1, "createdAt": -1 })
db.posts.createIndex({ "createdAt": -1 })
db.posts.createIndex({ "likes": 1 })
db.posts.createIndex({ "title": "text", "description": "text" })

// Message collection
db.messages.createIndex({ "conversationId": 1, "createdAt": -1 })
db.messages.createIndex({ "sender": 1 })
db.messages.createIndex({ "read": 1, "sender": 1 })

// Conversation collection
db.conversations.createIndex({ "participants": 1 })
db.conversations.createIndex({ "lastMessageTimestamp": -1 })

// Notification collection
db.notifications.createIndex({ "recipient": 1, "isRead": 1 })
db.notifications.createIndex({ "createdAt": -1 })
```

## Domain Configuration

### Custom Domain Setup

1. **Purchase Domain**:
   - Buy domain from registrar (Namecheap, GoDaddy, etc.)
   - Ensure DNS management access

2. **Configure DNS**:
   - **Frontend (Vercel)**:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     
     Type: A
     Name: @
     Value: 76.76.19.61
     ```

   - **Backend (Railway)**:
     ```
     Type: CNAME
     Name: api
     Value: your-app.railway.app
     ```

3. **Update Application URLs**:
   - Update CORS origins in backend
   - Update API URLs in frontend
   - Update environment variables

## SSL/HTTPS Setup

### Automatic SSL (Recommended)

Most platforms provide automatic SSL certificates:

- **Vercel**: Automatic Let's Encrypt certificates
- **Railway**: Automatic SSL for custom domains
- **Heroku**: Automatic SSL for paid dynos

### Manual SSL Setup

If you need manual SSL setup:

1. **Generate Certificate**:
```bash
# Using Let's Encrypt
sudo certbot certonly --manual -d yourdomain.com
```

2. **Configure Server**:
```javascript
// server/server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

## Monitoring and Logging

### Application Monitoring

1. **Health Checks**:
```javascript
// server/server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

2. **Error Tracking**:
```javascript
// Install Sentry
npm install @sentry/node

// server/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.requestHandler());
app.use(Sentry.errorHandler());
```

3. **Performance Monitoring**:
```javascript
// Install New Relic
npm install newrelic

// server/newrelic.js
'use strict';
exports.config = {
  app_name: ['Yuthukama API'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  distributed_tracing: {
    enabled: true
  }
};
```

### Logging Setup

1. **Structured Logging**:
```javascript
// server/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

2. **Log Rotation**:
```bash
# Install logrotate
sudo apt-get install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/yuthukama
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Frontend can't connect to backend API

**Solution**:
```javascript
// server/server.js
const allowedOrigins = [
  "https://your-frontend-domain.vercel.app",
  "https://your-custom-domain.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));
```

#### 2. Database Connection Issues

**Problem**: Can't connect to MongoDB Atlas

**Solution**:
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

#### 3. File Upload Issues

**Problem**: Images not uploading to S3

**Solution**:
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure CORS configuration on S3 bucket

#### 4. Socket.IO Connection Issues

**Problem**: Real-time features not working

**Solution**:
- Check WebSocket support on hosting platform
- Verify Socket.IO URL configuration
- Check firewall settings

### Debugging Tools

1. **Network Monitoring**:
```bash
# Check network connectivity
curl -I https://your-backend-domain.railway.app/health

# Test API endpoints
curl -X POST https://your-backend-domain.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

2. **Database Monitoring**:
```javascript
// server/config/db.js
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

3. **Performance Monitoring**:
```javascript
// server/middleware/performance.js
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

app.use(performanceMiddleware);
```

## Production Checklist

### Pre-Deployment Checklist

- [ ] **Environment Variables**: All required variables set
- [ ] **Database**: Production database configured and tested
- [ ] **File Storage**: S3 bucket configured with proper permissions
- [ ] **API Keys**: All external service keys configured
- [ ] **CORS**: Frontend URLs added to allowed origins
- [ ] **SSL**: HTTPS configured for all services
- [ ] **Monitoring**: Health checks and error tracking set up
- [ ] **Logging**: Structured logging configured
- [ ] **Performance**: Database indexes created
- [ ] **Security**: Rate limiting and input validation enabled

### Post-Deployment Checklist

- [ ] **Health Checks**: All endpoints responding correctly
- [ ] **Authentication**: Login/logout flow working
- [ ] **File Uploads**: Images uploading successfully
- [ ] **Real-time Features**: Chat and notifications working
- [ ] **Database**: Data persisting correctly
- [ ] **Performance**: Response times acceptable
- [ ] **Monitoring**: Alerts configured and working
- [ ] **Backup**: Database backups scheduled
- [ ] **Documentation**: API documentation accessible
- [ ] **Support**: Error handling and user feedback working

### Maintenance Tasks

#### Daily
- [ ] Check application health
- [ ] Monitor error rates
- [ ] Review performance metrics

#### Weekly
- [ ] Review logs for errors
- [ ] Check database performance
- [ ] Update dependencies if needed

#### Monthly
- [ ] Security updates
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Cost optimization review

---

This deployment guide should help you successfully deploy the Yuthukama platform to production. For additional support, refer to the platform-specific documentation or contact the development team.
