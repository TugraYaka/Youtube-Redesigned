import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/YouTube_Logo_2017.svg';
import logoDark from '../assets/YouTube_Logo_2017_dark.svg';
import logoIcon from '../assets/youtube.svg';
import './TopNav.css';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { authService } from '../services/authService';
import backendConfig from '../config/backendConfig';
import { recommendationService } from '../services/recommendationService';
import { useLanguage } from '../i18n/LanguageContext';




const HomeIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
const ShortsIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.06.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-10.94-1.7l8.49-4.5c.61-.32 1.37-.09 1.69.52.32.61.09 1.37-.52 1.69l-1.2.63v4.49l-6.8 3.6-.96.5c-.61.32-1.37.09-1.69-.52-.32-.61-.09-1.37.52-1.69l1.2-.63V8.12l-.73.5zM14 10.5l-4.2 2.25v-4.5L14 10.5z" /></svg>; 
const SubscriptionsIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M19 9H2v2h17V9zm0-4H2v2h17V5zm-8 8H2v2h9v-2zm-5 6H6v-6H2v6h4zm9-6v6h4v-3h2v-3h-6z" /></svg>;
const SearchIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>;
const CreateVideoIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" /></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg>;
const ArrowLeftIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>;
const MenuIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>;
const ExploreIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" /></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M17 18v2H7v-2h10zm-5-14l-5 5h3v7h4V9h3l-5-5z" /></svg>;
const PostIcon = () => <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" /></svg>;


const TopNav = ({ toggleMobileMenu, isMobileUserAgent, onOpenAccountSwitcher, user, isDarkMode }) => {
    const { t } = useLanguage();
    const isLoggedIn = !!user;
    const fullLogo = isDarkMode ? logoDark : logo;
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
    const fallbackSuggestionsSource = useMemo(() => {
        const suggestions = t('topNav.fallbackSuggestions');
        return Array.isArray(suggestions) ? suggestions : [];
    }, [t]);

    useEffect(() => {
        if (!isSearchFocused) {
            setFilteredSuggestions([]);
            setIsSuggestionLoading(false);
            return;
        }

        const query = searchQuery.trim();
        const fallbackSuggestions = query
            ? fallbackSuggestionsSource.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
            : fallbackSuggestionsSource;

        let isCancelled = false;
        const timeoutId = window.setTimeout(async () => {
            if (!backendConfig.useCustomBackend) {
                setFilteredSuggestions(fallbackSuggestions);
                return;
            }

            try {
                setIsSuggestionLoading(true);
                const payload = await recommendationService.getSearchRecommendations({
                    q: query,
                    limit: 15,
                    userId: user?.uid,
                    trackQuery: query.length >= 1
                });

                const remoteSuggestions = Array.isArray(payload.recommendations)
                    ? payload.recommendations
                        .map((item) => item.suggestion)
                        .filter(Boolean)
                    : [];

                if (!isCancelled) {
                    setFilteredSuggestions(remoteSuggestions.length > 0 ? remoteSuggestions : fallbackSuggestions);
                }
            } catch (error) {
                console.error('[AI-Bridge][Frontend] Search suggestions fetch error:', error);
                if (!isCancelled) {
                    setFilteredSuggestions(fallbackSuggestions);
                }
            } finally {
                if (!isCancelled) {
                    setIsSuggestionLoading(false);
                }
            }
        }, 180);

        return () => {
            isCancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [isSearchFocused, searchQuery, user?.uid, fallbackSuggestionsSource]);

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setIsSearchFocused(false);
    };

    const closeAllDropdowns = () => {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsCreateMenuOpen(false);
        setIsSearchFocused(false);
    };

    const handleBackgroundClick = (e) => {
        if (!isNotificationsOpen && !isProfileOpen && !isCreateMenuOpen) return;

        
        if (e.target.closest('.icon-box') ||
            e.target.closest('.profile-box') ||
            e.target.closest('.search-bar') ||
            e.target.closest('.sign-in-btn') ||
            e.target.closest('.mobile-menu-btn') ||
            e.target.closest('.back-button-wrapper') ||
            e.target.closest('.mobile-logo-center') ||
            e.target.closest('.create-video-dropdown') ||
            e.target.closest('.notification-dropdown') ||
            e.target.closest('.profile-dropdown')
        ) {
            return;
        }

        closeAllDropdowns();
    };

    return (
        <>
            
            {isMobileSearchActive && (
                <div
                    className="mobile-search-backdrop"
                    onClick={() => setIsMobileSearchActive(false)}
                />
            )}

            
            {(isNotificationsOpen || isProfileOpen || isCreateMenuOpen) && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1999 }}
                    onClick={closeAllDropdowns}
                ></div>
            )}

            <div
                className={`topnav-container ${isMobileSearchActive ? 'mobile-search-active' : ''} ${isMobileUserAgent ? 'mobile-web-view' : ''}`}
                style={{ zIndex: (isNotificationsOpen || isProfileOpen || isCreateMenuOpen) ? 2001 : 900 }}
                onClick={handleBackgroundClick}
            >
                
                
                {!isMobileUserAgent && (
                    <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        <MenuIcon />
                    </div>
                )}

                <div className="topnav-island">

                    
                    <div className="back-button-wrapper" onClick={() => setIsMobileSearchActive(false)}>
                        <ArrowLeftIcon />
                    </div>

                    
                    <div className="nav-group">
                        {isMobileUserAgent ? (
                            
                            <>
                                <div className="icon-box">
                                    <ExploreIcon />
                                </div>
                            </>
                        ) : (
                            
                            <>
                                <div
                                    className={`icon-box ${location.pathname === '/' ? 'active' : ''}`}
                                    onClick={() => navigate('/')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <HomeIcon />
                                </div>
                                <div
                                    className={`icon-box ${location.pathname.startsWith('/shorts') ? 'active' : ''}`}
                                    onClick={() => navigate('/shorts')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ShortsIcon />
                                </div>
                                {isLoggedIn && (
                                    
                                    <div
                                        className={`icon-box ${location.pathname === '/playlists' ? 'active' : ''}`}
                                        onClick={() => navigate('/playlists')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <SubscriptionsIcon />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    
                    <div
                        className="mobile-logo-center"
                        onClick={() => {
                            if (location.pathname === '/') {
                                window.location.reload();
                            } else {
                                navigate('/');
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={fullLogo} alt="YouTube" className="logo-full" draggable="false" onContextMenu={(e) => e.preventDefault()} />
                        <img src={logoIcon} alt="YouTube" className="logo-icon" draggable="false" onContextMenu={(e) => e.preventDefault()} />
                    </div>

                    
                    <div className="search-bar" onClick={() => setIsMobileSearchActive(true)}>
                        <input
                            type="text"
                            placeholder={t('topNav.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
                        />
                        {searchQuery && (
                            <div className="clear-icon-wrapper" onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery('');
                            }}>
                                <CloseIcon />
                            </div>
                        )}
                        <div className="search-icon-wrapper">
                            <SearchIcon />
                        </div>

                        
                        {isSearchFocused && (isSuggestionLoading || filteredSuggestions.length > 0) && (
                            <div className="search-suggestions-dropdown">
                                {isSuggestionLoading ? (
                                    <div className="suggestion-item">
                                        <div className="suggestion-icon-wrapper">
                                            <SearchIcon />
                                        </div>
                                        <span>{t('topNav.searching')}</span>
                                    </div>
                                ) : (
                                    filteredSuggestions.map((suggestion, index) => (
                                        <div
                                            key={`${suggestion}-${index}`}
                                            className="suggestion-item"
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleSuggestionClick(suggestion);
                                            }}
                                        >
                                            <div className="suggestion-icon-wrapper">
                                                <SearchIcon />
                                            </div>
                                            <span>{suggestion}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    
                    
                    {!isMobileUserAgent && (
                        <div className="action-group">
                            {isLoggedIn ? (
                                <>
                                    

                                    
                                    <div className="icon-box" onClick={() => {
                                        setIsCreateMenuOpen(!isCreateMenuOpen);
                                        setIsNotificationsOpen(false);
                                        setIsProfileOpen(false);
                                    }}>
                                        <CreateVideoIcon />
                                    </div>

                                    
                                    <div className="icon-box" onClick={() => {
                                        setIsNotificationsOpen(!isNotificationsOpen);
                                        setIsProfileOpen(false); 
                                        setIsCreateMenuOpen(false);
                                    }}>
                                        <BellIcon />
                                    </div>

                                    
                                    <div className="profile-box" onClick={() => {
                                        setIsProfileOpen(!isProfileOpen);
                                        setIsNotificationsOpen(false); 
                                        setIsCreateMenuOpen(false);
                                    }}>
                                        
                                        <img
                                            src={user.photoURL || user.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`}
                                            alt={user.displayName || t('profileDropdown.profileAlt')}
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                </>
                            ) : (
                                
                                backendConfig.useCustomBackend ? (
                                    <button
                                        className="sign-in-btn"
                                        onClick={() => window.location.href = '/auth/google'}
                                    >
                                        {t('topNav.signIn')}
                                    </button>
                                ) : (
                                    <button className="sign-in-btn" onClick={() => authService.signIn()}>
                                        {t('topNav.signIn')}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>

                
                {isCreateMenuOpen && !isMobileUserAgent && (
                    <div className="create-video-dropdown">
                        <div className="create-video-item" onClick={() => {
                            if (user) {
                                navigate(`/studio/${user.uid}`);
                                setIsCreateMenuOpen(false);
                            }
                        }}>
                            <div className="create-video-icon-wrapper"><UploadIcon /></div>
                            <span>{t('topNav.uploadVideo')}</span>
                        </div>
                        <div className="create-video-item">
                            <div className="create-video-icon-wrapper"><PostIcon /></div>
                            <span>{t('topNav.createPost')}</span>
                        </div>
                    </div>
                )}


                
                {isNotificationsOpen && !isMobileUserAgent && (
                    <NotificationDropdown />
                )}

                
                {isProfileOpen && !isMobileUserAgent && (
                    <ProfileDropdown
                        user={user}
                        onSwitchAccount={() => {
                            setIsProfileOpen(false); 
                            onOpenAccountSwitcher(); 
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default TopNav;
