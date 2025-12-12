# StudEx Backend Setup Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Cloudinary account (for image uploads)
- Git installed

## Step-by-Step Setup

### 1. Clone & Install

```bash
cd studex-backend-api
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create `.env` file in root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/studex
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studex

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (Get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Option B: MongoDB Atlas**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Add to `.env` as `MONGODB_URI`

### 4. Setup Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Create free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Add to `.env` file

### 5. Run Development Server

```bash
npm run dev
# or
pnpm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📚 Swagger docs available at http://localhost:3000/api-docs
```

### 6. Verify Setup

Open browser and visit:
- http://localhost:3000 - Should show API info
- http://localhost:3000/health - Should show server status
- http://localhost:3000/api-docs - Should show Swagger UI

## Testing the API

### Using Swagger UI

1. Go to http://localhost:3000/api-docs
2. Click on "POST /api/auth/signup"
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"
6. Copy the token from response

### Using Postman

1. Create new request
2. Set method to POST
3. URL: `http://localhost:3000/api/auth/signup`
4. Body → form-data:
   ```
   matric: STU001
   email: test@example.com
   password: password123
   firstName: John
   lastName: Doe
   username: johndoe
   schoolName: University of Lagos
   skillCategory: Freelancer
   interests: ["Design", "Development"]
   ```
5. Send request
6. Copy token from response

### Using cURL

```bash
# Sign Up
curl -X POST http://localhost:3000/api/auth/signup \
  -F "matric=STU001" \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "username=johndoe" \
  -F "schoolName=University of Lagos" \
  -F "skillCategory=Freelancer" \
  -F "interests=[\"Design\",\"Development\"]"

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Check if MongoDB is running: `mongod --version`
2. Start MongoDB service
3. Verify connection string in `.env`

### Issue: Cloudinary Upload Fails

**Error**: `Cloudinary upload failed`

**Solution**:
1. Verify Cloudinary credentials in `.env`
2. Check internet connection
3. Verify API key is active in Cloudinary dashboard

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
PORT=3001
```

### Issue: JWT Token Invalid

**Error**: `Invalid or expired token`

**Solution**:
1. Check if JWT_SECRET is set in `.env`
2. Verify token is being sent in Authorization header
3. Token format: `Bearer <token>`

### Issue: File Upload Not Working

**Error**: `Profile image upload failed`

**Solution**:
1. Check file size (max 5MB)
2. Verify file type (jpg, png, webp only)
3. Check Cloudinary credentials
4. Ensure using `multipart/form-data`

## Development Tips

### Hot Reload

The dev server uses `ts-node` which automatically reloads on file changes.

### Database GUI Tools

**MongoDB Compass** (Recommended)
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- View collections: `studex` database

**Studio 3T**
- Download: https://studio3t.com/download/
- Free for non-commercial use

### API Testing Tools

**Postman** (Recommended)
- Download: https://www.postman.com/downloads/
- Import Swagger JSON from `/api-docs`

**Insomnia**
- Download: https://insomnia.rest/download
- Lightweight alternative

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- Thunder Client

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment mode |
| MONGODB_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | JWT signing secret |
| JWT_EXPIRE | No | 7d | Token expiration time |
| CLOUDINARY_CLOUD_NAME | Yes | - | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Yes | - | Cloudinary API key |
| CLOUDINARY_API_SECRET | Yes | - | Cloudinary API secret |

## Next Steps

1. ✅ Setup complete
2. 📖 Read `COMPLETE_API_DOCS.md` for all endpoints
3. 🎨 Check `FRONTEND_INTEGRATION_GUIDE.md` for frontend integration
4. 🧪 Test all endpoints using Swagger UI
5. 🚀 Start building your frontend!

## Support

- **Documentation**: See `COMPLETE_API_DOCS.md`
- **Frontend Guide**: See `FRONTEND_INTEGRATION_GUIDE.md`
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run watch        # Watch mode for TypeScript compilation

# Database
mongod               # Start MongoDB
mongo                # MongoDB shell

# Git
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to remote
```

Happy coding! 🚀