const hashString = (input) => {
    const text = String(input ?? '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash;
};

const deterministicInt = (seed, min, max) => {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    const range = high - low + 1;
    return low + (hashString(seed) % range);
};

export const generateMockVideos = (category, count = 12) => {
    return Array.from({ length: count }).map((_, i) => {
        const seedBase = `${category}-${i}`;
        const viewsK = deterministicInt(`${seedBase}-views`, 1, 900);
        const monthsAgo = deterministicInt(`${seedBase}-months`, 1, 11);
        const minutes = deterministicInt(`${seedBase}-minutes`, 1, 10);
        const seconds = deterministicInt(`${seedBase}-seconds`, 10, 59);

        return {
            id: `${category}-${i}`,
            title: `${category} Video Title ${i + 1} - Amazing Content`,
            channel: `${category} Channel`,
            views: `${viewsK}K`,
            time: `${monthsAgo} months ago`,
            duration: `${minutes}:${seconds}`,
            thumbnail: `https://picsum.photos/seed/${category}${i}/320/180`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${category}${i}`
        };
    });
};

export const generateMockPlaylists = () => [
    {
        id: 'p1',
        title: 'Calming Forest',
        channel: 'Relax Daily',
        videoCount: 120,
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&q=80',
        baseHue: 100
    },
    {
        id: 'p2',
        title: 'Deep Blue Ocean',
        channel: 'Blue Planet',
        videoCount: 50,
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=80',
        baseHue: 190
    },
    {
        id: 'p3',
        title: 'Desert Sands',
        channel: 'Travel Logs',
        videoCount: 24,
        thumbnail: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=640&q=80',
        baseHue: 30
    },
    {
        id: 'p4',
        title: 'Neon Nights',
        channel: 'Cyber World',
        videoCount: 15,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&q=80',
        baseHue: 280
    },
    {
        id: 'p5',
        title: 'Midnight Drive',
        channel: 'Night Vibes',
        videoCount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=640&q=80',
        baseHue: 0
    },
    {
        id: 'p6',
        title: 'Golden Sunset',
        channel: 'Solar Power',
        videoCount: 30,
        thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&q=80',
        baseHue: 45
    },
    {
        id: 'p7',
        title: 'Snowy Peaks',
        channel: 'Winter Life',
        videoCount: 42,
        thumbnail: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=640&q=80',
        baseHue: 200
    },
    {
        id: 'p8',
        title: 'Urban Jungle',
        channel: 'City Life',
        videoCount: 18,
        thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=640&q=80',
        baseHue: 210
    },
    {
        id: 'p9',
        title: 'Coffee Break',
        channel: 'Cafe Beats',
        videoCount: 10,
        thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=640&q=80',
        baseHue: 25
    },
    {
        id: 'p10',
        title: 'Abstract Art',
        channel: 'Design Hub',
        videoCount: 100,
        thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=640&q=80',
        baseHue: 330
    },
    {
        id: 'p11',
        title: 'Classic Cars',
        channel: 'Auto Moto',
        videoCount: 60,
        thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119cdd7512?w=640&q=80',
        baseHue: 0
    },
    {
        id: 'p12',
        title: 'Tech Setup',
        channel: 'Dev Space',
        videoCount: 200,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80',
        baseHue: 200
    }
];
