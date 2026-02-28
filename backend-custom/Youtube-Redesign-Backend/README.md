# YouTube Redesign Backend (Custom)

Node.js + Express backend for OAuth, video endpoints, and socket events.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Server defaults to `http://localhost:5001`.

## Environment Variables

Required:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `COOKIE_KEY`

Optional:

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
