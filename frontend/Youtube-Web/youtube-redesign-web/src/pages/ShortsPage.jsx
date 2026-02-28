import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ShortsPage.css';
import dummyVideo from '../assets/DummyVideo.mp4';
import dislikeIcon from '../assets/dislike.svg';
import dislikeSelectIcon from '../assets/dislikeselect.svg';
import commentIcon from '../assets/comments.svg';
import shareIcon from '../assets/share.svg';
import LikeButtonAnim from '../components/LikeButtonAnim';
import { useLanguage } from '../i18n/LanguageContext';

const ShortsPage = () => {
    const { t } = useLanguage();
    const { shortId } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [interactions, setInteractions] = useState({});
    const [showComments, setShowComments] = useState(false);

    const initialShorts = useMemo(() => ([
        { id: 'short1', title: t('shortsPage.shortTitle1'), channel: t('shortsPage.shortChannel1') },
        { id: 'short2', title: t('shortsPage.shortTitle2'), channel: t('shortsPage.shortChannel2') },
        { id: 'short3', title: t('shortsPage.shortTitle3'), channel: t('shortsPage.shortChannel3') },
    ]), [t]);

    const [feed, setFeed] = useState(initialShorts);

    useEffect(() => {
        setFeed(initialShorts);
    }, [initialShorts]);

    const handleLike = (id) => {
        setInteractions(prev => ({
            ...prev,
            [id]: prev[id] === 'like' ? null : 'like'
        }));
    };

    const handleDislike = (id) => {
        setInteractions(prev => ({
            ...prev,
            [id]: prev[id] === 'dislike' ? null : 'dislike'
        }));
    };

    const handleShare = () => {
        const dummyLink = 'https://youtube.com/shorts/generatedlink';
        navigator.clipboard.writeText(dummyLink).then(() => {
            alert(t('shortsPage.linkCopied', { link: dummyLink }));
        });
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const loadMoreShorts = useCallback(() => {
        const newBatch = initialShorts.map(short => ({
            ...short,
            id: `${short.id}_${Date.now()}_${Math.random()}`
        }));
        setFeed(prev => [...prev, ...newBatch]);
    }, [initialShorts]);

    useEffect(() => {
        const observerOptions = {
            root: containerRef.current,
            threshold: 0.6,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const visibleShortId = entry.target.getAttribute('data-id');
                    if (visibleShortId && visibleShortId !== shortId) {
                        navigate(`/shorts/${visibleShortId}`, { replace: true });
                    }

                    const index = parseInt(entry.target.getAttribute('data-index'), 10);
                    if (index === feed.length - 1) {
                        loadMoreShorts();
                    }

                    const videoElement = entry.target.querySelector('video');
                    if (videoElement) videoElement.play().catch(() => console.log('Autoplay prevented'));
                } else {
                    const videoElement = entry.target.querySelector('video');
                    if (videoElement) {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    }
                }
            });
        }, observerOptions);

        const videoElements = document.querySelectorAll('.short-video-container');
        videoElements.forEach((element) => observer.observe(element));

        return () => {
            if (observer) observer.disconnect();
        };
    }, [shortId, navigate, feed, loadMoreShorts]);

    return (
        <div className="shorts-page-container" ref={containerRef}>
            <div className="shorts-feed">
                {feed.map((short, index) => {
                    const interaction = interactions[short.id];
                    const isLiked = interaction === 'like';
                    const isDisliked = interaction === 'dislike';

                    return (
                        <div
                            key={short.id}
                            className="short-video-container"
                            data-id={short.id}
                            data-index={index}
                            id={short.id}
                        >
                            <div className="short-inner-content">
                                <div className="short-video-wrapper">
                                    <video
                                        src={dummyVideo}
                                        className="short-video-player"
                                        loop
                                        muted
                                        playsInline
                                        onClick={(event) => event.target.paused ? event.target.play() : event.target.pause()}
                                    />

                                    <div className="short-overlay">
                                        <div className="short-info">
                                            <div className="uploader-info">
                                                <div className="uploader-avatar"></div>
                                                <div className="uploader-name">@{short.channel}</div>
                                                <button className="subscribe-btn-short">{t('common.subscribe')}</button>
                                            </div>
                                            <div className="short-title">{short.title}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="short-actions">
                                    <div className="action-item">
                                        <button
                                            className={`action-btn-circle like-btn ${isLiked ? 'active' : ''}`}
                                            onClick={() => handleLike(short.id)}
                                        >
                                            <LikeButtonAnim isLiked={isLiked} />
                                        </button>
                                        <span className="action-text">1.2M</span>
                                    </div>
                                    <div className="action-item">
                                        <button
                                            className={`action-btn-circle dislike-btn ${isDisliked ? 'active' : ''}`}
                                            onClick={() => handleDislike(short.id)}
                                        >
                                            <img src={isDisliked ? dislikeSelectIcon : dislikeIcon} alt={t('watchPage.dislikeAlt')} />
                                        </button>
                                        <span className="action-text">{t('shortsPage.dislike')}</span>
                                    </div>
                                    <div className="action-item">
                                        <button className="action-btn-circle" onClick={toggleComments}>
                                            <img src={commentIcon} alt={t('common.comments')} className="comment-icon-large" />
                                        </button>
                                        <span className="action-text">4,092</span>
                                    </div>
                                    <div className="action-item">
                                        <button className="action-btn-circle" onClick={handleShare}>
                                            <img src={shareIcon} alt={t('common.share')} />
                                        </button>
                                        <span className="action-text">{t('common.share')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showComments && <div className="comments-backdrop" onClick={toggleComments} />}
            <div className={`comments-overlay ${showComments ? 'visible' : ''}`}>
                <div className="comments-header">
                    <h3>{t('shortsPage.commentsTitle')}</h3>
                    <button className="close-comments-btn" onClick={toggleComments}>×</button>
                </div>
                <div className="comment-list">
                    <div className="comment-item">
                        <div className="comment-avatar"></div>
                        <div className="comment-body">
                            <div className="comment-user">{t('shortsPage.commentUser', { number: 1 })}</div>
                            <div className="comment-text">{t('shortsPage.comment1')}</div>
                        </div>
                    </div>
                    <div className="comment-item">
                        <div className="comment-avatar"></div>
                        <div className="comment-body">
                            <div className="comment-user">{t('shortsPage.commentUser', { number: 2 })}</div>
                            <div className="comment-text">{t('shortsPage.comment2')}</div>
                        </div>
                    </div>
                    <div className="comment-item">
                        <div className="comment-avatar"></div>
                        <div className="comment-body">
                            <div className="comment-user">{t('shortsPage.commentUser', { number: 3 })}</div>
                            <div className="comment-text">{t('shortsPage.comment3')}</div>
                        </div>
                    </div>
                </div>
                <div className="add-comment-box">
                    <input type="text" placeholder={t('shortsPage.addCommentPlaceholder')} />
                </div>
            </div>
        </div>
    );
};

export default ShortsPage;
