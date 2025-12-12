# StudEx API Quick Reference Card

## 🔗 Base URLs
```
Development: http://localhost:3000
Production:  https://studex-backend-api.onrender.com
Swagger:     http://localhost:3000/api-docs
```

## 🔑 Authentication
```javascript
// All requests (except signup/login) need:
headers: {
  'Authorization': 'Bearer <token>'
}
```

## 📋 Endpoints Cheat Sheet

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/profile/image` | Update image |
| GET | `/api/auth/users` | Get all users |
| GET | `/api/auth/users/search?q=query` | Search users |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/services` | Create service |
| GET | `/api/services` | Get all services |
| GET | `/api/services/:id` | Get service |
| GET | `/api/services/my-services` | My services |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Post job |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/my-jobs` | My jobs |

## 📝 Request Examples

### Sign Up
```javascript
POST /api/auth/signup
Content-Type: multipart/form-data

matric: STU001
email: user@example.com
password: password123
firstName: John
lastName: Doe
username: johndoe
schoolName: University of Lagos
skillCategory: Freelancer
interests: ["Design", "Development"]
profileImage: <file>
```

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Service
```javascript
POST /api/services
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: UI/UX Design
description: Professional design services
category: Design
price: 5000
priceType: FIXED
skills: ["Figma", "UI Design"]
portfolioImages: [<file1>, <file2>]
```

### Post Job
```javascript
POST /api/jobs
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Website Development",
  "description": "Need modern website",
  "category": "Development",
  "budget": 25000,
  "deadline": "2024-02-15",
  "skills": ["React", "Node.js"]
}
```

### Get Services
```javascript
GET /api/services?page=1&limit=10&category=Design&search=ui
Authorization: Bearer <token>
```

### Search Users
```javascript
GET /api/auth/users/search?q=photography&page=1
Authorization: Bearer <token>
```

## 📊 Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* data here */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": { "field": "error" }
}
```

## 🎨 Enums

### Categories
```javascript
['Design', 'Development', 'Photography', 'Tutoring', 
 'Writing', 'Beauty', 'Laundry', 'Video']
```

### Skill Categories
```javascript
['Client', 'Freelancer', 'Hybrid']
```

### Price Types
```javascript
['FIXED', 'NEGOTIABLE']
```

### Job Status
```javascript
['open', 'closed', 'completed']
```

## 🔧 Common Query Parameters

```javascript
// Pagination
?page=1&limit=10

// Filter by category
?category=Design

// Search
?search=query

// Filter by skill category
?skillCategory=Freelancer

// Filter by school
?schoolName=Lagos
```

## 💾 Data Models

### User
```typescript
{
  id, matric, email, firstName, lastName,
  username, schoolName, skillCategory,
  interests[], profileImage
}
```

### Service
```typescript
{
  id, freelancerId, title, description,
  category, price, priceType, skills[],
  portfolioImages[], isActive
}
```

### Job
```typescript
{
  id, clientId, title, description,
  category, budget, deadline, skills[],
  status, applicants[]
}
```

## 🚨 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

## 🛠️ Setup Commands

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start

# MongoDB
mongod
```

## 📁 Important Files

```
.env                          # Environment config
src/index.ts                  # Main app
src/routes/                   # API routes
src/controllers/              # Request handlers
src/services/                 # Business logic
src/models/                   # Database models
COMPLETE_API_DOCS.md          # Full docs
FRONTEND_INTEGRATION_GUIDE.md # Frontend guide
```

## 🔍 Testing

```bash
# Swagger UI
http://localhost:3000/api-docs

# Health Check
http://localhost:3000/health

# Test with cURL
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB not connected | Start MongoDB: `mongod` |
| Port in use | Change PORT in .env |
| Token invalid | Check Authorization header format |
| File upload fails | Check Cloudinary credentials |
| CORS error | Backend has CORS enabled, check URL |

## 📞 Quick Links

- **Swagger**: http://localhost:3000/api-docs
- **Health**: http://localhost:3000/health
- **Full Docs**: COMPLETE_API_DOCS.md
- **Frontend Guide**: FRONTEND_INTEGRATION_GUIDE.md
- **Setup Guide**: SETUP_GUIDE.md

---

**Print this for quick reference! 📄**