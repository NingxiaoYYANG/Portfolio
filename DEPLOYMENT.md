# Deployment Guide

This guide will help you deploy your Portfolio website to production.

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Frontend

1. Make sure your frontend builds successfully:
```bash
cd frontend
npm run build
```

2. Update your `.env` file with production API URL:
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd frontend
vercel
```

4. Follow the prompts and add environment variable:
   - `VITE_API_BASE_URL`: Your backend API URL

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Set build command: `npm run build`
6. Set output directory: `dist`
7. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your backend API URL
8. Click "Deploy"

## Backend Deployment (Railway)

### Step 1: Prepare Your Backend

1. Make sure all dependencies are in `requirements.txt`
2. Create a `.env` file with your production settings

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `backend`
6. Add environment variables:
   - `SECRET_KEY`: Generate a secure secret key
   - `MAIL_SERVER`: Your email server (e.g., smtp.gmail.com)
   - `MAIL_PORT`: 587
   - `MAIL_USE_TLS`: true
   - `MAIL_USERNAME`: Your email
   - `MAIL_PASSWORD`: Your app password
   - `MAIL_DEFAULT_SENDER`: Your email
   - `CORS_ORIGINS`: Your Vercel frontend URL
7. Railway will automatically detect Python and install dependencies
8. Your API will be available at `https://your-project.railway.app`

### Step 3: Update Frontend Environment Variable

Update your Vercel environment variable `VITE_API_BASE_URL` to point to your Railway backend URL.

## Backend Deployment (Render)

### Alternative to Railway

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: Your project name
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn run:app`
   - Root Directory: `backend`
5. Add environment variables (same as Railway)
6. Click "Create Web Service"

## Environment Variables Reference

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
CORS_ORIGINS=https://your-frontend.vercel.app
```

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure:
1. Your backend `CORS_ORIGINS` includes your frontend URL
2. URLs don't have trailing slashes
3. Both URLs use HTTPS in production

### API Connection Issues

1. Check that your backend is running
2. Verify the API URL in frontend environment variables
3. Check browser console for errors
4. Test API endpoint directly: `https://your-backend-url/api/health`

### Build Failures

1. Check that all dependencies are installed
2. Verify Node.js and Python versions
3. Check build logs for specific errors
4. Ensure environment variables are set correctly

## Post-Deployment Checklist

- [ ] Frontend is accessible and loads correctly
- [ ] Backend API responds to health check
- [ ] Projects page loads projects from API
- [ ] Contact form submits successfully
- [ ] All animations work correctly
- [ ] Mobile responsive design works
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
