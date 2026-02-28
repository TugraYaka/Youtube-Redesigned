import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MobileBottomNav.css';
import { useLanguage } from '../i18n/LanguageContext';

const HomeIcon = () => <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
const ShortsIcon = () => <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="currentColor"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.06.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-10.94-1.7l8.49-4.5c.61-.32 1.37-.09 1.69.52.32.61.09 1.37-.52 1.69l-1.2.63v4.49l-6.8 3.6-.96.5c-.61.32-1.37.09-1.69-.52-.32-.61-.09-1.37.52-1.69l1.2-.63V8.12l-.73.5zM14 10.5l-4.2 2.25v-4.5L14 10.5z" /></svg>;

const MobileBottomNav = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="mobile-bottom-nav-container">
            <div className="mobile-bottom-nav-island">
                <div
                    className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    <div className="icon-container">
                        <HomeIcon />
                    </div>
                    <span className="nav-label">{t('mobileBottomNav.home')}</span>
                    {location.pathname === '/' && <div className="active-indicator"></div>}
                </div>

                <div
                    className={`mobile-nav-item ${location.pathname.startsWith('/shorts') ? 'active' : ''}`}
                    onClick={() => navigate('/shorts')}
                >
                    <div className="icon-container">
                        <ShortsIcon />
                    </div>
                    <span className="nav-label">{t('mobileBottomNav.shorts')}</span>
                </div>

                <div className="mobile-nav-item">
                    <div className="icon-container profile-icon-container">
                        <img src="https://ui-avatars.com/api/?name=Tugra+Yaka&background=random" alt={t('mobileBottomNav.you')} className="mobile-nav-profile-img" />
                    </div>
                    <span className="nav-label">{t('mobileBottomNav.you')}</span>
                </div>
            </div>
        </div>
    );
};

export default MobileBottomNav;
