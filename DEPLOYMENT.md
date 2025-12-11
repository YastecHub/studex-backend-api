# Deployment Guide - StudEx Backend API

## Deploy to Render

### Prerequisites
- GitHub account with your repo pushed
- Render account (https://render.com)
- MongoDB Atlas cluster (free tier available)
- Cloudinary account

### Step-by-Step Deployment

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Create MongoDB Atlas Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user and get connection string
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

#### 3. Deploy to Render
1. Go to https://render.com and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: `studex-backend-api`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or Starter - $7/month for always-on)

#### 4. Add Environment Variables
In Render dashboard, go to **Environment** and add:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studexDb?retryWrites=true&w=majority
JWT_SECRET=your-very-long-secret-key-here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 5. Deploy
Click **Create Web Service** and Render will automatically:
- Install dependencies
- Build the project (`pnpm run build`)
- Start the server (`npm run start`)

### Accessing Your API
After deployment, Render will give you a URL like:
```
https://studex-backend-api.onrender.com
```

Your API endpoints will be:
- **Swagger Docs**: `https://studex-backend-api.onrender.com/api-docs`
- **Signup**: `POST https://studex-backend-api.onrender.com/api/auth/signup`
- **Login**: `POST https://studex-backend-api.onrender.com/api/auth/login`
- **Profile**: `GET https://studex-backend-api.onrender.com/api/auth/profile`

### Important Notes

**Free Tier Limitations:**
- Server spins down after 15 minutes of inactivity
- Cold start (~30 seconds)
- Limited to 0.5 GB RAM

**Recommendation:**
- Use Starter Plan ($7/month) for production to avoid cold starts
- Enable auto-scaling for better performance

### Troubleshooting

**Build fails?**
- Check that all dependencies are in `package.json`
- Verify `tsconfig.json` and `build` script work locally
- Check Render logs

**Connection issues?**
- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas (should allow all: 0.0.0.0/0)
- Test endpoints in Swagger UI after deployment

### CI/CD
Render automatically redeploys when you push to main branch (if connected to GitHub).

## Alternative: Vercel (Not Recommended)
Vercel is better for serverless/frontend, not ideal for your Express backend because:
- 10-60 second request timeout
- Stateless (each request may be different process)
- Better for Next.js/React apps

## Cost Comparison
- **Render Free**: $0/month (with cold starts)
- **Render Starter**: $7/month (always-on, no cold starts)
- **Vercel Free**: $0/month (but limited functionality for backend)
