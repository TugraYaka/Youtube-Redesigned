import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateMockPlaylists, generateMockVideos } from '../data/mockContent';
import VideoCard from '../components/VideoCard';
import './PlaylistDetailPage.css';
import { useLanguage } from '../i18n/LanguageContext';

const PlaylistDetailPage = () => {
    const { t } = useLanguage();
    const { id } = useParams();
    const [themeColor, setThemeColor] = useState('rgba(0,0,0,0.5)');
    const imgRef = useRef(null);

    const playlists = useMemo(() => generateMockPlaylists(), []);
    const playlist = useMemo(() => {
        return playlists.find((item) => item.id === id) || null;
    }, [playlists, id]);

    const videos = useMemo(() => {
        if (!playlist) {
            return [];
        }
        return generateMockVideos(playlist.title, playlist.videoCount || 20);
    }, [playlist]);

    useEffect(() => {
        if (!playlist || !imgRef.current) return;

        const extractColor = () => {
            const img = imgRef.current;
            if (!img) return;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const sampleSize = 14;
            canvas.width = sampleSize;
            canvas.height = sampleSize;

            try {
                context.drawImage(img, 0, 0, sampleSize, sampleSize);
                const imageData = context.getImageData(0, 0, sampleSize, sampleSize).data;

                let rSum = 0;
                let gSum = 0;
                let bSum = 0;
                let count = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];

                    const rN = r / 255;
                    const gN = g / 255;
                    const bN = b / 255;
                    const max = Math.max(rN, gN, bN);
                    const min = Math.min(rN, gN, bN);
                    const l = (max + min) / 2;
                    const d = max - min;
                    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                    if (l > 0.15 && l < 0.9 && max !== min && s > 0.1) {
                        rSum += r;
                        gSum += g;
                        bSum += b;
                        count += 1;
                    }
                }

                if (count === 0) {
                    for (let i = 0; i < imageData.length; i += 4) {
                        rSum += imageData[i];
                        gSum += imageData[i + 1];
                        bSum += imageData[i + 2];
                        count += 1;
                    }
                }

                if (count > 0) {
                    const avgR = Math.floor(rSum / count);
                    const avgG = Math.floor(gSum / count);
                    const avgB = Math.floor(bSum / count);
                    setThemeColor(`linear-gradient(to bottom, rgba(${avgR},${avgG},${avgB}, 0.8), rgba(0,0,0,1))`);
                }
            } catch (error) {
                console.warn('Color extraction failed', error);
            }
        };

        const img = imgRef.current;
        if (img.complete && img.naturalHeight !== 0) {
            extractColor();
        } else {
            img.addEventListener('load', extractColor);
            return () => img.removeEventListener('load', extractColor);
        }

        return undefined;
    }, [playlist]);

    if (!playlist) return <div style={{ color: 'white', padding: '20px' }}>{t('common.loading')}</div>;

    return (
        <div className="playlist-detail-page">
            <div className="playlist-info-column" style={{ background: themeColor }}>
                <div className="playlist-info-card">
                    <div className="playlist-cover-image">
                        <img
                            ref={imgRef}
                            src={playlist.thumbnail}
                            alt={playlist.title}
                            crossOrigin="anonymous"
                        />
                    </div>
                    <h1 className="playlist-title-large">{playlist.title}</h1>
                    <div className="playlist-meta-large">
                        <span className="playlist-creator-name">{playlist.channel}</span>
                        <div className="playlist-stats-row">
                            <span>{t('playlist.videoCount', { count: playlist.videoCount })}</span>
                            <span>•</span>
                            <span>{t('playlist.noViews')}</span>
                            <span>•</span>
                            <span>{t('playlist.updatedToday')}</span>
                        </div>
                    </div>
                    <div className="playlist-actions">
                        <button className="playlist-btn-primary">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                            {t('playlist.playAll')}
                        </button>
                        <button className="playlist-btn-secondary">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
                            {t('playlist.shuffle')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="playlist-videos-column">
                <div className="playlist-video-list">
                    {videos.map((video, index) => (
                        <div key={video.id} className="playlist-video-item">
                            <span className="video-index">{index + 1}</span>
                            <div className="playlist-video-card-wrapper">
                                <VideoCard video={video} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetailPage;
