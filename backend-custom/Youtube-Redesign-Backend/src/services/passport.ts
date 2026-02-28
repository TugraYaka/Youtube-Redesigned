
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { keys } from '../config/keys';
import fs from 'fs';
import path from 'path';



interface User {
    id: string;
    googleId: string;
    displayName: string;
    emails: any[];
    photos: any[];
}


const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');


if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}


let usersDB: User[] = [];
try {
    if (fs.existsSync(USERS_FILE)) {
        const fileData = fs.readFileSync(USERS_FILE, 'utf-8');
        usersDB = JSON.parse(fileData);
        console.log(`Loaded ${usersDB.length} users from storage.`);
    } else {
        console.log('No user storage found. Creating new database.');
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
} catch (error) {
    console.error('Error loading user database:', error);
    usersDB = []; 
}


const saveUsers = () => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersDB, null, 2));
        console.log('User database saved.');
    } catch (error) {
        console.error('Error saving user database:', error);
    }
};


passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
    
    const existingUser = usersDB.find(u => u.id === id);
    done(null, existingUser || null);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: keys.googleCallbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('--- Google Auth Callback ---');
            console.log('User ID:', profile.id);
            console.log('Name:', profile.name?.givenName);
            console.log('Surname:', profile.name?.familyName);
            console.log('Full Name:', profile.displayName);
            console.log('Emails:', profile.emails?.map(e => e.value).join(', '));
            console.log('Photos:', profile.photos?.map(p => p.value).join(', '));

            
            let existingUser = usersDB.find(u => u.googleId === profile.id);

            if (existingUser) {
                
                console.log('User found in DB:', existingUser);
                return done(null, existingUser);
            }

            
            const newUser: User = {
                id: profile.id, 
                googleId: profile.id,
                displayName: profile.displayName,
                emails: profile.emails || [],
                photos: profile.photos || []
            };

            usersDB.push(newUser);
            saveUsers(); 

            console.log('New user created and saved:', newUser);
            done(null, newUser);
        }
    )
);
