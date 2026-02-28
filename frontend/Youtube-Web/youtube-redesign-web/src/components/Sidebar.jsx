import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoFull from '../assets/YouTube_Logo_2017.svg';
import logoFullDark from '../assets/YouTube_Logo_2017_dark.svg';
import logoIcon from '../assets/youtube.svg';
import './Sidebar.css';
import {
    HistoryIcon, PlaylistIcon, WatchLaterIcon, LikedIcon, YourVideosIcon,
    ChannelIcon, ArrowDownIcon, ArrowUpIcon,
    MusicNoteIcon, GamingIcon, TrophyIcon,
    SettingsIcon, HelpIcon, YoutubeIcon, MenuIcon
} from './SidebarIcons';
import { useLanguage } from '../i18n/LanguageContext';

const Sidebar = ({ isMobileOpen, isClosing, closeMobileMenu, isDarkMode }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const fullLogo = isDarkMode ? logoFullDark : logoFull;
    const [showMoreSubs, setShowMoreSubs] = useState(false);
    const [showMoreExplore, setShowMoreExplore] = useState(false);

    const toggleSubs = () => setShowMoreSubs(!showMoreSubs);
    const toggleExplore = () => setShowMoreExplore(!showMoreExplore);

    const mainNavItems = [
        { icon: <HistoryIcon />, text: t('sidebar.history'), path: '/history' },
        { icon: <PlaylistIcon />, text: t('sidebar.playlists'), path: '/playlists' },
        { icon: <WatchLaterIcon />, text: t('sidebar.watchLater'), path: '/watch-later' },
        { icon: <LikedIcon />, text: t('sidebar.likedVideos'), path: '/liked-videos' },
        { icon: <YourVideosIcon />, text: t('sidebar.yourVideos'), path: '/your-videos' },
    ];

    const subscriptionItems = [
        { icon: <ChannelIcon />, text: t('sidebar.testChannel', { number: 1 }) },
        { icon: <ChannelIcon />, text: t('sidebar.testChannel', { number: 2 }) },
        { icon: <ChannelIcon />, text: t('sidebar.testChannel', { number: 3 }) },
        { icon: <ChannelIcon />, text: t('sidebar.testChannel', { number: 4 }), hidden: !showMoreSubs },
        { icon: <ChannelIcon />, text: t('sidebar.testChannel', { number: 5 }), hidden: !showMoreSubs },
    ];

    const exploreItems = [
        { icon: <MusicNoteIcon />, text: t('sidebar.music'), path: '/music' },
        { icon: <GamingIcon />, text: t('sidebar.gaming'), path: '/gaming' },
        { icon: <TrophyIcon />, text: t('sidebar.sports'), path: '/sports', hidden: !showMoreExplore },
    ];

    const moreFromYoutubeItems = [
        { icon: <YoutubeIcon />, text: t('sidebar.youtubePremium'), path: '/premium' },
        { icon: <YoutubeIcon />, text: t('sidebar.youtubeStudio'), path: '/studio/user' },
        { icon: <YoutubeIcon />, text: t('sidebar.youtubeMusic'), path: '/youtube-music' },
        { icon: <YoutubeIcon />, text: t('sidebar.youtubeKids'), path: '/youtube-kids' },
    ];

    const footerItems = [
        { icon: <SettingsIcon />, text: t('sidebar.settings'), path: '/settings' },
        {
            icon: <HelpIcon />,
            text: t('sidebar.help'),
            action: () => {
                window.open('https://github.com/TugraYaka/Youtube-Redesigned-/issues', '_blank');
            }
        },
    ];

    const renderNavItems = (items) => {
        return items.filter(item => !item.hidden).map((item, index) => {
            const isActive = item.path === '/' ? location.pathname === '/' : false;

            return (
                <div
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                        if (item.action) {
                            item.action();
                            if (isMobileOpen) closeMobileMenu();
                        } else if (item.path) {
                            navigate(item.path);
                            if (isMobileOpen) closeMobileMenu();
                        }
                    }}
                >
                    {item.icon}
                    <span className="nav-text">{item.text}</span>
                </div>
            );
        });
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className={`mobile-sidebar-backdrop ${isClosing ? 'mobile-closing' : ''}`}
                    onClick={closeMobileMenu}
                />
            )}

            <div className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''} ${isClosing ? 'mobile-closing' : ''}`}>
                {isMobileOpen && (
                    <div className="mobile-sidebar-header">
                        <div className="mobile-menu-btn-sidebar" onClick={closeMobileMenu}>
                            <MenuIcon />
                        </div>
                        <img
                            src={fullLogo}
                            alt="YouTube Logo"
                            className="sidebar-logo mobile-header-logo"
                            onClick={() => {
                                if (location.pathname === '/') {
                                    window.location.reload();
                                } else {
                                    navigate('/');
                                }
                                closeMobileMenu();
                            }}
                            style={{ cursor: 'pointer' }}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                )}

                {!isMobileOpen && (
                    <div className="logo-section">
                        <img
                            src={fullLogo}
                            alt="YouTube Logo"
                            className="sidebar-logo logo-full"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (location.pathname === '/') {
                                    window.location.reload();
                                } else {
                                    navigate('/');
                                }
                            }}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        <img
                            src={logoIcon}
                            alt="YouTube"
                            className="sidebar-logo logo-icon"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (location.pathname === '/') {
                                    window.location.reload();
                                } else {
                                    navigate('/');
                                }
                            }}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                )}

                <div className="sidebar-content">
                    <div className="nav-section">
                        {renderNavItems(mainNavItems)}
                    </div>

                    <div className="divider"></div>

                    <div className="nav-section">
                        <div className="section-title">{t('sidebar.subscriptions')}</div>
                        {renderNavItems(subscriptionItems)}

                        <div className="nav-item show-more" onClick={toggleSubs}>
                            {showMoreSubs ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <span className="nav-text">{showMoreSubs ? t('sidebar.showLess') : t('sidebar.showMore')}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="nav-section">
                        <div className="section-title">{t('sidebar.explore')}</div>
                        {renderNavItems(exploreItems)}

                        <div className="nav-item show-more" onClick={toggleExplore}>
                            {showMoreExplore ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <span className="nav-text">{showMoreExplore ? t('sidebar.showLess') : t('sidebar.showMore')}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="nav-section">
                        <div className="section-title">{t('sidebar.moreFromYoutube')}</div>
                        {renderNavItems(moreFromYoutubeItems)}
                    </div>

                    <div className="divider"></div>

                    <div className="nav-section">
                        {renderNavItems(footerItems)}
                        <a href="https://github.com/TugraYaka" target="_blank" rel="noopener noreferrer" className="nav-footer-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            {t('sidebar.visitTugraYaka')}
                        </a>
                        <div className="nav-footer-link">{t('sidebar.thankYou')}</div>
                    </div>

                    <div className="divider"></div>

                    <div className="footer-copyright">
                        {t('sidebar.projectDisclaimer')}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
