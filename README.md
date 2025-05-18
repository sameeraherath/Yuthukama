# Yuthukama

A modern full-stack web application built with React and Node.js, featuring real-time communication capabilities and a robust authentication system.

## 🚀 Tech Stack

### Frontend

- React 19
- Material-UI (MUI) v6
- Redux Toolkit for state management
- React Router v7 for routing
- Socket.IO Client for real-time communication
- Formik & Yup for form handling and validation
- TailwindCSS for styling
- Vite as the build tool

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- AWS S3 for file storage
- Multer for file uploads
- Bcrypt for password hashing

## ✨ Features

- Real-time communication using Socket.IO
- Secure authentication system with JWT
- File upload capabilities with AWS S3 integration
- Responsive design with Material-UI and TailwindCSS
- Form validation and handling
- State management with Redux Toolkit
- Modern development environment with Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- AWS Account (for S3 integration)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yuthukama.git
cd yuthukama
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

## 🚀 Usage

1. Start the development server:

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

2. Build for production:

```bash
# Build the frontend
cd client
npm run build

# The backend will serve the built frontend files
```

## 📁 Project Structure

```
yuthukama/
├── client/                      # Frontend React application
│   ├── src/                    # Source files
│   │   ├── assets/            # Static assets (images, fonts, etc.)
│   │   ├── components/        # Reusable React components
│   │   ├── features/          # Feature-specific components and logic
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store configuration
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   ├── App.css            # App styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Application entry point
│   ├── public/                # Public static files
│   ├── dist/                  # Production build output
│   ├── node_modules/          # Frontend dependencies
│   ├── package.json           # Frontend dependencies and scripts
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── eslint.config.js       # ESLint configuration
│
└── server/                     # Backend Node.js application
    ├── config/                # Configuration files
    ├── controllers/           # Route controllers
    ├── models/               # Database models
    ├── routes/               # API routes
    ├── middleware/           # Custom middleware
    ├── utils/                # Utility functions
    ├── dist/                 # Compiled JavaScript files
    ├── node_modules/         # Backend dependencies
    ├── package.json          # Backend dependencies and scripts
    └── server.js             # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributors

- [Sameera Herath](https://github.com/sameeraherath)

## 📧 Contact

For any queries or support, please reach out to [sameerastar6@gmail.com](mailto:sameerastar6@gmail.com)
