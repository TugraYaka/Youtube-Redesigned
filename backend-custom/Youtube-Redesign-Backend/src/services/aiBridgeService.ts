import path from 'path';
import { videoStore, Video } from './videoStore';
import { userInterestStore } from './userInterestStore';

export interface VideoRecommendationFeatures {
    recencyScore: number;
    popularityScore: number;
    channelAffinity: number;
    durationFit: number;
    semanticMatch: number;
}

export interface SearchRecommendationFeatures {
    lexicalSimilarity: number;
    popularityScore: number;
    freshnessScore: number;
    historyBoost: number;
    intentBoost: number;
}

export interface VideoRecommendationContext {
    query?: string;
    preferredChannels?: string[];
    recentWatchDurationSec?: number;
    historyKeywords?: string[];
    debug?: boolean;
}

export interface SearchRecommendationContext {
    query?: string;
    previousSearches?: string[];
    preferredTopics?: string[];
    userId?: string;
    limit?: number;
    debug?: boolean;
}

export interface VideoRecommendationResult {
    video: Video;
    score: number;
    weightedSum: number;
    features: VideoRecommendationFeatures;
}

export interface SearchRecommendationResult {
    suggestion: string;
    score: number;
    weightedSum: number;
    source: 'video_title' | 'history' | 'trending' | 'personalized_ai';
    features: SearchRecommendationFeatures;
}

interface VideoMlModule {
    getVideoRecommendations: (
        videos: Video[],
        context: VideoRecommendationContext,
        limit?: number
    ) => VideoRecommendationResult[];
}

interface SearchMlModule {
    getSearchRecommendations: (
        videos: Video[],
        context: SearchRecommendationContext
    ) => SearchRecommendationResult[];
}

const PROJECT_ROOT = path.resolve(__dirname, '../../../../');
const VIDEO_ML_PATH = path.join(PROJECT_ROOT, 'AI-ML', 'videoRecommendationSystem.js');
const SEARCH_ML_PATH = path.join(PROJECT_ROOT, 'AI-ML', 'searchRecommendationSystem.js');

const loadVideoMlModule = (): VideoMlModule => {
    return require(VIDEO_ML_PATH) as VideoMlModule;
};

const loadSearchMlModule = (): SearchMlModule => {
    return require(SEARCH_ML_PATH) as SearchMlModule;
};

export interface VideoBridgeRequest {
    limit?: number;
    query?: string;
    preferredChannels?: string[];
    recentWatchDurationSec?: number;
    historyKeywords?: string[];
    debug?: boolean;
}

export interface SearchBridgeRequest {
    query?: string;
    previousSearches?: string[];
    preferredTopics?: string[];
    userId?: string;
    trackQuery?: boolean;
    limit?: number;
    debug?: boolean;
}

const mergeUnique = (primary: string[], secondary: string[]): string[] => {
    const deduped: string[] = [];
    [...primary, ...secondary].forEach((item) => {
        if (!item || deduped.includes(item)) {
            return;
        }
        deduped.push(item);
    });
    return deduped;
};

const clampPositiveInt = (value: number | undefined, fallback: number): number => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return fallback;
    }

    return Math.max(1, Math.floor(value));
};

export const aiBridgeService = {
    getVideoRecommendations: (request: VideoBridgeRequest) => {
        const { getVideoRecommendations } = loadVideoMlModule();
        const data = videoStore.getAll();
        const videos = data.videos;
        const limit = clampPositiveInt(request.limit, 12);
        const context: VideoRecommendationContext = {
            query: request.query,
            preferredChannels: request.preferredChannels,
            recentWatchDurationSec: request.recentWatchDurationSec,
            historyKeywords: request.historyKeywords,
            debug: request.debug
        };

        console.log('[AI-Bridge][Video] Incoming request:', {
            videoCount: videos.length,
            limit,
            query: context.query,
            preferredChannels: context.preferredChannels,
            recentWatchDurationSec: context.recentWatchDurationSec,
            historyKeywords: context.historyKeywords,
            debug: context.debug
        });

        const recommendations = getVideoRecommendations(videos, context, limit);

        console.log(`[AI-Bridge][Video] Generated ${recommendations.length} recommendations.`);

        return recommendations;
    },

    getSearchRecommendations: (request: SearchBridgeRequest) => {
        const { getSearchRecommendations } = loadSearchMlModule();
        const data = videoStore.getAll();
        const videos = data.videos;
        const limit = clampPositiveInt(request.limit, 15);
        const userContext = request.userId
            ? userInterestStore.getContext(request.userId)
            : { previousSearches: [], preferredTopics: [] };
        const mergedPreviousSearches = mergeUnique(
            request.previousSearches ?? [],
            userContext.previousSearches
        ).slice(0, 30);
        const mergedPreferredTopics = mergeUnique(
            request.preferredTopics ?? [],
            userContext.preferredTopics
        ).slice(0, 5);

        if (request.userId && request.trackQuery !== false && request.query) {
            userInterestStore.recordSearch(request.userId, request.query);
        }

        const context: SearchRecommendationContext = {
            query: request.query,
            previousSearches: mergedPreviousSearches,
            preferredTopics: mergedPreferredTopics,
            userId: request.userId,
            limit,
            debug: request.debug
        };

        console.log('[AI-Bridge][Search] Incoming request:', {
            videoCount: videos.length,
            userScope: request.userId ? 'authenticated' : 'anonymous',
            query: context.query,
            previousSearches: context.previousSearches,
            preferredTopics: context.preferredTopics,
            limit,
            debug: context.debug
        });

        const recommendations = getSearchRecommendations(videos, context);

        console.log(`[AI-Bridge][Search] Generated ${recommendations.length} suggestions.`);

        return recommendations;
    },

    trackUserWatch: (userId: string, videoTitle: string) => {
        if (!userId) {
            return null;
        }

        return userInterestStore.recordWatch(userId, videoTitle);
    },

    runBridgeScan: () => {
        const { getVideoRecommendations } = loadVideoMlModule();
        const { getSearchRecommendations } = loadSearchMlModule();
        const data = videoStore.getAll();
        const videos = data.videos;

        const videoProbe = getVideoRecommendations(videos, { debug: false }, Math.min(videos.length || 1, 3));
        const searchProbe = getSearchRecommendations(videos, { query: '', debug: false, limit: 5 });

        const diagnostics = {
            timestamp: new Date().toISOString(),
            totalVideos: videos.length,
            topVideoProbe: videoProbe.map((item) => ({
                id: item.video.id,
                title: item.video.title,
                score: item.score
            })),
            topSearchProbe: searchProbe.map((item) => ({
                suggestion: item.suggestion,
                source: item.source,
                score: item.score
            }))
        };

        console.log('[AI-Bridge][Scan] Diagnostics:', diagnostics);
        return diagnostics;
    }
};
