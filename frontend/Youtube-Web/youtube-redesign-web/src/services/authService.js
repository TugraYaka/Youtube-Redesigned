import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, ensureFirebaseConfigured } from "../firebase";
import backendConfig from "../config/backendConfig";
import { supabase, ensureSupabaseConfigured } from "../config/supabaseClient";

const listeners = [];

const notifyListeners = (user) => {
    listeners.forEach(listener => listener(user));
};

export const authService = {
    signIn: async () => {
        
        const activeBackends = [backendConfig.useFirebase, backendConfig.useCustomBackend, backendConfig.useSupabase].filter(Boolean).length;
        if (activeBackends > 1) {
            throw new Error("CONFIGURATION ERROR: Multiple backends are set to TRUE. Only one backend can be active at a time. Please update src/config/backendConfig.js.");
        }

        if (activeBackends === 0) {
            console.warn("No backend selected!");
            return null;
        }

        try {
            if (backendConfig.useFirebase) {
                ensureFirebaseConfigured();
                
                const result = await signInWithPopup(auth, provider);
                console.log("Firebase Login Success:", result.user);
                return result.user;
            } else if (backendConfig.useCustomBackend) {
                
                console.log("Custom Backend: Redirecting to /auth/google...");
                window.location.href = '/auth/google';
                return null;
            } else if (backendConfig.useSupabase) {
                ensureSupabaseConfigured();
                
                console.log("Supabase: Signing in with Google...");
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error("Auth Service Error:", error);
            throw error;
        }
    },

    signOut: async () => {
        try {
            if (backendConfig.useFirebase) {
                ensureFirebaseConfigured();
                await signOut(auth);
                console.log("User signed out via Firebase");
                window.location.reload();
            } else if (backendConfig.useCustomBackend) {
                console.log("Redirecting to backend logout...");
                window.location.href = '/api/logout';
            } else if (backendConfig.useSupabase) {
                ensureSupabaseConfigured();
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                console.log("User signed out via Supabase");
                window.location.reload();
            }
        } catch (error) {
            console.error("Sign Out Error:", error);
            throw error;
        }
    },

    
    onAuthStateChanged: (callback) => {
        listeners.push(callback);

        
        if (backendConfig.useFirebase) {
            ensureFirebaseConfigured();
            return onAuthStateChanged(auth, user => {
                console.log("Auth State Changed (Firebase Mode Active)");
                notifyListeners(user);
            });
        }

        
        if (backendConfig.useCustomBackend) {
            fetch('/api/current_user', { credentials: 'include' })
                .then(async res => {
                    const text = await res.text();
                    try {
                        return text ? JSON.parse(text) : null;
                    } catch {
                        console.warn("Failed to parse current user:", text);
                        return null;
                    }
                })
                .then(user => {
                    if (user) {
                        const customUser = {
                            uid: user.id || user.googleId,
                            displayName: user.displayName,
                            email: user.emails && user.emails.length > 0 ? user.emails[0].value : "",
                            photoURL: user.photos && user.photos.length > 0 ? user.photos[0].value : "",
                            isCustomBackend: true
                        };
                        notifyListeners(customUser);
                    } else {
                        notifyListeners(null);
                    }
                })
                .catch(err => {
                    console.error("Error fetching current user:", err);
                    notifyListeners(null);
                });

            return () => {
                const index = listeners.indexOf(callback);
                if (index > -1) listeners.splice(index, 1);
            };
        }

        
        if (backendConfig.useSupabase) {
            ensureSupabaseConfigured();
            
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    const user = {
                        uid: session.user.id,
                        displayName: session.user.user_metadata.full_name || session.user.user_metadata.name,
                        email: session.user.email,
                        photoURL: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
                        isSupabase: true
                    };
                    notifyListeners(user);
                } else {
                    notifyListeners(null);
                }
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                console.log("Supabase Auth State Changed:", _event);
                if (session?.user) {
                    const user = {
                        uid: session.user.id,
                        displayName: session.user.user_metadata.full_name || session.user.user_metadata.name,
                        email: session.user.email,
                        photoURL: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
                        isSupabase: true
                    };
                    notifyListeners(user);
                } else {
                    notifyListeners(null);
                }
            });

            return () => {
                subscription.unsubscribe();
                const index = listeners.indexOf(callback);
                if (index > -1) listeners.splice(index, 1);
            };
        }

        return () => { };
    }
};
