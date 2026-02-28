import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'videos.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ videos: [], shorts: [] }, null, 2));
}

export interface Video {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
    channel: string;
    avatar: string;
    views: string;
    time: string;
    duration: string;
    createdAt: number;
}

interface VideoData {
    videos: Video[];
    shorts: Video[];
}


let cache: VideoData | null = null;

const readFromDisk = (): VideoData => {
    const dataStr = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(dataStr) as VideoData;
};

const writeToDisk = (data: VideoData): void => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    cache = data;
};


const purgeOrphanedVideos = (data: VideoData): VideoData => {
    const filtered = data.videos.filter((video: Video) => {
        if (!video.videoUrl) return false;
        const filename = video.videoUrl.split('/').pop();
        if (!filename) return false;
        return fs.existsSync(path.join(process.cwd(), 'uploads/videos', filename));
    });

    if (filtered.length !== data.videos.length) {
        const updated = { ...data, videos: filtered };
        writeToDisk(updated);
        return updated;
    }
    return data;
};

export const videoStore = {
    getAll: (): VideoData => {
        try {
            if (!cache) {
                cache = readFromDisk();
                cache = purgeOrphanedVideos(cache);
            }
            return cache;
        } catch (error) {
            console.error('Error reading video store:', error);
            return { videos: [], shorts: [] };
        }
    },

    addVideo: (video: Video): number => {
        try {
            const data = readFromDisk();
            data.videos.unshift(video);
            writeToDisk(data);
            return data.videos.length;
        } catch (error) {
            console.error('Error writing to video store:', error);
            throw error;
        }
    },

    invalidateCache: (): void => {
        cache = null;
    },

    getCount: (): number => {
        return videoStore.getAll().videos.length;
    }
};
