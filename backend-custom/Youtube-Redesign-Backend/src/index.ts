import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { keys } from './config/keys';
import './services/passport'; 
import { videoRouter } from './routes/videoRoutes';
import { aiBridgeRouter } from './routes/aiBridgeRoutes';

import cors from 'cors'; 

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = keys.frontendUrl;

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true
    }
});


app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json({ limit: '512kb' }));


app.use((req: any, res, next) => {
    req.io = io;
    next();
});

app.use(
    cookieSession({
        name: 'session',
        keys: [keys.cookieKey],
        maxAge: 30 * 24 * 60 * 60 * 1000 
    })
);


app.use((req: any, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb: any) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb: any) => {
            cb();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(videoRouter);
app.use(aiBridgeRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get(
    '/auth/google/callback',
    (req, res, next) => {
        console.log('=== CALLBACK ROUTE HIT ===');
        console.log('Query params:', req.query);
        next();
    },
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        failureMessage: true
    }),
    (req, res) => {
        console.log('=== CALLBACK REACHED ===');
        console.log('User object:', req.user);
        console.log('Session:', req.session);
        console.log('Authentication successful! Redirecting to frontend...');
        
        res.redirect(`${FRONTEND_URL}/`);
    }
);


app.get('/auth/failure', (req, res) => {
    console.log('=== AUTH FAILED ===');
    console.log('Session:', req.session);
    res.send('Authentication failed. Check server logs.');
});


app.get('/test', (req, res) => {
    res.send('Backend is working!');
});

app.get('/api/logout', (req, res, next) => {
    console.log('Logging out user...');
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(`${FRONTEND_URL}/`);
    });
});

app.get('/api/current_user', (req, res) => {
    res.send(req.user || null);
});

const PORT = keys.port;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {
        
    });
});
