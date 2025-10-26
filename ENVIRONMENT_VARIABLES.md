# Environment Variables Documentation

This document provides comprehensive documentation for all environment variables used in the Yuthukama platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Security Considerations](#security-considerations)
- [Variable Validation](#variable-validation)
- [Troubleshooting](#troubleshooting)

## Overview

Environment variables are used to configure the application for different environments (development, staging, production) without hardcoding sensitive information in the source code.

### File Locations

- **Backend**: `server/.env`
- **Frontend**: `client/.env` (for Vite-specific variables)
- **Production**: Set in hosting platform environment settings

## Required Variables

These variables are essential for the application to function properly.

### Database Configuration

#### `MONGODB_URI`
- **Description**: MongoDB connection string
- **Required**: Yes
- **Format**: `mongodb://username:password@host:port/database` or `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Example**: 
  - Local: `mongodb://localhost:27017/yuthukama`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/yuthukama?retryWrites=true&w=majority`
- **Security**: Contains sensitive credentials
- **Validation**: Must be a valid MongoDB connection string

### Authentication

#### `JWT_SECRET`
- **Description**: Secret key for JWT token signing and verification
- **Required**: Yes
- **Format**: String (minimum 32 characters)
- **Example**: `your_super_secure_jwt_secret_minimum_32_characters_long`
- **Security**: Highly sensitive - use strong random string
- **Validation**: Must be at least 32 characters long
- **Generation**: Use `openssl rand -base64 32` or similar tool

### Server Configuration

#### `PORT`
- **Description**: Port number for the server to listen on
- **Required**: Yes
- **Format**: Integer
- **Default**: `5000`
- **Example**: `5000`
- **Validation**: Must be a valid port number (1-65535)

#### `NODE_ENV`
- **Description**: Node.js environment mode
- **Required**: Yes
- **Format**: String
- **Values**: `development`, `production`, `test`
- **Example**: `production`
- **Validation**: Must be one of the valid environment values

## Optional Variables

These variables enable additional features but are not required for basic functionality.

### AWS S3 Configuration

#### `AWS_ACCESS_KEY_ID`
- **Description**: AWS access key ID for S3 file storage
- **Required**: No (required for file uploads)
- **Format**: String
- **Example**: `AKIAIOSFODNN7EXAMPLE`
- **Security**: Sensitive - store securely
- **Validation**: Must be valid AWS access key format

#### `AWS_SECRET_ACCESS_KEY`
- **Description**: AWS secret access key for S3 file storage
- **Required**: No (required for file uploads)
- **Format**: String
- **Example**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- **Security**: Highly sensitive - store securely
- **Validation**: Must be valid AWS secret key format

#### `AWS_REGION`
- **Description**: AWS region for S3 bucket
- **Required**: No (required for file uploads)
- **Format**: String
- **Default**: `us-east-1`
- **Example**: `us-east-1`, `us-west-2`, `eu-west-1`
- **Validation**: Must be valid AWS region

#### `AWS_S3_BUCKET`
- **Description**: S3 bucket name for file storage
- **Required**: No (required for file uploads)
- **Format**: String
- **Example**: `yuthukama-production-files`
- **Validation**: Must be valid S3 bucket name (lowercase, no spaces)

### AI Service Configuration

#### `GEMINI_API_KEY`
- **Description**: Google Gemini AI API key for chatbot functionality
- **Required**: No (required for AI features)
- **Format**: String
- **Example**: `AIzaSyBvOkBw3cGzF2m1h0jKlMnOpQrStUvWxYz`
- **Security**: Sensitive - store securely
- **Validation**: Must be valid Gemini API key format
- **Obtainment**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Email Configuration

#### `EMAIL_HOST`
- **Description**: SMTP server host for sending emails
- **Required**: No (required for email features)
- **Format**: String
- **Example**: `smtp.gmail.com`, `smtp.sendgrid.net`
- **Validation**: Must be valid SMTP host

#### `EMAIL_PORT`
- **Description**: SMTP server port
- **Required**: No (required for email features)
- **Format**: Integer
- **Default**: `587`
- **Example**: `587`, `465`, `25`
- **Validation**: Must be valid port number

#### `EMAIL_USER`
- **Description**: SMTP username for authentication
- **Required**: No (required for email features)
- **Format**: String (email address)
- **Example**: `noreply@yuthukama.com`
- **Security**: Sensitive - store securely
- **Validation**: Must be valid email format

#### `EMAIL_PASS`
- **Description**: SMTP password for authentication
- **Required**: No (required for email features)
- **Format**: String
- **Example**: `your_app_password`
- **Security**: Highly sensitive - store securely
- **Validation**: Must be non-empty string

### Frontend Configuration

#### `VITE_API_URL`
- **Description**: Backend API URL for frontend
- **Required**: No (defaults to localhost in development)
- **Format**: URL string
- **Example**: `https://api.yuthukama.com`
- **Validation**: Must be valid URL

#### `VITE_SOCKET_URL`
- **Description**: Socket.IO server URL for frontend
- **Required**: No (defaults to localhost in development)
- **Format**: URL string
- **Example**: `https://api.yuthukama.com`
- **Validation**: Must be valid URL

### Monitoring and Logging

#### `SENTRY_DSN`
- **Description**: Sentry DSN for error tracking
- **Required**: No (required for error monitoring)
- **Format**: URL string
- **Example**: `https://abc123@o123456.ingest.sentry.io/123456`
- **Security**: Sensitive - contains project identifier
- **Validation**: Must be valid Sentry DSN format

#### `NEW_RELIC_LICENSE_KEY`
- **Description**: New Relic license key for performance monitoring
- **Required**: No (required for performance monitoring)
- **Format**: String
- **Example**: `abc123def456ghi789`
- **Security**: Sensitive - store securely
- **Validation**: Must be valid New Relic license key

#### `LOG_LEVEL`
- **Description**: Logging level for the application
- **Required**: No
- **Format**: String
- **Values**: `error`, `warn`, `info`, `debug`
- **Default**: `info`
- **Example**: `debug`
- **Validation**: Must be valid log level

### Rate Limiting

#### `RATE_LIMIT_WINDOW_MS`
- **Description**: Rate limiting window in milliseconds
- **Required**: No
- **Format**: Integer
- **Default**: `900000` (15 minutes)
- **Example**: `900000`
- **Validation**: Must be positive integer

#### `RATE_LIMIT_MAX_REQUESTS`
- **Description**: Maximum requests per window
- **Required**: No
- **Format**: Integer
- **Default**: `100`
- **Example**: `100`
- **Validation**: Must be positive integer

#### `AUTH_RATE_LIMIT_MAX_REQUESTS`
- **Description**: Maximum authentication requests per window
- **Required**: No
- **Format**: Integer
- **Default**: `5`
- **Example**: `5`
- **Validation**: Must be positive integer

## Development Setup

### Local Development Environment

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yuthukama

# Authentication
JWT_SECRET=development_jwt_secret_minimum_32_characters_long

# Server Configuration
PORT=5000
NODE_ENV=development

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-dev-bucket-name

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Logging
LOG_LEVEL=debug
```

### Frontend Development Environment

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Environment Validation

Add validation to ensure required variables are set:

```javascript
// server/config/config.js
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file in the server directory');
  process.exit(1);
}

export default {
  mongoUri: process.env.MONGODB_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET,
  },
  geminiApiKey: process.env.GEMINI_API_KEY,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  sentryDsn: process.env.SENTRY_DSN,
  newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

## Production Setup

### Production Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yuthukama?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secure_production_jwt_secret_minimum_32_characters_long

# Server Configuration
PORT=5000
NODE_ENV=production

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_production_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_production_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=yuthukama-production-files

# Gemini AI Configuration
GEMINI_API_KEY=your_production_gemini_api_key

# Email Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key

# Monitoring
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
NEW_RELIC_LICENSE_KEY=your_new_relic_license_key
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

### Platform-Specific Setup

#### Vercel (Frontend)

1. Go to Project Settings → Environment Variables
2. Add the following variables:
   ```
   VITE_API_URL=https://your-backend-domain.railway.app
   VITE_SOCKET_URL=https://your-backend-domain.railway.app
   ```

#### Railway (Backend)

1. Go to Project → Variables
2. Add all required environment variables
3. Use Railway's secure variable storage

#### Heroku (Backend)

```bash
# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
heroku config:set AWS_ACCESS_KEY_ID=your_aws_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret
heroku config:set AWS_S3_BUCKET=your_bucket_name
heroku config:set GEMINI_API_KEY=your_gemini_key
```

## Security Considerations

### Sensitive Variables

These variables contain sensitive information and must be protected:

- `JWT_SECRET` - Used for token signing
- `MONGODB_URI` - Contains database credentials
- `AWS_ACCESS_KEY_ID` - AWS access credentials
- `AWS_SECRET_ACCESS_KEY` - AWS secret credentials
- `GEMINI_API_KEY` - AI service API key
- `EMAIL_USER` - Email service credentials
- `EMAIL_PASS` - Email service password
- `SENTRY_DSN` - Error tracking service identifier
- `NEW_RELIC_LICENSE_KEY` - Performance monitoring key

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, random secrets** for JWT_SECRET
3. **Rotate credentials regularly**
4. **Use environment-specific values**
5. **Limit access to production variables**
6. **Use secure storage** for sensitive data
7. **Validate all environment variables**
8. **Use different secrets** for different environments

### Secret Generation

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate random password
openssl rand -base64 16

# Generate UUID
uuidgen
```

## Variable Validation

### Backend Validation

```javascript
// server/utils/envValidation.js
const validateEnvVars = () => {
  const errors = [];

  // Required variables
  const required = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  };

  // Check required variables
  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate port number
  if (process.env.PORT && (isNaN(process.env.PORT) || process.env.PORT < 1 || process.env.PORT > 65535)) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    errors.push(`NODE_ENV must be one of: ${validEnvs.join(', ')}`);
  }

  // Validate MongoDB URI format
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    errors.push('MONGODB_URI must be a valid MongoDB connection string');
  }

  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

export default validateEnvVars;
```

### Frontend Validation

```javascript
// client/src/utils/envValidation.js
const validateEnvVars = () => {
  const errors = [];

  // Check API URL format
  if (import.meta.env.VITE_API_URL) {
    try {
      new URL(import.meta.env.VITE_API_URL);
    } catch {
      errors.push('VITE_API_URL must be a valid URL');
    }
  }

  // Check Socket URL format
  if (import.meta.env.VITE_SOCKET_URL) {
    try {
      new URL(import.meta.env.VITE_SOCKET_URL);
    } catch {
      errors.push('VITE_SOCKET_URL must be a valid URL');
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }

  return true;
};

export default validateEnvVars;
```

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables

**Error**: `Missing required environment variable: JWT_SECRET`

**Solution**:
1. Check if `.env` file exists in `server` directory
2. Verify variable name spelling
3. Ensure no extra spaces or quotes around values
4. Restart the server after adding variables

#### 2. Invalid MongoDB URI

**Error**: `MongoDB connection failed`

**Solution**:
1. Verify MongoDB URI format
2. Check database credentials
3. Ensure IP whitelist includes your server IP
4. Test connection string in MongoDB Compass

#### 3. JWT Secret Too Short

**Error**: `JWT_SECRET must be at least 32 characters long`

**Solution**:
1. Generate a new secret: `openssl rand -base64 32`
2. Update the `.env` file
3. Restart the server

#### 4. AWS S3 Access Denied

**Error**: `Access Denied` when uploading files

**Solution**:
1. Verify AWS credentials
2. Check S3 bucket permissions
3. Ensure IAM user has S3 access
4. Verify bucket name is correct

#### 5. Frontend Can't Connect to Backend

**Error**: CORS errors or connection refused

**Solution**:
1. Check `VITE_API_URL` in frontend `.env`
2. Verify backend is running
3. Check CORS configuration in backend
4. Ensure URLs match exactly

### Debugging Tools

#### Environment Variable Checker

```javascript
// server/utils/debugEnv.js
const debugEnvVars = () => {
  console.log('🔍 Environment Variables Debug:');
  console.log('================================');
  
  const vars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET',
    'GEMINI_API_KEY',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'SENTRY_DSN',
    'LOG_LEVEL'
  ];

  vars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mask sensitive values
      const maskedValue = ['JWT_SECRET', 'MONGODB_URI', 'AWS_SECRET_ACCESS_KEY', 'EMAIL_PASS'].includes(varName)
        ? '*'.repeat(Math.min(value.length, 8))
        : value;
      console.log(`✅ ${varName}: ${maskedValue}`);
    } else {
      console.log(`❌ ${varName}: Not set`);
    }
  });
  
  console.log('================================');
};

export default debugEnvVars;
```

#### Connection Test

```javascript
// server/utils/testConnections.js
import mongoose from 'mongoose';
import { S3Client } from '@aws-sdk/client-s3';

const testConnections = async () => {
  console.log('🧪 Testing Connections:');
  console.log('========================');

  // Test MongoDB connection
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB: Connected successfully');
  } catch (error) {
    console.log('❌ MongoDB: Connection failed');
    console.log('   Error:', error.message);
  }

  // Test AWS S3 connection
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      
      await s3Client.send(new ListBucketsCommand({}));
      console.log('✅ AWS S3: Connected successfully');
    } catch (error) {
      console.log('❌ AWS S3: Connection failed');
      console.log('   Error:', error.message);
    }
  } else {
    console.log('⚠️  AWS S3: Credentials not provided');
  }

  console.log('========================');
};

export default testConnections;
```

---

This comprehensive environment variables documentation should help you configure the Yuthukama platform correctly for any environment. Always remember to keep sensitive information secure and never commit environment files to version control.
