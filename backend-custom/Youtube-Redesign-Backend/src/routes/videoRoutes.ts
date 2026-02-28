import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { videoStore, Video } from '../services/videoStore';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads/videos');


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/api/videos', (req, res) => {
    try {
        const data = videoStore.getAll();
        res.json(data);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

router.post('/api/videos', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files || !files['video']) {
            res.status(400).json({ message: 'No video file uploaded' });
            return;
        }

        const videoFile = files['video'][0];
        const coverFile = files['cover'] ? files['cover'][0] : null;

        
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        
        let thumbnailUrl = 'https://via.placeholder.com/320x180';

        if (coverFile) {
            thumbnailUrl = `${baseUrl}/uploads/videos/${coverFile.filename}`;
        } else {
            
            const thumbnailFilename = `thumbnail-${Date.now()}.png`;
            const thumbnailPath = path.join(uploadDir, thumbnailFilename);

            try {
                await new Promise<void>((resolve, reject) => {
                    ffmpeg(videoFile.path)
                        .screenshots({
                            timestamps: ['20%'], 
                            filename: thumbnailFilename,
                            folder: uploadDir,
                            size: '320x180'
                        })
                        .on('end', () => {
                            console.log('Thumbnail generated successfully');
                            resolve();
                        })
                        .on('error', (err) => {
                            console.error('Error generating thumbnail:', err);
                            reject(err);
                        });
                });

                if (fs.existsSync(thumbnailPath)) {
                    thumbnailUrl = `${baseUrl}/uploads/videos/${thumbnailFilename}`;
                }
            } catch (err) {
                console.error('Failed to generate thumbnail, using placeholder.', err);
            }
        }

        
        
        
        const user = (req as any).user || { displayName: 'Guest User', photoURL: 'https://via.placeholder.com/150' };

        const newVideo: Video = {
            id: Date.now().toString(),
            title: req.body.title || 'Untitled Video',
            thumbnail: thumbnailUrl,
            videoUrl: `${baseUrl}/uploads/videos/${videoFile.filename}`,
            channel: user.displayName || 'Unknown Channel',
            avatar: user.photos?.[0]?.value || user.photoURL || 'https://via.placeholder.com/150',
            views: '0 views',
            time: 'Just now',
            duration: '0:00', 
            createdAt: Date.now()
        };

        const newCount = videoStore.addVideo(newVideo);

        
        const io = (req as any).io;
        if (io) {
            io.emit('videoCountUpdate', newCount);
        }

        res.status(200).json({
            message: 'Video uploaded successfully',
            count: newCount,
            video: newVideo
        });

    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Internal server error while uploading video' });
    }
});

export { router as videoRouter };
