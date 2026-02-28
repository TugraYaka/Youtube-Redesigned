# YouTube Redesign Web (Frontend)

React + Vite frontend for the YouTube redesign project.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Set values in `.env.local`.

### Core

- `VITE_BACKEND_MODE`: `custom`, `firebase`, or `supabase`
- `VITE_BACKEND_URL`: backend URL (default `http://localhost:5001`)
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client id

### Firebase Mode

Required only when `VITE_BACKEND_MODE=firebase`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

### Supabase Mode

Required only when `VITE_BACKEND_MODE=supabase`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run lint`: lint source files
- `npm run preview`: preview production build

## Notes

- Vite proxy targets `VITE_BACKEND_URL` for `/api` and `/auth` routes.
- Custom backend mode expects the backend server running separately.
