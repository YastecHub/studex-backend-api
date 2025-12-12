# StudEx Complete API Documentation

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://studex-backend-api.onrender.com`
- **Swagger Docs**: `/api-docs`

## Authentication
All endpoints (except signup/login) require Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management](#user-management)
3. [Services Endpoints](#services-endpoints)
4. [Jobs Endpoints](#jobs-endpoints)
5. [Error Responses](#error-responses)

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Register a new user with complete profile.

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  "matric": "STU001",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "schoolName": "University of Lagos",
  "skillCategory": "Freelancer",  // Client | Freelancer | Hybrid
  "interests": ["Photography", "Design"],
  "profileImage": <file>  // Optional
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

### 2. Login
**POST** `/api/auth/login`

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
    "user": { /* user object */ }
  }
}
```

### 3. Get Profile
**GET** `/api/auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": { /* user object */ }
}
```

---

## User Management

### 4. Update Profile
**PUT** `/api/auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",
  "schoolName": "University of Ibadan",
  "skillCategory": "Client",
  "interests": ["Writing", "Marketing"]
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

### 5. Update Profile Image
**PUT** `/api/auth/profile/image`

**Headers**: `Authorization: Bearer <token>`

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  "profileImage": <file>  // Required
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": { /* user object with new image */ }
}
```

### 6. Get All Users
**GET** `/api/auth/users`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)
- `skillCategory` (optional): Filter by Client|Freelancer|Hybrid
- `schoolName` (optional): Filter by school name

**Example**: `/api/auth/users?page=1&limit=10&skillCategory=Freelancer`

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

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Results per page

**Example**: `/api/auth/users/search?q=photography&page=1`

**Response (200)**:
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "users": [ /* array of matching users */ ],
    "pagination": { /* pagination info */ },
    "query": "photography"
  }
}
```

---

## Services Endpoints

### 8. Create Service (Freelancers Only)
**POST** `/api/services`

**Headers**: `Authorization: Bearer <token>`

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  "title": "Professional UI/UX Design",
  "description": "I will design clean, modern mobile app interfaces",
  "category": "Design",  // Design|Development|Photography|Tutoring|Writing|Beauty|Laundry|Video
  "price": 5000,
  "priceType": "FIXED",  // FIXED | NEGOTIABLE
  "skills": ["Figma", "UI Design", "Prototyping"],
  "portfolioImages": [<file1>, <file2>]  // Optional, max 5 images
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "freelancerId": "507f1f77bcf86cd799439011",
    "freelancerName": "John Doe",
    "freelancerAvatar": "https://cloudinary.com/...",
    "freelancerUsername": "johndoe",
    "title": "Professional UI/UX Design",
    "description": "I will design clean, modern mobile app interfaces",
    "category": "Design",
    "price": 5000,
    "priceType": "FIXED",
    "skills": ["Figma", "UI Design", "Prototyping"],
    "portfolioImages": ["https://cloudinary.com/..."],
    "rating": 4.8,
    "reviewsCount": 12,
    "aiMatchScore": 95,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 9. Get All Services
**GET** `/api/services`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Services per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title, description, skills

**Example**: `/api/services?page=1&limit=10&category=Design&search=ui`

**Response (200)**:
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": {
    "services": [ /* array of services */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### 10. Get Service by ID
**GET** `/api/services/:id`

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Service retrieved successfully",
  "data": { /* service object */ }
}
```

### 11. Get My Services
**GET** `/api/services/my-services`

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "User services retrieved successfully",
  "data": [ /* array of user's services */ ]
}
```

---

## Jobs Endpoints

### 12. Post a Job (Clients Only)
**POST** `/api/jobs`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "E-commerce Website Development",
  "description": "Need a modern e-commerce website with payment integration",
  "category": "Development",
  "budget": 25000,
  "deadline": "2024-02-15",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "clientId": "507f1f77bcf86cd799439011",
    "clientName": "John Doe",
    "clientAvatar": "https://cloudinary.com/...",
    "title": "E-commerce Website Development",
    "description": "Need a modern e-commerce website with payment integration",
    "category": "Development",
    "budget": 25000,
    "deadline": "2024-02-15T00:00:00.000Z",
    "skills": ["React", "Node.js", "MongoDB"],
    "status": "open",
    "applicants": 0,
    "postedDate": "Just now",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 13. Get All Jobs
**GET** `/api/jobs`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Jobs per page (default: 10)
- `category` (optional): Filter by category

**Example**: `/api/jobs?page=1&limit=10&category=Development`

**Response (200)**:
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": {
    "jobs": [ /* array of jobs */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 30,
      "pages": 3
    }
  }
}
```

### 14. Get My Posted Jobs
**GET** `/api/jobs/my-jobs`

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "User jobs retrieved successfully",
  "data": [ /* array of user's posted jobs */ ]
}
```

---

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
  "message": "Resource not found"
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

---

## Frontend Integration Examples

### React/TypeScript Example

```typescript
// API Service
const API_BASE_URL = 'http://localhost:3000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create Service
export const createService = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData
  });
  return response.json();
};

// Get All Services
export const getServices = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => {
  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${API_BASE_URL}/api/services?${queryString}`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  );
  return response.json();
};

// Post a Job
export const postJob = async (jobData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(jobData)
  });
  return response.json();
};

// Search Users
export const searchUsers = async (query: string, page = 1) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/users/search?q=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  );
  return response.json();
};
```

### Usage in Components

```typescript
// In a React component
import { useState, useEffect } from 'react';
import { getServices } from './api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getServices({ 
          page: 1, 
          limit: 10, 
          category: 'Design' 
        });
        
        if (result.success) {
          setServices(result.data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        services.map(service => (
          <div key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>₦{service.price.toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};
```

---

## Quick Start Guide

### 1. Setup Environment
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/studex
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access Swagger Documentation
Open browser: `http://localhost:3000/api-docs`

### 4. Test Endpoints
Use Swagger UI or Postman to test all endpoints.

---

## Data Models

### User Model
```typescript
{
  matric: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  schoolName: string;
  skillCategory: 'Client' | 'Freelancer' | 'Hybrid';
  interests: string[];
  profileImage?: string;
}
```

### Service Model
```typescript
{
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'NEGOTIABLE';
  skills: string[];
  portfolioImages: string[];
  isActive: boolean;
}
```

### Job Model
```typescript
{
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  skills: string[];
  status: 'open' | 'closed' | 'completed';
  applicants: string[];
}
```

---

## Notes for Frontend Developers

1. **Token Management**: Store JWT in localStorage/sessionStorage
2. **Error Handling**: Always check `success` field in responses
3. **File Uploads**: Use FormData for multipart requests
4. **Pagination**: Implement infinite scroll or pagination UI
5. **Search**: Debounce search queries (300-500ms)
6. **Categories**: Use predefined categories from backend
7. **Image Display**: All images served from Cloudinary CDN
8. **CORS**: API supports cross-origin requests

---

## Support

- **Swagger Docs**: `/api-docs`
- **Health Check**: `/health`
- **API Version**: `1.0.0`