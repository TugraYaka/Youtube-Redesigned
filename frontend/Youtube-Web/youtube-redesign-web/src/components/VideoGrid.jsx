import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';
import SkeletonVideoCard from './SkeletonVideoCard';
import SkeletonShortsCard from './SkeletonShortsCard';
import socket from '../services/socketService';
import backendConfig from '../config/backendConfig';
import { recommendationService } from '../services/recommendationService';
import { useLanguage } from '../i18n/LanguageContext';
import './VideoGrid.css';


const ShortsLogo = () => (
    <svg viewBox="0 0 24 24" className="shorts-logo-icon" fill="#ff0000">
        <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.06.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-10.94-1.7l8.49-4.5c.61-.32 1.37-.09 1.69.52.32.61.09 1.37-.52 1.69l-1.2.63v4.49l-6.8 3.6-.96.5c-.61.32-1.37.09-1.69-.52-.32-.61-.09-1.37.52-1.69l1.2-.63V8.12l-.73.5zM14 10.5l-4.2 2.25v-4.5L14 10.5z" />
    </svg>
);

const reorderVideosByRecommendations = (videos, recommendations) => {
    if (!Array.isArray(videos) || videos.length === 0) {
        return [];
    }

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
        return videos;
    }

    const videoMap = new Map(videos.map((video) => [video.id, video]));
    const ordered = [];

    recommendations.forEach((item) => {
        const videoId = item?.video?.id;
        if (videoId && videoMap.has(videoId)) {
            ordered.push(videoMap.get(videoId));
            videoMap.delete(videoId);
        }
    });

    return [...ordered, ...Array.from(videoMap.values())];
};

const VideoGrid = () => {
    const { t } = useLanguage();
    const [videosBeforeShorts, setVideosBeforeShorts] = useState(3);
    const [videos, setVideos] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 675) {
                setVideosBeforeShorts(1);
            } else if (window.innerWidth < 1124) {
                setVideosBeforeShorts(2);
            } else {
                setVideosBeforeShorts(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    
    const fetchVideos = useCallback(async () => {
        if (!navigator.onLine) {
            setVideos([]);
            setShorts([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            if (backendConfig.useCustomBackend) {
                const response = await fetch('/api/videos', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    const fetchedVideos = data.videos || [];
                    setShorts(data.shorts || []);

                    try {
                        const bridgePayload = await recommendationService.getVideoRecommendations({
                            limit: fetchedVideos.length || 12,
                            debug: true
                        });
                        const reordered = reorderVideosByRecommendations(
                            fetchedVideos,
                            bridgePayload.recommendations
                        );
                        console.debug('[AI-Bridge][Frontend] Reordered video ids:', reordered.map((video) => video.id));
                        setVideos(reordered);
                    } catch (bridgeError) {
                        console.error('[AI-Bridge][Frontend] Video recommendation bridge error:', bridgeError);
                        setVideos(fetchedVideos);
                    }
                } else {
                    setVideos([]);
                    setShorts([]);
                }
            } else {
                
                const { db } = await import('../firebase');
                const { collection, getDocs } = await import('firebase/firestore');

                const videosSnapshot = await getDocs(collection(db, "videos"));
                if (!videosSnapshot.empty) {
                    const fetchedVideos = videosSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setVideos(fetchedVideos);
                } else {
                    setVideos([]);
                }

                const shortsSnapshot = await getDocs(collection(db, "shorts"));
                if (!shortsSnapshot.empty) {
                    const fetchedShorts = shortsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setShorts(fetchedShorts);
                } else {
                    setShorts([]);
                }
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideos([]);
            setShorts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    
    useEffect(() => {
        fetchVideos();
    }, [isOffline, fetchVideos]);

    
    useEffect(() => {
        if (!backendConfig.useCustomBackend) {
            return;
        }

        recommendationService.runScan().catch((error) => {
            console.error('[AI-Bridge][Frontend] Scan error:', error);
        });
    }, []);

    
    useEffect(() => {
        const handleVideoCountUpdate = () => {
            fetchVideos();
        };

        socket.on('videoCountUpdate', handleVideoCountUpdate);

        return () => {
            socket.off('videoCountUpdate', handleVideoCountUpdate);
        };
    }, [fetchVideos]);

    
    
    
    
    const showLoading = isLoading || isOffline || videos.length === 0;

    if (showLoading) {
        return (
            <div className="video-grid">
                
                {Array(videosBeforeShorts).fill(null).map((_, i) => (
                    <SkeletonVideoCard key={`sk-v1-${i}`} />
                ))}

                
                <div className="shorts-section-container">
                    <div className="shorts-header">
                        <ShortsLogo />
                        <span className="shorts-title">{t('videoGrid.shortsTitle')}</span>
                    </div>
                    <div className="shorts-grid">
                        {Array(5).fill(null).map((_, i) => (
                            <SkeletonShortsCard key={`sk-s-${i}`} />
                        ))}
                    </div>
                </div>

                
                {Array(12).fill(null).map((_, i) => (
                    <SkeletonVideoCard key={`sk-v2-${i}`} />
                ))}
            </div>
        );
    }

    
    const firstVideos = videos.slice(0, videosBeforeShorts);
    const remainingVideos = videos.slice(videosBeforeShorts);

    return (
        <div className="video-grid">
            
            {firstVideos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}

            
            {shorts.length > 0 && (
                <div className="shorts-section-container">
                    <div className="shorts-header">
                        <ShortsLogo />
                        <span className="shorts-title">{t('videoGrid.shortsTitle')}</span>
                    </div>
                    <div className="shorts-grid">
                        {shorts.map(short => (
                            <div key={short.id} className="shorts-card">
                                <div className="shorts-thumbnail-container">
                                    <img src={short.thumbnail} alt={short.title} className="shorts-thumbnail" />
                                </div>
                                <h3 className="shorts-video-title">{short.title}</h3>
                                <p className="shorts-views">{short.views}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            
            {remainingVideos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
};

export default VideoGrid;
