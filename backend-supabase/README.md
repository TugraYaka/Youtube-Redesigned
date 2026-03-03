# Supabase Setup Templates

This folder contains guide files and templates for building with **Supabase** (Postgres-based, Firebase alternative) instead of or in addition to the Custom Backend (Express + Postgres).

If you are not using Supabase, you can ignore this folder.

## Before You Start

**Copy `.env.example` to `.env`** and fill in your own Supabase credentials. Never commit `.env` or use someone else's keys.

## Files

1. **`supabase-config.js`**
   - **Where used?** Frontend (Web/Vite/React) app.
   - **Purpose:** Lets the client access Supabase services (Auth, Database, Storage) with "anon" (anonymous/public) permissions.

2. **`supabase-admin.js`**
   - **Where used?** Backend (Node.js/Express) server.
   - **Purpose:** Full admin access via Service Role Key to the database and Auth, bypassing security rules when needed.

## How to Set Up

### A. Frontend (Web)

1. Create a project at [Supabase](https://supabase.com/) (Organization & Project).
2. Go to **Dashboard > Settings > API** and copy `Project URL` and the `anon` public key.
3. Copy `.env.example` to `.env.local` in the frontend project and add:
   ```env
   VITE_SUPABASE_URL="https://xxxxx.supabase.co"
   VITE_SUPABASE_ANON_KEY="your_anon_public_key"
   ```
4. Run `npm install @supabase/supabase-js` in the frontend project.
5. Copy `supabase-config.js` from this folder into your project (e.g. `src/supabase/`).

### B. Backend (Express Server)

1. In Supabase Dashboard > **Settings > API**, copy the `service_role` secret key.
2. Copy `.env.example` to `.env` in the backend project and add:
   ```env
   SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_secret_key"
   ```
3. Run `npm install @supabase/supabase-js` in the backend project.
4. Copy `supabase-admin.js` into your backend config and import it where admin access is needed.
