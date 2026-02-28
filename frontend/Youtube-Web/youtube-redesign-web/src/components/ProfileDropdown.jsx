import React, { useState } from 'react';
import './ProfileDropdown.css';
import { FeedbackIcon } from './SidebarIcons';
import { useLanguage } from '../i18n/LanguageContext';

const ProfileDropdown = ({ onSwitchAccount, user }) => {
    const { t, language, setLanguage, supportedLanguages } = useLanguage();
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageLabel = t(`languages.${language}`);

    return (
        <div className="profile-dropdown">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img
                        src={user?.photoURL || user?.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`}
                        alt={t('profileDropdown.profileAlt')}
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="profile-info">
                    <div className="profile-name">{user?.displayName || t('profileDropdown.userNameFallback')}</div>
                    <div className="profile-handle">{user?.email || t('profileDropdown.handleFallback')}</div>
                    <a href="#" className="manage-account-link">{t('profileDropdown.viewYourChannel')}</a>
                </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
                <a href={`https://myaccount.google.com/${user?.email ? `?authuser=${user.email}` : ''}`} target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                    </div>
                    <span className="item-text">{t('profileDropdown.googleAccount')}</span>
                </a>
                <div className="dropdown-item" onClick={onSwitchAccount}>
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm2 0h14v14H5V5zm7 7l-4-4 4-4v3c3.31 0 6 2.69 6 6v1c-1.1-1.57-2.9-2.5-5-2.5V12z" /></svg>
                    </div>
                    <span className="item-text">{t('profileDropdown.switchAccount')}</span>
                    <span className="chevron-right">›</span>
                </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
                <div className="dropdown-item">
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" /></svg>
                    </div>
                    <span className="item-text">{t('profileDropdown.appearanceDeviceTheme')}</span>
                    <span className="chevron-right">›</span>
                </div>

                <div className="dropdown-item" onClick={() => setIsLanguageMenuOpen((prev) => !prev)}>
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" /></svg>
                    </div>
                    <span className="item-text">{t('profileDropdown.languageLabel', { language: languageLabel })}</span>
                    <span className="chevron-right">›</span>
                </div>

                {isLanguageMenuOpen && (
                    <div className="language-selector-list">
                        {supportedLanguages.map((code) => (
                            <button
                                key={code}
                                type="button"
                                className={`language-selector-item ${language === code ? 'active' : ''}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setLanguage(code);
                                    setIsLanguageMenuOpen(false);
                                }}
                            >
                                {t(`languages.${code}`)}
                            </button>
                        ))}
                    </div>
                )}

                <div className="dropdown-item">
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                    </div>
                    <span className="item-text">{t('profileDropdown.locationLabel', { location: t('profileDropdown.locationUnitedStates') })}</span>
                    <span className="chevron-right">›</span>
                </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
                <a href="https://github.com/TugraYaka/Youtube-Redesigned-/issues" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <div className="item-icon">
                        <FeedbackIcon />
                    </div>
                    <span className="item-text">{t('profileDropdown.sendFeedback')}</span>
                </a>
            </div>
        </div>
    );
};

export default ProfileDropdown;
