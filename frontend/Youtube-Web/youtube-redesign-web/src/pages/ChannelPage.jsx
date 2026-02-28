import React from 'react';

import './ChannelPage.css';
import bannerImage from '../assets/channels4_banner.jpg';
import profileImage from '../assets/channels4_profile.jpg';
import { useLanguage } from '../i18n/LanguageContext';

const ChannelPage = () => {
    const { t } = useLanguage();

    return (
        <div className="channel-page-container">
            <div className="channel-content-wrapper">
                <div className="channel-banner-container">
                    <img
                        src={bannerImage}
                        alt="Channel Banner"
                        className="channel-banner-image"
                    />
                </div>
                <div className="channel-header-container">
                    <div className="channel-profile-container">
                        <img
                            src={profileImage}
                            alt="Channel Profile"
                            className="channel-profile-image"
                        />
                    </div>
                    <div className="channel-details-container">
                        <h1 className="channel-name">{t('channelPage.channelName')}</h1>
                        <div className="channel-meta">
                            <span>{t('channelPage.channelHandle')}</span>
                            <span className="meta-divider">•</span>
                            <span>{t('channelPage.nilSubscribers')}</span>
                            <span className="meta-divider">•</span>
                            <span>{t('channelPage.nilVideos')}</span>
                        </div>
                        <div className="channel-description">
                            <p>{t('channelPage.description')}</p>
                        </div>
                        <button className="subscribe-button">{t('channelPage.subscribe')}</button>
                    </div>
                </div>

                <div className="channel-tabs-container">
                    <div className="channel-tab active" id="HomeID1">{t('channelPage.home')}</div>
                    <div className="channel-tab" id="VideoID1">{t('channelPage.videos')}</div>
                    <div className="channel-tab" id="VideoID2">{t('channelPage.shorts')}</div>
                    <div className="channel-tab" id="LiveID1">{t('channelPage.live')}</div>
                    <div className="channel-tab" id="VideoID3">{t('channelPage.playlists')}</div>
                    <div className="channel-tab" id="TextID1">{t('channelPage.post')}</div>
                </div>

                <div className="channel-home-content">
                    <div className="home-section">
                        <h2 className="section-title-home">{t('channelPage.videos')}</h2>
                        <div className="video-row">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="dummy-video-card">
                                    <div className="dummy-thumbnail"></div>
                                    <div className="dummy-details">
                                        <div className="dummy-title">{t('channelPage.videoTitle', { index: item })}</div>
                                        <div className="dummy-meta">{t('channelPage.videoMeta')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="home-section">
                        <h2 className="section-title-home">{t('channelPage.shorts')}</h2>
                        <div className="shorts-row">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="dummy-shorts-card">
                                    <div className="dummy-shorts-thumbnail"></div>
                                    <div className="dummy-shorts-title">{t('channelPage.shortsTitle', { index: item })}</div>
                                    <div className="dummy-meta">{t('channelPage.shortsMeta')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="home-section">
                        <h2 className="section-title-home">{t('channelPage.post')}</h2>
                        <div className="posts-column">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="dummy-post-card">
                                    <div className="post-header">
                                        <div className="post-avatar"></div>
                                        <div className="post-info">
                                            <div className="post-author">{t('channelPage.postAuthor')}</div>
                                            <div className="post-date">{t('channelPage.postDate')}</div>
                                        </div>
                                    </div>
                                    <div className="post-content">
                                        {t('channelPage.postContent')}
                                    </div>
                                    <div className="post-actions">
                                        <div className="action-btn">{t('channelPage.like')}</div>
                                        <div className="action-btn">{t('channelPage.comment')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;
