# Contributing to Yuthukama

Thank you for your interest in contributing to Yuthukama! This document provides guidelines and information for contributors to help maintain the quality and consistency of the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Requirements](#documentation-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status, nationality
- Personal appearance, race, religion, or sexual identity and orientation

### Expected Behavior

- **Be respectful and inclusive**: Use welcoming and inclusive language
- **Be collaborative**: Work together constructively
- **Be patient**: Remember that everyone has different levels of experience
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional tone in all interactions

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Personal attacks or insults
- Spam or off-topic discussions
- Publishing private information without permission
- Any conduct that could be considered inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying and enforcing our code of conduct. They may take appropriate action in response to any behavior they deem inappropriate.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (latest version)
- **MongoDB** (local or Atlas)
- **Code Editor** (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
```bash
git clone https://github.com/your-username/yuthukama.git
cd yuthukama
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/sameeraherath/yuthukama.git
```

4. **Install dependencies**:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

5. **Set up environment variables**:
```bash
# Copy the example environment file
cp server/.env.example server/.env

# Edit the .env file with your configuration
```

### Development Setup

1. **Start the development servers**:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

2. **Verify the setup**:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`
   - API Docs: `http://localhost:5000/api-docs`

## Development Workflow

### Branch Strategy

We use a simplified Git flow:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development branches
- **`bugfix/*`**: Bug fix branches
- **`hotfix/*`**: Critical production fixes

### Creating a Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

#### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, etc.)
- **`refactor`**: Code refactoring
- **`test`**: Adding or updating tests
- **`chore`**: Maintenance tasks

#### Examples

```bash
# Good commit messages
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(chat): resolve message delivery confirmation bug"
git commit -m "docs(api): update authentication endpoint documentation"
git commit -m "refactor(components): extract reusable PostCard component"

# Bad commit messages
git commit -m "fix stuff"
git commit -m "update"
git commit -m "WIP"
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your feature branch on latest main
git rebase upstream/main

# Resolve any conflicts if they occur
# Continue rebase after resolving conflicts
git rebase --continue
```

## Coding Standards

### General Principles

- **Readability**: Write code that is easy to understand
- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Prefer simple solutions over complex ones
- **Documentation**: Document complex logic and public APIs
- **Testing**: Write tests for new functionality

### Frontend Standards (React)

#### Component Structure

```jsx
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// 2. Internal imports
import { fetchUserData } from '../features/user/userAPI';
import CustomButton from './CustomButton';

// 3. Component definition
const UserProfile = ({ userId, onEdit }) => {
  // 4. Hooks (state, effects, custom hooks)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);

  // 5. Event handlers
  const handleEdit = () => {
    onEdit(user);
  };

  // 6. Effects
  useEffect(() => {
    dispatch(fetchUserData(userId));
  }, [dispatch, userId]);

  // 7. Render
  return (
    <Box>
      <Typography variant="h5">{user.name}</Typography>
      <CustomButton onClick={handleEdit}>Edit Profile</CustomButton>
    </Box>
  );
};

// 8. PropTypes or TypeScript interfaces
UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default UserProfile;
```

#### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `PostCard`)
- **Files**: PascalCase for components (`UserProfile.jsx`)
- **Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Functions**: camelCase (`handleSubmit`, `fetchUserData`)

#### Component Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused on a single responsibility
- Use PropTypes or TypeScript for prop validation
- Prefer composition over inheritance

### Backend Standards (Node.js/Express)

#### File Structure

```javascript
// 1. Imports (external libraries first)
import express from 'express';
import { body, validationResult } from 'express-validator';

// 2. Internal imports
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

// 3. Router setup
const router = express.Router();

// 4. Route handlers
/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Export
export default router;
```

#### Naming Conventions

- **Files**: camelCase (`userController.js`, `authMiddleware.js`)
- **Functions**: camelCase (`getUserProfile`, `validateUser`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET`, `MAX_FILE_SIZE`)
- **Database Models**: PascalCase (`User`, `Post`, `Message`)

#### API Design Guidelines

- Use RESTful conventions
- Include proper HTTP status codes
- Provide meaningful error messages
- Use consistent response formats
- Include pagination for list endpoints
- Validate all input data

### Database Standards (MongoDB/Mongoose)

#### Schema Design

```javascript
const userSchema = new mongoose.Schema({
  // Required fields first
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  
  // Optional fields
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
```

#### Database Guidelines

- Use meaningful field names
- Add appropriate validation
- Create indexes for frequently queried fields
- Use references for relationships
- Include timestamps for audit trails

## Project Structure

### Frontend Structure (`client/src/`)

```
src/
├── components/          # Reusable UI components
│   ├── articles/       # Article-specific components
│   ├── chat/          # Chat-related components
│   ├── LoadingStates/ # Loading and skeleton components
│   └── Toast/         # Notification components
├── features/          # Redux feature slices
│   ├── auth/          # Authentication state management
│   │   ├── authAPI.js # API calls
│   │   └── authSlice.js # Redux slice
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

### Backend Structure (`server/`)

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

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.jsx`, `PostCard.jsx`)
- **Pages**: PascalCase (`HomePage.jsx`, `LoginPage.jsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.js`, `useChat.js`)
- **Utils**: camelCase (`authUtils.js`, `errorHandler.js`)
- **API files**: camelCase with `API` suffix (`authAPI.js`, `postsAPI.js`)
- **Redux slices**: camelCase with `Slice` suffix (`authSlice.js`, `userSlice.js`)

## Testing Guidelines

### Frontend Testing

#### Component Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import UserProfile from './UserProfile';

const renderWithProvider = (component) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('UserProfile', () => {
  test('renders user information correctly', () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    };

    renderWithProvider(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    const mockUser = { id: '1', username: 'testuser' };

    renderWithProvider(<UserProfile user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Hook Testing

```javascript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  test('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### Backend Testing

#### API Endpoint Testing

```javascript
import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should register a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe(userData.username);
  });

  test('should return error for duplicate email', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // Create first user
    await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Try to create second user with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...userData, username: 'differentuser' })
      .expect(400);

    expect(response.body.message).toContain('Email already exists');
  });
});
```

### Testing Requirements

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **Component Tests**: Test React components in isolation
- **E2E Tests**: Test critical user flows (optional but recommended)

### Running Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation Requirements

### Code Documentation

#### JSDoc Comments

```javascript
/**
 * Creates a new user account
 * @async
 * @function createUser
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Created user object with token
 * @throws {Error} When user creation fails
 * @example
 * const user = await createUser({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'securepassword'
 * });
 */
const createUser = async (userData) => {
  // Implementation
};
```

#### Component Documentation

```jsx
/**
 * User profile component displaying user information and actions
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.user - User data object
 * @param {Function} props.onEdit - Callback function for edit action
 * @param {boolean} [props.showActions=true] - Whether to show action buttons
 * @returns {JSX.Element} Rendered user profile component
 * @example
 * <UserProfile 
 *   user={userData} 
 *   onEdit={handleEdit}
 *   showActions={true}
 * />
 */
const UserProfile = ({ user, onEdit, showActions = true }) => {
  // Component implementation
};
```

### API Documentation

#### Route Documentation

```javascript
/**
 * @route POST /api/auth/register
 * @desc Register a new user account
 * @access Public
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - User's username (3-30 characters)
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (min 6 characters)
 * @returns {Object} 201 - User object with JWT token
 * @returns {Object} 400 - Validation error or duplicate email
 * @returns {Object} 500 - Server error
 * @example
 * POST /api/auth/register
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "securepassword"
 * }
 */
router.post('/register', validateRegister, registerUser);
```

### README Updates

When adding new features:

1. Update the main README.md with new features
2. Update API documentation
3. Add usage examples
4. Update environment variables if needed
5. Update deployment instructions if necessary

## Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
2. **Write or update tests** for your changes
3. **Update documentation** as needed
4. **Run linting and tests**:
```bash
# Frontend
cd client
npm run lint
npm test

# Backend
cd server
npm run lint
npm test
```

### Creating a Pull Request

1. **Push your changes** to your fork:
```bash
git push origin feature/your-feature-name
```

2. **Create a Pull Request** on GitHub with:
   - Clear, descriptive title
   - Detailed description of changes
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests that you ran to verify your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review the code
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Once approved, the PR is merged

### After Merge

1. **Delete the feature branch** (if not auto-deleted)
2. **Update your local main branch**:
```bash
git checkout main
git pull upstream main
```

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check if it's already fixed** in the latest version
3. **Verify it's a bug** and not a feature request

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
 - Browser: [e.g. Chrome 91, Firefox 89, Safari 14]
 - Node.js version: [e.g. 18.0.0]
 - npm version: [e.g. 8.0.0]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

We use the following labels:

- **`bug`**: Something isn't working
- **`enhancement`**: New feature or request
- **`documentation`**: Improvements or additions to documentation
- **`good first issue`**: Good for newcomers
- **`help wanted`**: Extra attention is needed
- **`priority: high`**: High priority issues
- **`priority: medium`**: Medium priority issues
- **`priority: low`**: Low priority issues

## Community Guidelines

### Getting Help

- **Documentation**: Check the README and other docs first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Be constructive and helpful in code reviews

### Contributing Beyond Code

- **Documentation**: Improve existing docs or create new ones
- **Testing**: Help improve test coverage
- **Bug Reports**: Report bugs with detailed information
- **Feature Requests**: Suggest new features with use cases
- **Community**: Help other users in discussions

### Recognition

Contributors are recognized in:

- **README**: Listed in contributors section
- **Release Notes**: Mentioned in changelog
- **GitHub**: Shown in contributors graph

## Questions?

If you have questions about contributing:

- **Open a Discussion**: Use GitHub Discussions for questions
- **Contact Maintainers**: Reach out via email or GitHub
- **Join Community**: Participate in community discussions

---

**Thank you for contributing to Yuthukama!** 🚀

Your contributions help make this project better for everyone. We appreciate your time and effort in helping improve the platform.
