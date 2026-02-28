import backendConfig from "../config/backendConfig";

const toQueryString = (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (Array.isArray(value)) {
            if (value.length > 0) {
                searchParams.set(key, value.join(','));
            }
            return;
        }

        searchParams.set(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

const fetchBridge = async (path, params) => {
    const query = toQueryString(params);
    const endpoint = `${path}${query}`;
    const response = await fetch(endpoint, {
        credentials: 'include'
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`[AI-Bridge] Request failed (${response.status}): ${text}`);
    }

    return response.json();
};

export const recommendationService = {
    getVideoRecommendations: async (options = {}) => {
        if (!backendConfig.useCustomBackend) {
            return { ok: true, recommendations: [] };
        }

        const payload = await fetchBridge('/api/bridge/video-recommendations', options);
        console.debug('[AI-Bridge][Frontend] Video recommendations payload:', payload);
        return payload;
    },

    getSearchRecommendations: async (options = {}) => {
        if (!backendConfig.useCustomBackend) {
            return { ok: true, recommendations: [] };
        }

        const payload = await fetchBridge('/api/bridge/search-recommendations', options);
        console.debug('[AI-Bridge][Frontend] Search recommendations payload:', payload);
        return payload;
    },

    runScan: async () => {
        if (!backendConfig.useCustomBackend) {
            return { ok: true, diagnostics: null };
        }

        const payload = await fetchBridge('/api/bridge/scan');
        console.debug('[AI-Bridge][Frontend] Bridge scan diagnostics:', payload);
        return payload;
    },

    trackWatch: async (videoTitle, userId) => {
        if (!backendConfig.useCustomBackend) {
            return { ok: true };
        }

        const response = await fetch('/api/bridge/track-watch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ videoTitle, userId })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`[AI-Bridge] Track watch failed (${response.status}): ${text}`);
        }

        return response.json();
    }
};
