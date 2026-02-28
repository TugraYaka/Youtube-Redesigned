import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { videoService } from '../services/videoService';
import './Studio.css';
import { useLanguage } from '../i18n/LanguageContext';


const StudioLogo = () => (
    <svg viewBox="0 0 95 24" height="24" style={{ fill: '#FF0000' }}>
        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.2857 0 14.2857 0C14.2857 0 5.35174 0 3.12469 0.597366C1.89466 0.926623 0.928003 1.89323 0.598746 3.12324C0 5.35032 0 10 0 10C0 10 0 14.6497 0.598746 16.8768C0.928003 18.1068 1.89466 19.0734 3.12469 19.4026C5.35174 20 14.2857 20 14.2857 20C14.2857 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5714 14.6497 28.5714 10 28.5714 10C28.5714 10 28.5714 5.35032 27.9727 3.12324Z" fill="#FF0000" />
        <path d="M11.4286 14.2857L18.8571 10L11.4286 5.71429V14.2857Z" fill="white" />
        <g fill="#212121">
            <path d="M34.3 18V2.4h3.1v1.6c.8-1.2 2-1.9 4-1.9 2.1 0 3.6 1.4 3.6 4.6v11.3h-2.9v-11c0-1.8-.7-2.6-2-2.6-1.5 0-2.8 1.1-2.8 3.3V18h-3zM54.5 9.7V18h-2.9V4.6h2.9v1.7c.6-1.3 2-2.1 3.2-2.1.3 0 .5 0 .8.1v2.7c-.3-.1-.5-.1-.8-.1-2 0-3.3 1.5-3.3 3.9v7zM69.6 18v-1.9h-1.3c-2.3 0-3.1-1.5-3.1-3.6V2.4h2.9v9.8c0 1.2.3 1.6 1.1 1.6h.4V18h-4.3zM67.3 5.4V2.5h2.9v3h-2.9zM73.5 18V2.4h2.9v1.6c.8-1.2 2-1.9 4-1.9s3.6 1.4 3.6 4.3v11.5h-2.9V7.9c0-1.6-.7-2.5-2-2.5-1.5 0-2.8 1.1-2.8 3.3V18h-2.8zM94.6 16.1l-1.9 1.4c-.9 1.4-2.2 2.1-4.1 2.1-3.5 0-5.8-2.3-5.8-6.1s2.2-6.2 5.8-6.2c3.4 0 5.6 2.4 5.6 6.1v.8H85.7c.1 2.3 1.4 3.6 3.1 3.6 1.2 0 2.2-.6 2.6-1.7h3.2zM91.3 10c0-1.7-1-2.9-2.7-2.9-1.6 0-2.6 1.2-2.8 2.9h5.5z" />
        </g>
    </svg>
);

const SearchIcon = () => <svg viewBox="0 0 24 24" className="studio-top-icon" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>;
const HelpIcon = () => <svg viewBox="0 0 24 24" className="studio-top-icon" fill="currentColor"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>;
const CreateIcon = () => <svg viewBox="0 0 24 24" height="24" fill="currentColor"><path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 18v2H7v-2h10zm-5-14l-5 5h3v7h4V9h3l-5-5z" /></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;
const UploadArrowIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" /></svg>;

const DashboardIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>;
const ContentIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" /></svg>;
const AnalyticsIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>;
const CommentsIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>;
const SubtitlesIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H7v-2h4v2zm7 0h-4v-2h4v2z" /></svg>;
const CopyrightIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.16.54-.22.86-.22.36 0 .67.06.92.18s.45.28.6.49l.7-.66c-.23-.29-.53-.52-.87-.67-.34-.16-.76-.23-1.25-.23-.58 0-1.1.12-1.55.35-.45.23-.8.55-1.06.95-.26.41-.39.89-.39 1.44s.13 1.03.39 1.44c.26.41.61.73 1.06.95.45.24.97.36 1.55.36.5 0 .91-.08 1.25-.23.34-.15.63-.38.87-.67l-.7-.66c-.16.21-.36.38-.6.49-.24.12-.55.18-.92.18-.33 0-.62-.07-.86-.22-.24-.16-.45-.37-.59-.62-.14-.25-.25-.54-.3-.87L10.08 10.86zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>;
const EarnIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>;
const CustomizationIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-8.8 3.8c-.37-.58-.87-1-1.48-1.22l-7.22 11.99c.59.34 1.13.52 1.64.53.51 0 1.11-.22 1.8-.62L19.49 9c-.39-.77-1.12-1.8-2.29-3.2z" /></svg>;
const AudioLibraryIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" /></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>;
const FeedbackIcon = () => <svg viewBox="0 0 24 24" className="studio-sidebar-icon" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" /></svg>;


const VideoUploadModal = ({ isOpen, onClose, userId }) => {
    const { t } = useLanguage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef(null);
    const thumbInputRef = useRef(null);

    
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setTitle('');
            setThumbnailFile(null);
            setThumbnailPreview(null);
            setIsPublishing(false);
        }
    }, [isOpen]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setTitle(file.name.replace(/\.[^/.]+$/, "")); 
        }
    };

    const handleThumbnailSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        if (!selectedFile || !title) return;

        setIsPublishing(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', selectedFile);
        
        if (thumbnailFile) {
            formData.append('cover', thumbnailFile); 
        }

        
        console.log("Uploading video with data:", { title, userId, hasVideo: !!selectedFile, hasCover: !!thumbnailFile });
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(pair[0], ':', pair[1].name, '(File)', pair[1].type, pair[1].size + ' bytes');
            } else {
                console.log(pair[0], ':', pair[1]);
            }
        }

        try {
            const result = await videoService.uploadVideo(formData);
            console.log('Upload successful:', result);
            alert(t('studio.publishSuccess'));
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`${t('studio.publishFailedPrefix')} ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="studio-modal-overlay">
            <div className="studio-modal" onClick={e => e.stopPropagation()}>
                <div className="studio-modal-header">
                    <h2>{selectedFile ? t('studio.modalDeveloperTitle') : t('studio.modalUploadTitle')}</h2>
                    <button className="close-btn" onClick={onClose} disabled={isPublishing}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="studio-modal-content">
                    {!selectedFile ? (
                        <div className="file-select-view">
                            <div className="upload-icon-large-container">
                                <div className="upload-icon-large-fill">
                                    <UploadArrowIcon />
                                </div>
                            </div>
                            <p style={{ fontSize: '15px', color: '#0d0d0d', marginBottom: '8px' }}>{t('studio.dragDrop')}</p>
                            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '24px' }}>{t('studio.privateUntilPublish')}</p>
                            <input
                                type="file"
                                id="video-file-input"
                                name="video-file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="video/*"
                                onChange={handleFileSelect}
                            />
                            <button className="select-files-btn" onClick={() => fileInputRef.current.click()}>{t('studio.selectFiles')}</button>
                        </div>
                    ) : (
                        <div className="upload-form-container">
                            <div className="form-left-col">
                                <div className="form-group">
                                    <label>{t('studio.titleRequired')}</label>
                                    <input
                                        type="text"
                                        id="video-title-input"
                                        name="title"
                                        className="form-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t('studio.titlePlaceholder')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('studio.thumbnail')}</label>
                                    <p style={{ fontSize: '12px', color: '#606060', marginBottom: '8px' }}>{t('studio.thumbnailHint')}</p>

                                    <input
                                        type="file"
                                        id="thumbnail-file-input"
                                        name="thumbnail-file"
                                        ref={thumbInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleThumbnailSelect}
                                    />
                                    <div className="thumbnail-preview-box" onClick={() => thumbInputRef.current.click()}>
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt={t('studio.thumbnail')} />
                                        ) : (
                                            <div className="thumbnail-placeholder">{t('studio.uploadThumbnail')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-right-col">
                                <div className="video-preview-box">
                                    
                                    <video controls src={URL.createObjectURL(selectedFile)} />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="publish-btn"
                                        onClick={handlePublish}
                                        disabled={isPublishing || !title}
                                    >
                                        {isPublishing ? t('studio.publishing') : t('studio.publish')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Studio = () => {
    const { t } = useLanguage();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const createMenuRef = useRef(null);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/'); 
            }
        });
        return () => unsubscribe();
    }, [userId, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
                setIsCreateMenuOpen(false);
            }
        };

        if (isCreateMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCreateMenuOpen]);


    if (!currentUser) return <div className="studio-loading">Loading Studio...</div>;

    const handleOpenUploadModal = () => {
        setIsCreateMenuOpen(false);
        setIsUploadModalOpen(true);
    };

    return (
        <div className="studio-layout">
            <VideoUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                userId={userId || currentUser.uid} 
            />

            
            <header className="studio-topbar">
                <div className="studio-topbar-left">
                    <div className="studio-hamburger-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                    </div>
                    <div className="studio-logo" onClick={() => navigate(`/studio/${userId}`)} style={{ cursor: 'pointer' }}>
                        <StudioLogo />
                    </div>
                </div>

                <div className="studio-search-bar">
                    <div className="studio-search-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{ color: '#aaa' }}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                    </div>
                    <input type="text" id="studio-search-input" name="search" placeholder="Search across your channel" />
                </div>

                <div className="studio-topbar-right">
                    <div className="studio-icon-btn"><HelpIcon /></div>

                    <div className="studio-create-container" ref={createMenuRef}>
                        <div className="studio-create-btn" onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}>
                            <CreateIcon />
                            <span>Create</span>
                        </div>
                        {isCreateMenuOpen && (
                            <div className="studio-create-dropdown">
                                <div className="create-dropdown-item" onClick={handleOpenUploadModal}>
                                    <UploadIcon />
                                    <span>Upload videos</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="studio-profile-avatar">
                        <img
                            src={currentUser.photoURL || currentUser.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=random`}
                            alt={currentUser.displayName}
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            </header>

            <div className="studio-body">
                
                <aside className="studio-nav-sidebar">
                    <div className="studio-channel-summary">
                        <div className="channel-avatar-lg">
                            <img
                                src={currentUser.photoURL || currentUser.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=random`}
                                alt={currentUser.displayName}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="channel-info-text">
                            <p className="channel-label">Your channel</p>
                            <p className="channel-name">{currentUser.displayName}</p>
                        </div>
                    </div>

                    <div className="studio-nav-scroll">
                        <div className="studio-nav-item active">
                            
                            <div className="nav-indicator"></div>
                            <DashboardIcon />
                            <span>Dashboard</span>
                        </div>
                        
                        <div className="studio-nav-item"><ContentIcon /><span>Content</span></div>
                        <div className="studio-nav-item"><AnalyticsIcon /><span>Analytics</span></div>
                        <div className="studio-nav-item"><CommentsIcon /><span>Community</span></div>
                        <div className="studio-nav-item"><SubtitlesIcon /><span>Subtitles</span></div>
                        <div className="studio-nav-item"><CopyrightIcon /><span>Copyright</span></div>
                        <div className="studio-nav-item"><EarnIcon /><span>Earn</span></div>
                        <div className="studio-nav-item"><CustomizationIcon /><span>Customization</span></div>
                        <div className="studio-nav-item"><AudioLibraryIcon /><span>Audio library</span></div>

                        <div className="studio-nav-divider"></div>

                        <div className="studio-nav-item"><SettingsIcon /><span>Settings</span></div>
                        <div className="studio-nav-item"><FeedbackIcon /><span>Send feedback</span></div>
                    </div>
                </aside>

                
                <main className="studio-content-area">
                    <div className="studio-page-header">
                        <h1>Channel dashboard</h1>
                    </div>

                    <div className="dashboard-grid">

                        
                        <div className="dashboard-card upload-card">
                            <div className="card-header">
                                <h3>Channel analytics</h3>
                            </div>
                            <div className="empty-upload-state">
                                <div className="upload-circle-bg">
                                    <div className="upload-arrow-anim"></div>
                                </div>
                                <p>Drag and drop video files to upload</p>
                                <span className="sub-text">Your videos will be private until you publish them.</span>

                                <button className="select-files-btn" onClick={handleOpenUploadModal}>SELECT FILES</button>
                            </div>
                        </div>

                        
                        <div className="dashboard-card analytics-card">
                            <div className="card-header">
                                <h3>Channel analytics</h3>
                            </div>
                            <div className="analytics-content">
                                <p className="analytics-label">Current subscribers</p>
                                <div className="sub-count">0</div>

                                <div className="analytics-summary">
                                    <p className="summary-title">Summary</p>
                                    <span className="date-range">Last 28 days</span>

                                    <div className="stat-row">
                                        <span>Views</span>
                                        <span>0</span>
                                    </div>
                                    <div className="stat-row">
                                        <span>Watch time (hours)</span>
                                        <span>0.0</span>
                                    </div>
                                </div>

                                <div className="analytics-footer">
                                    <a href="#">GO TO CHANNEL ANALYTICS</a>
                                </div>
                            </div>
                        </div>

                        
                        <div className="dashboard-card news-card">
                            <div className="card-header">
                                <h3>News</h3>
                            </div>
                            <div className="news-content">
                                <div className="news-item">
                                    <h4>Customize your channel</h4>
                                    <p>Stand out from the crowd and attract new subscribers.</p>
                                    <a href="#">LEARN MORE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Studio;
