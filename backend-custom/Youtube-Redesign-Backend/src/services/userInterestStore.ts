export interface UserInterestProfile {
    searchHistory: string[];
    topicScores: Record<string, number>;
    lastUpdatedAt: number;
}

export interface UserInterestContext {
    previousSearches: string[];
    preferredTopics: string[];
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
    yazilim: [
        'yazilim', 'kod', 'coding', 'programlama', 'react', 'node', 'python', 'javascript',
        'typescript', 'api', 'backend', 'frontend', 'docker', 'aws', 'algoritma', 'cloud'
    ],
    yemek: [
        'yemek', 'tarif', 'mutfak', 'pasta', 'kek', 'corba', 'kahvalti', 'tatli', 'diyet',
        'food', 'recipe', 'cook', 'chef', 'restaurant'
    ],
    muzik: ['muzik', 'music', 'sarki', 'gitar', 'piyano', 'mix', 'lofi', 'beat', 'album'],
    oyun: ['oyun', 'game', 'gaming', 'fps', 'mmorpg', 'minecraft', 'valorant', 'pubg'],
    spor: ['spor', 'fitness', 'gym', 'workout', 'futbol', 'basketbol', 'kosu', 'antrenman'],
    teknoloji: ['teknoloji', 'tech', 'telefon', 'laptop', 'donanim', 'hardware', 'inceleme']
};

const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const profileStore = new Map<string, UserInterestProfile>();

const detectTopics = (text: string): string[] => {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }

    const tokens = normalized.split(' ').filter(Boolean);
    const matched = new Set<string>();

    Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
        const keywordSet = new Set(keywords);
        if (tokens.some((token) => keywordSet.has(token))) {
            matched.add(topic);
        }
    });

    return Array.from(matched);
};

const ensureProfile = (userId: string): UserInterestProfile => {
    let profile = profileStore.get(userId);
    if (!profile) {
        profile = {
            searchHistory: [],
            topicScores: {},
            lastUpdatedAt: Date.now()
        };
        profileStore.set(userId, profile);
    }
    return profile;
};

const incrementTopics = (profile: UserInterestProfile, topics: string[], weight: number): void => {
    const normalizedWeight = Math.max(0.1, weight);
    const topicList = topics.length > 0 ? topics : ['genel'];
    topicList.forEach((topic) => {
        profile.topicScores[topic] = (profile.topicScores[topic] || 0) + normalizedWeight;
    });
};

const uniqRecent = (list: string[], limit = 60): string[] => {
    const deduped: string[] = [];
    list.forEach((item) => {
        if (!deduped.includes(item)) {
            deduped.push(item);
        }
    });
    return deduped.slice(0, limit);
};

export const userInterestStore = {
    recordSearch: (userId: string, query: string): UserInterestProfile | null => {
        const trimmed = query.trim();
        if (!userId || trimmed.length < 2) {
            return null;
        }

        const profile = ensureProfile(userId);

        profile.searchHistory = uniqRecent([trimmed, ...profile.searchHistory], 80);
        incrementTopics(profile, detectTopics(trimmed), 1);
        profile.lastUpdatedAt = Date.now();

        console.log('[UserInterestStore] Search recorded:', {
            query: trimmed,
            topTopics: Object.entries(profile.topicScores)
                .sort((left, right) => right[1] - left[1])
                .slice(0, 3)
        });

        return profile;
    },

    recordWatch: (userId: string, videoTitle: string): UserInterestProfile | null => {
        const trimmed = videoTitle.trim();
        if (!userId || !trimmed) {
            return null;
        }

        const profile = ensureProfile(userId);

        incrementTopics(profile, detectTopics(trimmed), 2);
        profile.lastUpdatedAt = Date.now();

        console.log('[UserInterestStore] Watch recorded:', { videoTitle: trimmed });
        return profile;
    },

    getContext: (userId: string): UserInterestContext => {
        if (!userId) {
            return { previousSearches: [], preferredTopics: [] };
        }

        const profile = profileStore.get(userId);
        if (!profile) {
            return { previousSearches: [], preferredTopics: [] };
        }

        const preferredTopics = Object.entries(profile.topicScores)
            .sort((left, right) => right[1] - left[1])
            .map(([topic]) => topic)
            .slice(0, 4);

        return {
            previousSearches: profile.searchHistory.slice(0, 20),
            preferredTopics
        };
    },

    clearAll: (): void => {
        profileStore.clear();
    },

    size: (): number => {
        return profileStore.size;
    }
};
