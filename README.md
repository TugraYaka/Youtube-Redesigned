# YouTube Redesign

This repo is a full-stack project with a YouTube-like interface and multiple backend strategies.

- Frontend: React + Vite
- Backend (recommended start): Node.js + Express (`custom`)
- Alternative templates: Firebase and Supabase

This README describes the easiest way to set up the project for the first time.

## 1) Project Structure

```text
Youtube-redesign/
├── frontend/
│   └── Youtube-Web/youtube-redesign-web/   # React + Vite frontend
├── backend-custom/
│   └── Youtube-Redesign-Backend/            # Node.js + Express backend
├── backend-firebase/                        # Firebase integration templates
├── backend-supabase/                        # Supabase integration templates
├── AI-ML/                                   # Recommendation systems (JS)
└── README.md
```

## 2) Requirements

- Node.js `20+`
- npm `10+`
- Git

Check versions:

```bash
node -v
npm -v
git --version
```

## 3) Quick Setup (Custom Backend)

Using `custom` mode is the most practical way to get started.

### Step 1: Run the Backend

**Important:** Copy `.env.example` to `.env` and fill in your own credentials. Never commit `.env` or use someone else's keys.

```bash
cd backend-custom/Youtube-Redesign-Backend
cp .env.example .env
```

Edit `.env` and fill in at least these fields with your own values:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
COOKIE_KEY=a_long_random_string_here
PORT=5001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
```

Notes:
- Backend will not start if `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `COOKIE_KEY` are empty.
- Create your own OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/). Do not use placeholder values for production.
- For local testing without Google OAuth, you can use dummy values; the login flow will not work.

Then install and run:

```bash
npm install
npm run dev
```

Expected output: `Server is running on port 5001`

### Step 2: Run the Frontend (new terminal)

**Important:** Copy `.env.example` to `.env.local` and add your own Google Client ID (must match the backend project).

```bash
cd frontend/Youtube-Web/youtube-redesign-web
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
VITE_BACKEND_MODE=custom
VITE_BACKEND_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com   # Must match backend Google project
```

Then:

```bash
npm install
npm run dev
```

Open in browser:

- `http://localhost:5173`

## 4) How to Verify It Works

- Frontend loads: `http://localhost:5173`
- Backend is up: `http://localhost:5001/test` (response: `Backend is working!`)
- Login button redirects to Google: `/auth/google`

## 5) Backend Modes (Custom / Firebase / Supabase)

Frontend mode is selected via:

`frontend/Youtube-Web/youtube-redesign-web/.env.local`

```env
VITE_BACKEND_MODE=custom   # or firebase / supabase
```

### `custom` mode
- Requires Express backend (`backend-custom/...`).
- Video upload, `/api/*` routes, and Socket.IO are active.

### `firebase` mode
- Fill in `VITE_FIREBASE_*` variables. See `backend-firebase/README.md`.

### `supabase` mode
- Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. See `backend-supabase/README.md`.

## 6) Common Commands

### Frontend

```bash
cd frontend/Youtube-Web/youtube-redesign-web
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend (Custom)

```bash
cd backend-custom/Youtube-Redesign-Backend
npm run dev
npm run build
npm run start
```

## 7) Troubleshooting

1. **`Missing required environment variable`**
   - One of the required fields in backend `.env` is empty. Copy `.env.example` to `.env` and fill in all required values.

2. **Frontend login errors**
   - `VITE_BACKEND_MODE` does not match your env setup (e.g. mode is `supabase` but Supabase env vars are missing).

3. **CORS / redirect issues**
   - Ensure backend `FRONTEND_URL` and frontend `VITE_BACKEND_URL` match your local ports.

4. **npm install failures**
   - Use Node.js `20+`. Try removing `node_modules` and running `npm install` again.

## 8) Additional Docs

- Frontend: `frontend/README.md`
- Custom backend: `backend-custom/README.md`
- Contributing: `CONTRIBUTING.md`
- Security: `SECURITY.md`
- Code of conduct: `CODE_OF_CONDUCT.md`

## License

MIT. See `LICENSE` for details.
