# Firebase Setup Templates

This folder contains guide files and templates for connecting the project to **Firebase** services (authentication, database, image/video storage) instead of or in addition to the Custom Backend (Express + Postgres).

If you are not using Firebase, you can ignore this folder.

## Before You Start

**Copy `.env.example` to `.env` (or `.env.local`)** and fill in your own Firebase credentials. Never commit `.env` or use someone else's keys.

## Files

1. **`firebase-config.js`**
   - **Where used?** Frontend (Web/Vite/React) app.
   - **Purpose:** Lets the client communicate with Firebase from the browser (auth, data, storage).

2. **`firebase-admin.js`**
   - **Where used?** Backend (Node.js/Express) server.
   - **Purpose:** Admin access to Firebase via Service Account for secure operations, user management (Admin SDK), etc.

## How to Set Up

### A. Frontend (Web)

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Add a Web app and copy the API keys.
3. In the frontend project, copy `.env.example` to `.env.local` and add:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project"
   VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```
4. Run `npm install firebase` in the frontend project.
5. Copy the contents of `firebase-config.js` from this folder into your web project.

### B. Backend (Express Server)

1. In Firebase Console: **Project Settings** > **Service Accounts**.
2. Click **Generate New Private Key** to download the `.json` admin credentials.
3. Copy `.env.example` to `.env` in the backend project and add:
   ```env
   FIREBASE_PROJECT_ID="your_project"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
   ```
   Use the exact format from the JSON; preserve `\n` for line breaks.
4. Run `npm install firebase-admin` in the backend project.
5. Copy `firebase-admin.js` into your backend code.
