import dotenv from 'dotenv';
dotenv.config();

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const port = Number(process.env.PORT || 5001);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;

export const keys = {
    googleClientID: requireEnv('GOOGLE_CLIENT_ID'),
    googleClientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    cookieKey: requireEnv('COOKIE_KEY'),
    port,
    frontendUrl,
    backendUrl,
    googleCallbackURL: process.env.GOOGLE_CALLBACK_URL || `${backendUrl}/auth/google/callback`
};
