class SingleNeuron {
    constructor(weights, bias) {
        this.weights = weights;
        this.bias = bias;
    }

    score(inputs) {
        const weightedSum = inputs.reduce((acc, value, index) => acc + value * this.weights[index], this.bias);
        const output = 1 / (1 + Math.exp(-weightedSum));
        return { weightedSum, output };
    }
}

const videoNeuron = new SingleNeuron(
    [0.28, 0.23, 0.18, 0.16, 0.15],
    -0.35
);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const normalizeText = (value) =>
    String(value ?? '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const parseViews = (views) => {
    const lower = String(views ?? '').toLowerCase();
    const numberMatch = lower.match(/[\d,.]+/);
    if (!numberMatch) {
        return 0;
    }

    const normalized = numberMatch[0].replace(/,/g, '');
    const numeric = Number.parseFloat(normalized);
    if (Number.isNaN(numeric)) {
        return 0;
    }

    if (lower.includes('b')) return numeric * 1_000_000_000;
    if (lower.includes('m')) return numeric * 1_000_000;
    if (lower.includes('k')) return numeric * 1_000;
    return numeric;
};

const parseDurationToSeconds = (duration) => {
    const parts = String(duration ?? '').split(':').map((part) => Number.parseInt(part, 10));
    if (parts.some((part) => Number.isNaN(part))) {
        return 0;
    }

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    if (parts.length === 1) {
        return parts[0];
    }

    return 0;
};

const computeTokenMatch = (title, queryTokens) => {
    if (queryTokens.length === 0) {
        return 0.45;
    }

    const titleTokens = normalizeText(title).split(' ').filter(Boolean);
    if (titleTokens.length === 0) {
        return 0;
    }

    const uniqueTitleTokens = new Set(titleTokens);
    const hits = queryTokens.filter((token) => uniqueTitleTokens.has(token)).length;

    if (hits === 0) {
        return normalizeText(title).includes(queryTokens.join(' ')) ? 0.55 : 0.1;
    }

    return clamp(hits / queryTokens.length);
};

const buildFeatures = (video, context) => {
    const ageHours = Math.max(0, (Date.now() - video.createdAt) / (1000 * 60 * 60));
    const recencyScore = clamp(1 / (1 + ageHours / 48));

    const popularityScore = clamp(parseViews(video.views) / 1_000_000);

    const preferredChannels = (context.preferredChannels ?? []).map((channel) => channel.toLowerCase());
    const channelAffinity = preferredChannels.length === 0
        ? 0.5
        : preferredChannels.includes(String(video.channel ?? '').toLowerCase()) ? 1 : 0.2;

    const watchedSeconds = Math.max(0, context.recentWatchDurationSec ?? 0);
    const videoDuration = parseDurationToSeconds(video.duration);
    const durationFit = videoDuration === 0
        ? 0.55
        : clamp(watchedSeconds / videoDuration);

    const queryTokens = normalizeText(`${context.query ?? ''} ${(context.historyKeywords ?? []).join(' ')}`)
        .split(' ')
        .filter(Boolean);
    const semanticMatch = computeTokenMatch(video.title, queryTokens);

    return {
        recencyScore,
        popularityScore,
        channelAffinity,
        durationFit,
        semanticMatch
    };
};

const getVideoRecommendations = (videos, context = {}, limit = 12) => {
    const ranked = videos.map((video) => {
        const features = buildFeatures(video, context);
        const featureVector = [
            features.recencyScore,
            features.popularityScore,
            features.channelAffinity,
            features.durationFit,
            features.semanticMatch
        ];

        const neuronScore = videoNeuron.score(featureVector);
        return {
            video,
            score: Number(neuronScore.output.toFixed(6)),
            weightedSum: Number(neuronScore.weightedSum.toFixed(6)),
            features
        };
    }).sort((left, right) => right.score - left.score);

    const sliced = ranked.slice(0, Math.max(1, limit));

    if (context.debug) {
        console.log('[AI/ML][VideoRecommendationSystem] Ranked videos:', sliced.map((item) => ({
            videoId: item.video.id,
            title: item.video.title,
            score: item.score,
            weightedSum: item.weightedSum,
            features: item.features
        })));
    }

    return sliced;
};

module.exports = {
    getVideoRecommendations
};
