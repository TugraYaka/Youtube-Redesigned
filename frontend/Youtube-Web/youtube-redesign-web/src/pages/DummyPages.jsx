import React from 'react';
import VideoCard from '../components/VideoCard';
import PlaylistCard from '../components/PlaylistCard';
import { generateMockPlaylists, generateMockVideos } from '../data/mockContent';
import '../components/VideoGrid.css';
import { useLanguage } from '../i18n/LanguageContext';

const GenericVideoPage = ({ title, icon, category }) => {
    const { t } = useLanguage();
    const videos = generateMockVideos(category || title);

    return (
        <div className="generic-page-container" style={{ padding: '24px', width: '100%' }}>
            <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '32px'
                }}>
                    {icon}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>{title}</h1>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {t('dummyPages.recommendedForYou', { count: videos.length })}
                    </p>
                </div>
            </div>

            <div className="video-grid">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export const PlaylistsPage = () => {
    const { t } = useLanguage();
    const playlists = generateMockPlaylists();

    return (
        <div className="generic-page-container" style={{ padding: '24px 24px 24px 0px', width: '100%' }}>
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>{t('dummyPages.playlistsTitle')}</h1>
            </div>

            <div className="playlist-grid">
                {playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    );
};

export const WatchLaterPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.watchLaterTitle')} icon="⏰" category="WatchLater" />;
};

export const LikedVideosPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.likedVideosTitle')} icon="👍" category="Liked" />;
};

export const YourVideosPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.yourVideosTitle')} icon="📼" category="MyVideos" />;
};

export const MusicPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.musicTitle')} icon="🎵" category="Music" />;
};

export const GamingPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.gamingTitle')} icon="🎮" category="Gaming" />;
};

export const SportsPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.sportsTitle')} icon="🏆" category="Sports" />;
};

export const PremiumPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.premiumTitle')} icon="🔴" category="Premium" />;
};

export const YoutubeMusicPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.youtubeMusicTitle')} icon="🎧" category="YTMusic" />;
};

export const YoutubeKidsPage = () => {
    const { t } = useLanguage();
    return <GenericVideoPage title={t('dummyPages.youtubeKidsTitle')} icon="🧸" category="Kids" />;
};

export const SettingsPage = () => {
    const { t } = useLanguage();
    const settingsItems = t('dummyPages.settingsItems');

    return (
        <div style={{ padding: '40px', color: 'var(--text-primary)' }}>
            <h1>{t('dummyPages.settingsTitle')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{t('dummyPages.settingsDescription')}</p>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
                {(Array.isArray(settingsItems) ? settingsItems : []).map(item => (
                    <div key={item} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};
