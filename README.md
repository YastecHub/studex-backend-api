# StudEx Backend API

A production-ready Node.js/TypeScript backend API for the StudEx hackathon project with JWT authentication, Cloudinary image upload, comprehensive error handling, validators, and Swagger documentation.

## 🎯 Features

- ✅ JWT-based authentication (Sign up & Login)
- ✅ Comprehensive input validation
- ✅ Proper error handling with custom error classes
- ✅ Service layer architecture (separation of concerns)
- ✅ Cloudinary image upload integration
- ✅ MongoDB with Mongoose ODM
- ✅ Swagger/OpenAPI documentation
- ✅ TypeScript with strict mode
- ✅ Password hashing with bcryptjs
- ✅ Async error handling wrapper

## 📁 Project Structure

```
src/
├── config/                 # Configuration
│   ├── index.ts           # Environment variables
│   ├── cloudinary.ts      # Cloudinary setup
│   └── database.ts        # MongoDB connection
├── controllers/           # Route handlers (thin layer)
│   └── authController.ts
├── models/               # Mongoose schemas
│   └── User.ts
├── routes/               # API routes with Swagger docs
│   └── authRoutes.ts
├── services/             # Business logic layer
│   └── authService.ts
├── middleware/           # Express middleware
│   ├── auth.ts          # JWT verification
│   ├── errorHandler.ts  # Global error handler
│   └── asyncHandler.ts  # Async error wrapper
├── utils/               # Utility functions
│   ├── jwt.ts           # JWT token generation/verification
│   ├── validators.ts    # Input validators
│   ├── errors.ts        # Custom error classes
│   └── cloudinary.ts    # Cloudinary utilities
└── index.ts             # Main Express app
```

## 🏗️ Architecture

### Layered Architecture
- **Controllers**: Receive requests, call services, send responses (thin layer)
- **Services**: Contain all business logic, validation, error handling
- **Models**: Define data structure and validation rules
- **Middleware**: Handle cross-cutting concerns (auth, error handling)
- **Utils**: Reusable helper functions and validators

### Error Handling
- Custom error classes: `AppError`, `ValidationError`, `UnauthorizedError`, `ConflictError`, `NotFoundError`
- Global error handler middleware catches all errors
- Async error wrapper for proper error propagation
- Consistent error response format

### Validation
- Input validation in service layer
- Custom validators for email, password, matric
- Detailed validation error messages with field-level information

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)
- Cloudinary account
- pnpm (or npm/yarn)

### 2. Installation

```bash
cd studex-backend-api
pnpm install
```

### 3. Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Configure your `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/studex

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_it
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Development

```bash
pnpm run dev
```

Server runs on: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api-docs`

### 5. Build & Production

```bash
# Build
pnpm run build

# Start
pnpm start
```

## 📚 API Endpoints

### Authentication

#### Sign Up
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "matric": "ST001",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "matric": "ST001",
      "email": "user@example.com",
      "profileImage": null
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "matric": "ST001",
      "email": "user@example.com",
      "profileImage": null
    }
  }
  ```

#### Get Profile
- **GET** `/api/auth/profile`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "matric": "ST001",
      "email": "user@example.com",
      "profileImage": "https://cloudinary.com/..."
    }
  }
  ```

## 🔐 Error Handling

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

## 📋 Validators

### Email Validation
- Format: Standard email regex pattern
- Required field

### Password Validation
- Minimum length: 6 characters
- Required field

### Matric Validation
- Non-empty string
- Required field
- Must be unique

## 🔑 JWT Token

- **Format**: Bearer token in Authorization header
- **Payload**: User ID and email
- **Expiration**: 7 days (configurable)
- **Secret**: Stored in `.env` file

## 📸 Cloudinary Integration

- **Folder**: `studex/profiles`
- **File Types**: jpg, jpeg, png, webp
- **Max Size**: 5MB
- **Resource Type**: Auto-detected

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| TypeScript | Type-safe JavaScript |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM (Object Document Mapper) |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Swagger/OpenAPI | API documentation |
| pnpm | Package manager |

## 📖 Swagger Documentation

When the server is running, visit `http://localhost:3000/api-docs` to:
- View all API endpoints
- See request/response schemas
- Try out endpoints with "Try it out" button
- View authentication requirements
- Understand error responses

## 🚧 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile image upload endpoint
- [ ] User profile update endpoint
- [ ] Refresh token mechanism
- [ ] Rate limiting
- [ ] Request logging
- [ ] Unit tests
- [ ] Integration tests
- [ ] Input sanitization

## 📝 Development Guidelines

### Adding a New Endpoint

1. **Create a Service Method** in `src/services/`
   - Contain business logic
   - Throw custom errors
   - Validate inputs

2. **Create a Controller** in `src/controllers/`
   - Call service method
   - Return formatted response

3. **Add Route** in `src/routes/`
   - Add Swagger documentation
   - Use `asyncHandler` wrapper
   - Import middleware if needed

### Error Handling Best Practices

```typescript
import { ValidationError, ConflictError } from '../utils/errors';

// In service
if (!data.email) {
  throw new ValidationError('Validation failed', {
    email: 'Email is required'
  });
}

if (userExists) {
  throw new ConflictError('User already exists');
}
```

## 📞 Support

For issues or questions about the API setup, check:
1. Swagger documentation at `/api-docs`
2. `.env.example` for environment variables
3. This README for architecture details

## 📄 License

ISC

## 👥 Author

StudEx Team - Hackathon Project

