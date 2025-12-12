# Vercel Deployment Guide

## What I Fixed:

1. **Created `vercel.json`** - Configures Vercel to handle client-side routing properly
2. **Created `api/chat.js`** - Serverless function for the backend API
3. **Updated `Search.jsx`** - Uses different API URLs for development vs production
4. **Created `.vercelignore`** - Excludes unnecessary files from deployment

## Deployment Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel configuration and serverless API"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Add Environment Variables in Vercel

In your Vercel project settings, add these environment variables:
- `MODAL_TOKEN_ID` - Your Modal token ID
- `MODAL_TOKEN_SECRET` - Your Modal token secret

### 4. Redeploy

After adding environment variables, redeploy the project.

## How It Works:

- **Frontend**: Built with Vite and served as static files
- **Backend**: Runs as a serverless function at `/api/chat`
- **Routing**: `vercel.json` ensures all routes serve `index.html` for client-side routing
- **Development**: Run `npm start` - uses localhost:3001 for API
- **Production**: API calls go to `/api/chat` (Vercel serverless function)

## Troubleshooting:

If you still get 404 errors:
1. Make sure environment variables are set in Vercel dashboard
2. Check build logs in Vercel for errors
3. Ensure `dist` folder is being created during build
4. Clear Vercel cache and redeploy

## Local Development:

```bash
# Start both frontend and backend
npm start

# Or run separately:
npm run dev      # Frontend on port 5173
npm run server   # Backend on port 3001
```
