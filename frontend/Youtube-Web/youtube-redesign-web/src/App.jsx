import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import VideoGrid from './components/VideoGrid'
import './App.css'
import useMobileDetection from './hooks/useMobileDetection';
import MobileBottomNav from './components/MobileBottomNav';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import { authService } from "./services/authService";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/googleOAuthConfig';
import { Routes, Route, useLocation } from 'react-router-dom';
import ChannelPage from './pages/ChannelPage';
import WatchPage from './pages/WatchPage';
import HistoryPage from './pages/HistoryPage';
import ShortsPage from './pages/ShortsPage';
import Studio from './pages/Studio';

import PlaylistDetailPage from './pages/PlaylistDetailPage';

import {
  PlaylistsPage, WatchLaterPage, LikedVideosPage, YourVideosPage,
  MusicPage, GamingPage, SportsPage, PremiumPage, YoutubeMusicPage, YoutubeKidsPage, SettingsPage
} from './pages/DummyPages';

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isMobileUserAgent = useMobileDetection();
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  const [isDarkMode, _setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  
  const [user, setUser] = useState(() => {
    
    const savedUser = localStorage.getItem('user_cache');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); 
  };

  useEffect(() => {
    
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      
      if (currentUser) {
        
        const userForCache = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          isCustomBackend: currentUser.isCustomBackend || false
        };

        
        localStorage.setItem('user_cache', JSON.stringify(userForCache));
        setUser(currentUser);
      } else {
        localStorage.removeItem('user_cache');
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 770 && isMobileMenuOpen) {
        
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const location = useLocation();
  const isStudio = location.pathname.startsWith('/studio/');

  return (
    <div className={`App ${isMobileUserAgent ? 'mobile-user-agent-view' : ''}`}>
      {!isStudio && <div className="header-backdrop"></div>}

      {!isStudio && (
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          isClosing={isClosing}
          closeMobileMenu={closeMobileMenu}
          isDarkMode={isDarkMode}
        />
      )}

      {!isStudio && (
        <TopNav
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileUserAgent={isMobileUserAgent}
          onOpenAccountSwitcher={() => setIsAccountSwitcherOpen(true)}
          user={user}
          isDarkMode={isDarkMode}
        />
      )}

      <main className={isStudio ? "studio-wrapper" : "main-content"}>
        <Routes>
          <Route path="/" element={<VideoGrid />} />
          <Route path="/@dummychannel" element={<ChannelPage />} />
          <Route path="/watchID" element={<WatchPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/shorts/:shortId" element={<ShortsPage />} />
          <Route path="/shorts" element={<ShortsPage />} />

          
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/watch-later" element={<WatchLaterPage />} />
          <Route path="/liked-videos" element={<LikedVideosPage />} />
          <Route path="/your-videos" element={<YourVideosPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/youtube-music" element={<YoutubeMusicPage />} />
          <Route path="/youtube-kids" element={<YoutubeKidsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/studio/:userId" element={<Studio />} />
        </Routes>
      </main>

      {isMobileUserAgent && !isStudio && (
        <MobileBottomNav />
      )}

      {isAccountSwitcherOpen && (
        <AccountSwitcherModal onClose={() => setIsAccountSwitcherOpen(false)} />
      )}
    </div>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App
