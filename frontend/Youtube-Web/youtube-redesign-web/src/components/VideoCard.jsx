import React from 'react';
import './VideoGrid.css';
import { useLanguage } from '../i18n/LanguageContext';

const VideoCard = ({ video }) => {
    const { t } = useLanguage();
    const hasLocalizedViews = /views|görüntüleme|visualizzazioni/i.test(video.views);
    const viewsText = hasLocalizedViews ? video.views : `${video.views} ${t('common.views')}`;

    return (
        <div className="video-card">
            <div className="thumbnail-container">
                <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                <span className="duration-badge">{video.duration}</span>
            </div>
            <div className="meta-container">
                <img src={video.avatar} alt={video.channel} className="channel-avatar" />
                <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="channel-name">{video.channel}</p>
                    <div className="video-stats">
                        <span>{viewsText}</span>
                        <span className="dot">•</span>
                        <span>{video.time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
