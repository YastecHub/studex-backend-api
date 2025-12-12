# StudEx Backend API Documentation

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://studex-backend-api.onrender.com`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. User Registration
**POST** `/api/auth/signup`

Register a new user with profile information and optional profile image.

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  "matric": "STU001",                    // Required: Student matric number
  "email": "user@example.com",           // Required: Valid email address
  "password": "password123",             // Required: Min 6 characters
  "firstName": "John",                   // Required: First name
  "lastName": "Doe",                     // Required: Last name
  "username": "johndoe",                 // Required: Unique username
  "schoolName": "University of Lagos",   // Required: School/Institution name
  "skillCategory": "Freelancer",         // Required: Client|Freelancer|Hybrid
  "interests": ["Photography", "Design"], // Optional: Array of interests
  "profileImage": <file>                 // Optional: Image file (jpg, png, webp)
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "matric": "STU001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "schoolName": "University of Lagos",
      "skillCategory": "Freelancer",
      "interests": ["Photography", "Design"],
      "profileImage": "https://cloudinary.com/..."
    }
  }
}
```

### 2. User Login
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "matric": "STU001",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "schoolName": "University of Lagos",
      "skillCategory": "Freelancer",
      "interests": ["Photography", "Design"],
      "profileImage": "https://cloudinary.com/..."
    }
  }
}
```

### 3. Get User Profile
**GET** `/api/auth/profile`

Get current authenticated user's profile.

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "matric": "STU001",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "schoolName": "University of Lagos",
    "skillCategory": "Freelancer",
    "interests": ["Photography", "Design"],
    "profileImage": "https://cloudinary.com/..."
  }
}
```

### 4. Update User Profile
**PUT** `/api/auth/profile`

Update user profile information.

**Headers**: `Authorization: Bearer <token>`
**Content-Type**: `application/json`

**Request Body** (all fields optional):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",
  "schoolName": "University of Ibadan",
  "skillCategory": "Client",
  "interests": ["Writing", "Marketing", "Business"]
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "matric": "STU001",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "username": "janesmith",
    "schoolName": "University of Ibadan",
    "skillCategory": "Client",
    "interests": ["Writing", "Marketing", "Business"],
    "profileImage": "https://cloudinary.com/..."
  }
}
```

### 5. Update Profile Image
**PUT** `/api/auth/profile/image`

Update user's profile image.

**Headers**: `Authorization: Bearer <token>`
**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  "profileImage": <file>  // Required: Image file (jpg, png, webp, max 5MB)
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "matric": "STU001",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "schoolName": "University of Lagos",
    "skillCategory": "Freelancer",
    "interests": ["Photography", "Design"],
    "profileImage": "https://cloudinary.com/new-image-url"
  }
}
```

### 6. Get All Users
**GET** `/api/auth/users`

Get paginated list of users for discovery/matching.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)
- `skillCategory` (optional): Filter by skill category (Client|Freelancer|Hybrid)
- `schoolName` (optional): Filter by school name (partial match)

**Example**: `/api/auth/users?page=1&limit=5&skillCategory=Freelancer&schoolName=Lagos`

**Response (200)**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439012",
        "matric": "STU002",
        "email": "jane@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "username": "janesmith",
        "schoolName": "University of Lagos",
        "skillCategory": "Freelancer",
        "interests": ["Writing", "Marketing"],
        "profileImage": "https://cloudinary.com/..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 7. Search Users
**GET** `/api/auth/users/search`

Search users by name, username, school, or interests.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q` (required): Search query string
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example**: `/api/auth/users/search?q=photography&page=1&limit=5`

**Response (200)**:
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439013",
        "matric": "STU003",
        "email": "photographer@example.com",
        "firstName": "Mike",
        "lastName": "Johnson",
        "username": "mikephoto",
        "schoolName": "University of Ibadan",
        "skillCategory": "Freelancer",
        "interests": ["Photography", "Video Editing"],
        "profileImage": "https://cloudinary.com/..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    },
    "query": "photography"
  }
}
```

## Error Responses

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

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Frontend Integration Examples

### JavaScript/Fetch API

```javascript
// Register user
const registerUser = async (formData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: formData // FormData object with all fields including image
  });
  return response.json();
};

// Login user
const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Get profile (with token)
const getProfile = async (token) => {
  const response = await fetch('/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Search users
const searchUsers = async (query, token) => {
  const response = await fetch(`/api/auth/users/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### React Example

```jsx
import { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <div>
      {user && (
        <div>
          <h1>{user.firstName} {user.lastName}</h1>
          <p>@{user.username}</p>
          <p>{user.schoolName}</p>
          <p>Category: {user.skillCategory}</p>
          {user.profileImage && (
            <img src={user.profileImage} alt="Profile" />
          )}
        </div>
      )}
    </div>
  );
};
```

## Environment Variables

Create a `.env` file with:

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

## Swagger Documentation

Interactive API documentation is available at:
- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://studex-backend-api.onrender.com/api-docs`

## Notes for Frontend Developers

1. **Token Storage**: Store JWT tokens securely (localStorage for web, secure storage for mobile)
2. **Error Handling**: Always check the `success` field in responses
3. **File Uploads**: Use FormData for endpoints that accept files
4. **Pagination**: Use the pagination object to implement infinite scroll or page navigation
5. **Search**: Debounce search queries to avoid excessive API calls
6. **Image Display**: Profile images are served from Cloudinary CDN
7. **Validation**: Client-side validation should match server-side rules
8. **CORS**: API supports CORS for cross-origin requests