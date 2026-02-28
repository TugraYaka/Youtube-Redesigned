const normalizeMode = (value) => {
    const mode = (value || '').trim().toLowerCase();
    return ['firebase', 'custom', 'supabase'].includes(mode) ? mode : 'custom';
};

const mode = normalizeMode(import.meta.env.VITE_BACKEND_MODE);

const backendConfig = Object.freeze({
    mode,
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
    useFirebase: mode === 'firebase',
    useCustomBackend: mode === 'custom',
    useSupabase: mode === 'supabase'
});

export default backendConfig;
