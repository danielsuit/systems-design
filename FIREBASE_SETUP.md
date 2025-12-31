# Firebase Deployment Guide

Your React + Vite project is now configured for Firebase Hosting!

## Setup Instructions

### 1. Create a Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Create a new project"
- Enter your project name and complete setup

### 2. Update Firebase Project ID
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 3. Login to Firebase
```bash
npm run firebase:login
```
This will open a browser to authenticate your Firebase account.

### 4. Build and Deploy
```bash
npm run build
npx firebase deploy --only hosting
```

This will:
1. Build your React app with Vite (outputs to `dist/`)
2. Deploy the `dist/` folder to Firebase Hosting

## Additional Firebase Commands

- **Preview locally**: `firebase emulators:start`
- **View deployment logs**: `firebase functions:log`
- **View hosting**: `firebase hosting:sites`

## Configuration Details

- **Public Directory**: `dist/` (Vite build output)
- **Rewrite Rules**: All routes redirect to `/index.html` for React Router
- **Cache Headers**: Static assets (JS, CSS, fonts) cached for 1 year
- **Build Command**: `npm run build`

## Environment Setup

Your project now includes:
- ✅ `firebase.json` - Firebase hosting configuration
- ✅ `.firebaserc` - Firebase project configuration
- ✅ `firebase-tools` - CLI for deployment
- ✅ `.gitignore` - Excludes Firebase cache files

## Notes

- The app will be available at: `https://your-project-id.web.app`
- All non-file routes will serve `index.html` (perfect for React Router)
- Static assets have long cache times for better performance
