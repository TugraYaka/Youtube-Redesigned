import express from 'express';
import { aiBridgeService } from '../services/aiBridgeService';

const router = express.Router();

const pickFirst = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};

const parseOptionalNumber = (value: string | undefined): number | undefined => {
    if (!value) {
        return undefined;
    }
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

const parseOptionalBoolean = (value: string | undefined): boolean | undefined => {
    if (!value) {
        return undefined;
    }

    const lowered = value.toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(lowered)) {
        return true;
    }
    if (['0', 'false', 'no', 'n', 'off'].includes(lowered)) {
        return false;
    }
    return undefined;
};

const parseCsv = (value: string | undefined): string[] | undefined => {
    if (!value) {
        return undefined;
    }

    const items = value.split(',').map((part) => part.trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
};

router.get('/api/bridge/video-recommendations', (req, res) => {
    try {
        const limit = parseOptionalNumber(pickFirst(req.query.limit as string | string[] | undefined));
        const query = pickFirst(req.query.q as string | string[] | undefined);
        const preferredChannels = parseCsv(pickFirst(req.query.preferredChannels as string | string[] | undefined));
        const watchSeconds = parseOptionalNumber(pickFirst(req.query.watchSeconds as string | string[] | undefined));
        const historyKeywords = parseCsv(pickFirst(req.query.historyKeywords as string | string[] | undefined));
        const debug = parseOptionalBoolean(pickFirst(req.query.debug as string | string[] | undefined));

        const recommendations = aiBridgeService.getVideoRecommendations({
            limit,
            query,
            preferredChannels,
            recentWatchDurationSec: watchSeconds,
            historyKeywords,
            debug
        });

        res.json({
            ok: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error) {
        console.error('[AI-Bridge][Video] Route error:', error);
        res.status(500).json({
            ok: false,
            message: 'Video recommendation bridge error'
        });
    }
});

router.get('/api/bridge/search-recommendations', (req: any, res) => {
    try {
        const query = pickFirst(req.query.q as string | string[] | undefined);
        const previousSearches = parseCsv(pickFirst(req.query.previousSearches as string | string[] | undefined));
        const preferredTopics = parseCsv(pickFirst(req.query.preferredTopics as string | string[] | undefined));
        const limit = parseOptionalNumber(pickFirst(req.query.limit as string | string[] | undefined));
        const debug = parseOptionalBoolean(pickFirst(req.query.debug as string | string[] | undefined));
        const trackQuery = parseOptionalBoolean(pickFirst(req.query.trackQuery as string | string[] | undefined));
        const userIdFromSession = req.user?.id as string | undefined;
        const userIdFromQuery = pickFirst(req.query.userId as string | string[] | undefined);
        const userId = userIdFromSession || userIdFromQuery;

        const recommendations = aiBridgeService.getSearchRecommendations({
            query,
            previousSearches,
            preferredTopics,
            userId,
            trackQuery,
            limit,
            debug
        });

        res.json({
            ok: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error) {
        console.error('[AI-Bridge][Search] Route error:', error);
        res.status(500).json({
            ok: false,
            message: 'Search recommendation bridge error'
        });
    }
});

router.post('/api/bridge/track-watch', (req: any, res) => {
    try {
        const userIdFromSession = req.user?.id as string | undefined;
        const userIdFromBody = typeof req.body?.userId === 'string' ? req.body.userId : undefined;
        const userId = userIdFromSession || userIdFromBody;
        const videoTitle = typeof req.body?.videoTitle === 'string' ? req.body.videoTitle : '';

        if (!userId) {
            res.status(401).json({
                ok: false,
                message: 'Authentication required for personalized watch tracking'
            });
            return;
        }

        aiBridgeService.trackUserWatch(userId, videoTitle);

        res.json({
            ok: true
        });
    } catch (error) {
        console.error('[AI-Bridge][TrackWatch] Route error:', error);
        res.status(500).json({
            ok: false,
            message: 'Watch tracking failed'
        });
    }
});

router.get('/api/bridge/scan', (_req, res) => {
    try {
        const diagnostics = aiBridgeService.runBridgeScan();
        res.json({
            ok: true,
            diagnostics
        });
    } catch (error) {
        console.error('[AI-Bridge][Scan] Route error:', error);
        res.status(500).json({
            ok: false,
            message: 'Bridge scan failed'
        });
    }
});

export { router as aiBridgeRouter };
