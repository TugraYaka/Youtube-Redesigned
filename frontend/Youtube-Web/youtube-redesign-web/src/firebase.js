import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import backendConfig from "./config/backendConfig";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseRuntimeConfig = Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
);

export const ensureFirebaseConfigured = () => {
    if (backendConfig.useFirebase && !hasFirebaseRuntimeConfig) {
        throw new Error(
            "Firebase mode is active but Firebase environment variables are missing. Check frontend/.env.example."
        );
    }
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Popup Login Success:", result.user);
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await auth.signOut();
        window.location.reload();
        console.log("User signed out");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};

export { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged };
