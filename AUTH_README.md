# Enterprise Notion - Authentication System

A secure, production-ready authentication system built with React, Redux Toolkit, Express.js, and MongoDB.

## 🔐 Features

### Security Features

- **JWT-based Authentication**: Stateless authentication using JSON Web Tokens
- **Secure Token Storage**: Tokens stored in memory (not localStorage) for enhanced security
- **Password Hashing**: Uses bcrypt for secure password storage
- **Rate Limiting**: Prevents brute force attacks with configurable rate limits
- **Input Validation**: Comprehensive validation on both frontend and backend
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Helmet Security**: Additional security headers using Helmet.js

### User Experience

- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Route Protection**: Protected and public routes with automatic redirects
- **Responsive Design**: Mobile-first design using Tailwind CSS

### Architecture

- **Redux State Management**: Centralized state management with Redux Toolkit
- **Modular Structure**: Clean separation of concerns with organized folder structure
- **API Layer**: Abstracted API calls with automatic token management
- **Middleware**: Custom validation and authentication middleware
- **Error Boundaries**: Graceful error handling throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd enterprise-notion
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install

   # Create .env file
   cp .env.example .env

   # Configure environment variables
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   PORT=4567
   ```

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

4. **Start the Development Servers**

   Backend:

   ```bash
   cd server
   npm run dev
   ```

   Frontend:

   ```bash
   cd client
   npm run dev
   ```

## 📁 Project Structure

```
enterprise-notion/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/          # Authentication components
│   │   │   └── ui/            # UI components (Button, Input, etc.)
│   │   ├── pages/             # Page components
│   │   ├── redux/             # Redux store and slices
│   │   │   ├── api/           # API layer
│   │   │   └── slices/        # Redux slices
│   │   ├── lib/               # Utility functions
│   │   └── allRoutes/         # Route configuration
│   └── package.json
├── server/                     # Backend Express application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db/            # Database configuration
│   │   │   ├── libraries/     # External library configs
│   │   │   └── environment/   # Environment configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # MongoDB models
│   │   └── routes/            # API routes
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)

### Request/Response Examples

**Register:**

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Login:**

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 🛡️ Security Considerations

### Token Management

- **In-Memory Storage**: Tokens are stored in memory to prevent XSS attacks
- **Short Expiration**: Tokens have configurable expiration times
- **Automatic Cleanup**: Tokens are cleared on logout or error

### Password Security

- **Bcrypt Hashing**: Passwords are hashed with bcrypt before storage
- **Strength Validation**: Frontend and backend validation for password strength
- **No Plain Text**: Passwords are never stored or transmitted in plain text

### Rate Limiting

- **Auth Endpoints**: Limited to 5 requests per 15 minutes per IP
- **Customizable**: Easily configurable rate limits
- **Error Messages**: Clear feedback on rate limit violations

### Input Validation

- **Frontend Validation**: Real-time validation with user feedback
- **Backend Validation**: Server-side validation as the final check
- **Sanitization**: Input sanitization to prevent injection attacks

## 🎨 UI Components

### Reusable Components

- **Button**: Customizable button with multiple variants
- **Input**: Form input with validation styling
- **Alert**: Alert component for success/error messages
- **LoadingSpinner**: Loading indicator for async operations

### Design System

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode Ready**: Easily extensible for dark mode

## 🔄 Redux State Management

### Auth Slice

```javascript
{
  user: null,              // Current user data
  token: null,             // JWT token
  isAuthenticated: false,  // Authentication status
  isLoading: false,        // Loading state
  error: null,             // Error messages
  validationErrors: null,  // Field-specific validation errors
  message: null            // Success messages
}
```

### Actions

- `registerUser` - Register new user
- `loginUser` - Login user
- `getCurrentUser` - Fetch current user data
- `logout` - Logout user
- `clearError` - Clear error messages
- `clearMessage` - Clear success messages

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Update API base URL for production
2. Build the application: `npm run build`
3. Deploy to static hosting (Netlify, Vercel, etc.)

### Environment Variables

```env
# Backend (.env)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=production
PORT=4567

# Frontend (update in authAPI.js)
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 🧪 Testing

### Manual Testing

1. Register a new account
2. Login with the created account
3. Access protected routes
4. Test validation errors
5. Test rate limiting
6. Test logout functionality

### Automated Testing (Recommended)

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Cypress or Playwright

## 🔧 Customization

### Adding New Fields

1. Update the User model in `server/src/models/user.model.js`
2. Update validation in `server/src/middleware/validation.middleware.js`
3. Update frontend forms and validation
4. Update Redux state if needed

### Styling Customization

- Modify Tailwind config in `tailwind.config.js`
- Update component styles in respective component files
- Add custom CSS in `src/index.css`

## 📝 Best Practices Implemented

1. **Security First**: XSS prevention, CSRF protection, secure token storage
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Validation**: Client and server-side validation for data integrity
4. **Code Organization**: Clean, modular code structure
5. **Performance**: Optimized API calls and state management
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Responsive Design**: Mobile-first approach
8. **Documentation**: Comprehensive code documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please open an issue on the repository or contact the development team.
