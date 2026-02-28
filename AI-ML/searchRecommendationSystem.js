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

const searchNeuron = new SingleNeuron(
    [0.37, 0.2, 0.15, 0.18, 0.1],
    -0.3
);

const TRENDING_QUERIES = [
    'live coding',
    'typescript tutorial',
    'ai tools 2026',
    'how to grow youtube channel',
    'react performance tips',
    'shorts editing workflow',
    'productivity playlist',
    'coding interview prep'
];

const TOPIC_SENTENCE_POOL = {
    yazilim: [
        'ile baslayan yazilim projeleri',
        'ile baslayan backend mimarileri',
        'ile baslayan react component stratejileri',
        'ile baslayan node.js API gelistirme rehberi',
        'ile baslayan typescript ipuclari',
        'ile baslayan docker ile deployment adimlari',
        'ile baslayan AWS cloud dersleri',
        'ile baslayan algoritma cozumleri',
        'ile baslayan sistem tasarimi notlari',
        'ile baslayan fullstack yol haritasi',
        'ile baslayan kod inceleme teknikleri',
        'ile baslayan clean architecture ornekleri',
        'ile baslayan CI CD otomasyonlari',
        'ile baslayan veritabani optimizasyonu',
        'ile baslayan yazilim kariyer onerileri',
        'ile baslayan kodlama challenge listesi'
    ],
    yemek: [
        'ile baslayan pratik yemek tarifleri',
        'ile baslayan firinda yemek onerileri',
        'ile baslayan tatli tarifleri',
        'ile baslayan kahvaltilik tarif fikirleri',
        'ile baslayan mutfak teknikleri',
        'ile baslayan restaurant tarzi tabaklama',
        'ile baslayan vegan tarifler',
        'ile baslayan meal prep planlari',
        'ile baslayan corba tarifleri',
        'ile baslayan hamur isi tarifleri',
        'ile baslayan sokak lezzetleri',
        'ile baslayan protein agirlikli yemekler',
        'ile baslayan diyet dostu tarifler',
        'ile baslayan airfryer tarifleri',
        'ile baslayan tatli sunum fikirleri',
        'ile baslayan mutfakta hizli cozumler'
    ],
    muzik: [
        'ile baslayan muzik listeleri',
        'ile baslayan lofi calisma playlisti',
        'ile baslayan gitar dersleri',
        'ile baslayan piyano pratikleri',
        'ile baslayan vokal teknikleri',
        'ile baslayan beat yapim rehberi',
        'ile baslayan mix mastering notlari',
        'ile baslayan sahne performans ipuclari'
    ],
    oyun: [
        'ile baslayan oyun stratejileri',
        'ile baslayan fps aim gelistirme',
        'ile baslayan rekabetci oyun taktikleri',
        'ile baslayan oyun inceleme serisi',
        'ile baslayan oyun setup onerileri',
        'ile baslayan speedrun teknikleri'
    ],
    spor: [
        'ile baslayan fitness programi',
        'ile baslayan evde antrenman rutini',
        'ile baslayan kosu performansi planlari',
        'ile baslayan kas gelisim ipuclari',
        'ile baslayan mobilite ve esneme dersi',
        'ile baslayan spor beslenme rehberi'
    ],
    teknoloji: [
        'ile baslayan teknoloji incelemeleri',
        'ile baslayan telefon karsilastirmalari',
        'ile baslayan laptop tavsiyeleri',
        'ile baslayan yapay zeka araclari',
        'ile baslayan donanim benchmark testleri',
        'ile baslayan yeni nesil gadget onerileri'
    ],
    genel: [
        'ile baslayan en iyi videolar',
        'ile baslayan trend arama onerileri',
        'ile baslayan kanal kesifleri',
        'ile baslayan bugun ne izlesem listesi',
        'ile baslayan populer icerikler',
        'ile baslayan ogrenme playlisti',
        'ile baslayan mini kurs onerileri',
        'ile baslayan yeni baslayanlar rehberi'
    ]
};

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

const lexicalSimilarity = (query, candidate) => {
    const normalizedQuery = normalizeText(query);
    const normalizedCandidate = normalizeText(candidate);

    if (!normalizedQuery) {
        return 0.5;
    }
    if (normalizedCandidate.startsWith(normalizedQuery)) {
        return 1;
    }
    if (normalizedCandidate.includes(normalizedQuery)) {
        return 0.8;
    }

    const queryTokens = normalizedQuery.split(' ').filter(Boolean);
    const candidateTokens = normalizedCandidate.split(' ').filter(Boolean);

    if (queryTokens.length === 0 || candidateTokens.length === 0) {
        return 0.1;
    }

    const candidateSet = new Set(candidateTokens);
    const overlap = queryTokens.filter((token) => candidateSet.has(token)).length;

    return clamp(overlap / queryTokens.length);
};

const intentBoost = (query, candidate) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
        return 0.45;
    }

    const normalizedCandidate = normalizeText(candidate);
    const startsWithWord = normalizedCandidate.split(' ').some((token) => token.startsWith(normalizedQuery));

    if (startsWithWord) {
        return 0.95;
    }

    return normalizedCandidate.includes(normalizedQuery) ? 0.65 : 0.2;
};

const toTitle = (topic) => {
    if (!topic) return 'genel';
    return topic.charAt(0).toUpperCase() + topic.slice(1);
};

const buildPersonalizedSentences = (query, preferredTopics, previousSearches, count) => {
    const prefix = String(query ?? '').trim();
    if (!prefix) {
        return [];
    }

    const topics = preferredTopics.length > 0 ? preferredTopics : ['genel'];
    const results = [];
    const seen = new Set();

    const pushSentence = (sentence) => {
        const normalized = normalizeText(sentence);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        results.push(sentence);
    };

    topics.forEach((topic) => {
        const pool = TOPIC_SENTENCE_POOL[topic] || TOPIC_SENTENCE_POOL.genel;
        pool.forEach((ending) => {
            pushSentence(`${prefix} ${ending}`);
        });
    });

    previousSearches.slice(0, 8).forEach((search) => {
        const normalizedSearch = normalizeText(search);
        if (!normalizedSearch) return;
        pushSentence(`${prefix} ile baslayan ${normalizedSearch} odakli oneriler`);
        pushSentence(`${prefix} ${normalizedSearch} icin adim adim rehber`);
    });

    if (results.length < count) {
        const fallbackPool = TOPIC_SENTENCE_POOL.genel;
        let index = 0;
        while (results.length < count) {
            const ending = fallbackPool[index % fallbackPool.length];
            pushSentence(`${prefix} ${ending} ${toTitle(topics[index % topics.length])}`);
            index += 1;
        }
    }

    return results.slice(0, count);
};

const buildCandidates = (videos, previousSearches, preferredTopics, query, limit) => {
    const deduped = new Map();

    const upsert = (candidate) => {
        const key = normalizeText(candidate.suggestion);
        if (!key) return;

        const existing = deduped.get(key);
        if (!existing) {
            deduped.set(key, candidate);
            return;
        }

        deduped.set(key, {
            ...existing,
            popularityHint: Math.max(existing.popularityHint, candidate.popularityHint),
            freshnessHint: Math.max(existing.freshnessHint, candidate.freshnessHint),
            historyHint: Math.max(existing.historyHint, candidate.historyHint)
        });
    };

    const personalized = buildPersonalizedSentences(query, preferredTopics, previousSearches, Math.max(limit, 15));
    personalized.forEach((sentence, index) => {
        upsert({
            suggestion: sentence,
            source: 'personalized_ai',
            popularityHint: clamp(0.92 - index * 0.015),
            freshnessHint: 0.88,
            historyHint: 1
        });
    });

    videos.forEach((video) => {
        const ageHours = Math.max(0, (Date.now() - video.createdAt) / (1000 * 60 * 60));
        const freshnessHint = clamp(1 / (1 + ageHours / 72));
        const popularityHint = clamp(parseViews(video.views) / 1_000_000);

        upsert({
            suggestion: video.title,
            source: 'video_title',
            popularityHint,
            freshnessHint,
            historyHint: 0
        });
    });

    previousSearches.forEach((search) => {
        upsert({
            suggestion: search,
            source: 'history',
            popularityHint: 0.7,
            freshnessHint: 0.65,
            historyHint: 1
        });
    });

    TRENDING_QUERIES.forEach((trendQuery) => {
        upsert({
            suggestion: trendQuery,
            source: 'trending',
            popularityHint: 0.55,
            freshnessHint: 0.75,
            historyHint: 0
        });
    });

    return Array.from(deduped.values());
};

const getSearchRecommendations = (videos, context = {}) => {
    const limit = Math.max(1, context.limit ?? 15);
    const previousSearches = (context.previousSearches ?? []).filter(Boolean);
    const preferredTopics = (context.preferredTopics ?? []).filter(Boolean);

    const candidates = buildCandidates(
        videos,
        previousSearches,
        preferredTopics,
        context.query ?? '',
        limit
    );

    const ranked = candidates.map((candidate) => {
        const features = {
            lexicalSimilarity: lexicalSimilarity(context.query ?? '', candidate.suggestion),
            popularityScore: candidate.popularityHint,
            freshnessScore: candidate.freshnessHint,
            historyBoost: candidate.historyHint,
            intentBoost: intentBoost(context.query ?? '', candidate.suggestion)
        };

        const featureVector = [
            features.lexicalSimilarity,
            features.popularityScore,
            features.freshnessScore,
            features.historyBoost,
            features.intentBoost
        ];

        const neuronScore = searchNeuron.score(featureVector);
        return {
            suggestion: candidate.suggestion,
            source: candidate.source,
            score: Number(neuronScore.output.toFixed(6)),
            weightedSum: Number(neuronScore.weightedSum.toFixed(6)),
            features
        };
    }).sort((left, right) => right.score - left.score);

    const sliced = ranked.slice(0, limit);

    if (context.debug) {
        console.log('[AI/ML][SearchRecommendationSystem] Ranked suggestions:', {
            userScope: context.userId ? 'authenticated' : 'anonymous',
            preferredTopics,
            top: sliced
        });
    }

    return sliced;
};

module.exports = {
    getSearchRecommendations
};
