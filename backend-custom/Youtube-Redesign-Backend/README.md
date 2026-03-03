# YouTube Redesign Backend (Custom)

Node.js + Express backend for OAuth, video endpoints, and socket events.

## Requirements

- Node.js 20+
- npm 10+

## Setup

**Copy `.env.example` to `.env` and fill in your own credentials.** Never commit `.env` or use someone else's API keys.

```bash
cp .env.example .env
# Edit .env with your GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and COOKIE_KEY

npm install
npm run dev
```

Server defaults to `http://localhost:5001`.

## Environment Variables

Create `.env` from `.env.example` and set:

**Required:**
- `GOOGLE_CLIENT_ID` — from [Google Cloud Console](https://console.cloud.google.com/) OAuth credentials
- `GOOGLE_CLIENT_SECRET` — from the same OAuth credentials
- `COOKIE_KEY` — a long random string for session encryption

**Optional:**
- `PORT` (default `5001`)
- `FRONTEND_URL` (default `http://localhost:5173`)
- `BACKEND_URL` (default built from `PORT`)
- `GOOGLE_CALLBACK_URL` (default `${BACKEND_URL}/auth/google/callback`)

## Scripts

- `npm run dev`: run with `ts-node-dev`
- `npm run build`: compile TypeScript to `dist`
- `npm run start`: run compiled server
- `npm run test`: placeholder until tests are added

## Docker

`Dockerfile` is included for containerized deployment.
