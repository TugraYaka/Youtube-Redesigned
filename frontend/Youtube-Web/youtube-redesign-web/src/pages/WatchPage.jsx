import React, { useState, useRef, useEffect, useCallback } from 'react';
import './WatchPage.css';
import dummyVideo from '../assets/DummyVideo.mp4';
import profileImage from '../assets/channels4_profile.jpg'; 
import playIcon from '../assets/play.svg';
import pauseIcon from '../assets/pause.svg';
import soundIcon from '../assets/sound.svg';
import dislikeIcon from '../assets/dislike.svg';
import dislikeSelectIcon from '../assets/dislikeselect.svg';

import LikeButtonAnim from '../components/LikeButtonAnim';

const WatchPage = () => {
    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false); 
    const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9); 
    const [isBuffering, setIsBuffering] = useState(true); 

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) setIsDisliked(false);
    };

    const handleDislike = () => {
        setIsDisliked(!isDisliked);
        if (!isDisliked) setIsLiked(false);
    };

    
    const [isHoveringBar, setIsHoveringBar] = useState(false);
    const [hoverTime, setHoverTime] = useState(0);
    const [hoverPosition, setHoverPosition] = useState(0);
    const wasPlayingRef = useRef(false);
    const originalTimeRef = useRef(0);
    const previewVideoRef = useRef(null); 

    const inputRef = useRef(null);
    const rafRef = useRef(null);
    const lastStateUpdateRef = useRef(0);

    
    useEffect(() => {
        const updateProgress = () => {
            const video = videoRef.current;
            const input = inputRef.current;
            if (!video || !input) return;

            const duration = video.duration || 1;
            const current = video.currentTime;

            
            const bufferPercent = (video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) / duration : 0) * 100;

            
            
            
            
            
            let visualTime;

            if (isSeeking) {
                visualTime = parseFloat(input.value);
            } else {
                visualTime = current;
            }

            const percent = (visualTime / duration) * 100;

            if (!isSeeking) {
                
                input.value = visualTime;
            }

            
            input.style.background = `linear-gradient(to right, 
                #ffffff 0%, #ffffff ${percent}%, 
                rgba(255, 255, 255, 0.4) ${percent}%, rgba(255, 255, 255, 0.4) ${bufferPercent}%, 
                rgba(255, 255, 255, 0.1) ${bufferPercent}%, rgba(255, 255, 255, 0.1) 100%)`;

            
            
            const now = Date.now();
            if (isSeeking || isHoveringBar || now - lastStateUpdateRef.current > 100) {
                
                
                
                setCurrentTime(visualTime);
                lastStateUpdateRef.current = now;
            }

            rafRef.current = requestAnimationFrame(updateProgress);
        };

        rafRef.current = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isSeeking, isHoveringBar]);

    
    useEffect(() => {
        if (previewVideoRef.current && isHoveringBar) {
            
            const quantizedTime = Math.floor(hoverTime / 4.5) * 4.5;
            previewVideoRef.current.currentTime = quantizedTime;
        }
    }, [hoverTime, isHoveringBar]);


    

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateDuration = () => {
            setDuration(video.duration);
            if (video.videoWidth && video.videoHeight) {
                
                
                
                setVideoAspectRatio(video.videoWidth / video.videoHeight);
                setIsBuffering(false); 
            }
        };
        const onEnded = () => setIsPlaying(false);
        const onWaiting = () => setIsBuffering(true);
        const onCanPlay = () => setIsBuffering(false);
        const onPlaying = () => {
            setIsBuffering(false);
            setIsPlaying(true);
        };

        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', onEnded);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('playing', onPlaying);

        return () => {
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', onEnded);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('playing', onPlaying);
        };
    }, []);

    

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                
                wasPlayingRef.current = false;
            } else {
                videoRef.current.play();
                wasPlayingRef.current = true;
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                
                const activeTag = document.activeElement.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;

                e.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay]);

    
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = volume || 1;
                setIsMuted(false);
            } else {
                videoRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };


    
    
    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        setHoverTime(seekTime); 

        
        const quantizedTime = Math.floor(seekTime / 4.5) * 4.5;

        if (videoRef.current) {
            videoRef.current.currentTime = quantizedTime;
        }
    };

    
    const handleProgressBarEnter = () => {
        setIsHoveringBar(true);
        
        
    };

    const handleProgressBarMove = (e) => {
        if (!videoRef.current || !inputRef.current) return;

        const rect = inputRef.current.getBoundingClientRect();
        const offsetX = e.nativeEvent.clientX - rect.left;
        const width = rect.width;

        
        const ratio = Math.max(0, Math.min(1, offsetX / width));

        
        
        
        

        const rawTime = ratio * duration;
        
        setHoverTime(rawTime);
        setHoverPosition(offsetX);

        
        
    };

    const handleProgressBarLeave = () => {
        setIsHoveringBar(false);
        
    };

    const handleSeekStart = () => {
        setIsSeeking(true);
        if (videoRef.current) {
            wasPlayingRef.current = !videoRef.current.paused;
            videoRef.current.pause();
        }
    };

    
    
    const handleSeekEnd = () => {
        setIsSeeking(false);
        
        
        

        let exactTime = parseFloat(inputRef.current.value);
        
        

        if (videoRef.current) {
            videoRef.current.currentTime = exactTime;
        }

        
        
        originalTimeRef.current = exactTime;

        
        if (wasPlayingRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const controlsTimeoutRef = useRef(null);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying && !isHoveringBar) { 
            
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    const handleMouseLeave = () => {
        if (isPlaying) {
            setShowControls(false);
        }
        
        
    };

    return (
        <div className="watch-page-container">
            <div className="watch-content">
                
                <div
                    className="video-player-container"
                    ref={playerContainerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ aspectRatio: `${videoAspectRatio}` }}
                >
                    <video
                        ref={videoRef}
                        src={dummyVideo}
                        className="video-element"
                        onClick={togglePlay}
                    />

                    
                    {isBuffering && (
                        <div className="loading-overlay">
                            <span className="loader"></span>
                        </div>
                    )}

                    <div className={`video-controls-overlay ${showControls ? 'visible' : ''}`}>
                        
                        <div className="progress-bar-container">
                            
                            
                            <div
                                className={`scrub-preview-tooltip ${isHoveringBar ? 'visible' : ''}`}
                                style={{ left: `${hoverPosition}px` }}
                            >
                                <div className="preview-video-wrapper">
                                    <video
                                        ref={previewVideoRef}
                                        src={dummyVideo}
                                        className="preview-video"
                                        muted
                                        preload="auto"
                                    />
                                    <div className="preview-time">{formatTime(hoverTime)}</div>
                                </div>
                            </div>

                            <input
                                ref={inputRef}
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="any"
                                defaultValue="0"
                                onChange={handleSeek}
                                className="progress-range"
                                onMouseDown={handleSeekStart}
                                onMouseUp={handleSeekEnd}
                                onTouchStart={handleSeekStart}
                                onTouchEnd={handleSeekEnd}
                                
                                onMouseEnter={handleProgressBarEnter}
                                onMouseMove={handleProgressBarMove}
                                onMouseLeave={handleProgressBarLeave}
                            />
                        </div>

                        <div className="controls-row">
                            <div className="controls-left">
                                <button className="control-btn" onClick={togglePlay}>
                                    {isPlaying ? (
                                        <img src={pauseIcon} alt="Pause" className="control-icon" />
                                    ) : (
                                        <img src={playIcon} alt="Play" className="control-icon" />
                                    )}
                                </button>

                                <div className="volume-container">
                                    <button className="control-btn" onClick={toggleMute}>
                                        <img src={soundIcon} alt="Volume" className="control-icon" />
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="volume-slider"
                                    />
                                </div>

                                <div className="time-display">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            <div className="controls-right">
                                <button className="control-btn" onClick={toggleFullscreen}>
                                    {isFullscreen ? (
                                        <svg height="100%" viewBox="0 0 36 36" width="100%"><g><path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" fill="#fff"></path></g><g><path d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" fill="#fff"></path></g><g><path d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" fill="#fff"></path></g><g><path d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" fill="#fff"></path></g></svg>
                                    ) : (
                                        <svg height="100%" viewBox="0 0 36 36" width="100%"><g><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" fill="#fff"></path></g><g><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" fill="#fff"></path></g><g><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" fill="#fff"></path></g><g><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" fill="#fff"></path></g></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="video-info-container">
                    <h1 className="video-title">Dummy Video Title For Testing Watch Page</h1>

                    <div className="video-actions-row">
                        <div className="channel-owner-info">
                            <img src={profileImage} alt="Channel" className="owner-avatar" />
                            <div className="owner-details">
                                <span className="owner-name">Kanal ismi</span>
                                <span className="owner-subs">500K subscribers</span>
                            </div>
                            <button className="watch-subscribe-btn">Subscribe</button>
                        </div>

                        <div className="video-actions">
                            <div className="like-dislike-pill">
                                <button className="like-dislike-btn like-btn" onClick={handleLike}>
                                    <LikeButtonAnim isLiked={isLiked} className="action-icon" />
                                    <span className="like-text">10K</span>
                                </button>
                                <div className="like-dislike-divider" />
                                <button className="like-dislike-btn dislike-btn" onClick={handleDislike}>
                                    <img src={isDisliked ? dislikeSelectIcon : dislikeIcon} alt="Dislike" className="action-icon" />
                                </button>
                            </div>
                            <button className="action-pill"><span className="icon">share</span> Share</button>

                            <button className="action-pill"><span className="icon">...</span></button>
                        </div>
                    </div>

                    <div className="video-description-box">
                        <div className="desc-meta">1M views • 1 year ago</div>
                        <div className="desc-text">
                            This is a dummy description for the video. It serves to test the layout of the watch page.
                            The background of this box is light gray in the normal white theme.
                            <br /><br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>
                    </div>
                </div>

                
                <div className="comments-section">
                    <h3 className="comments-count">10 Comments</h3>
                    
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="comment-thread">
                            <div className="comment-avatar"></div>
                            <div className="comment-body">
                                <div className="comment-header">
                                    <span className="comment-author">User {i}</span>
                                    <span className="comment-time">2 months ago</span>
                                </div>
                                <div className="comment-text">This is a test comment number {i}.</div>
                                <div className="comment-actions">
                                    <span>👍 5</span>
                                    <span>👎</span>
                                    <span>Reply</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="watch-sidebar">
                
                <div className="autoplay-box">
                    <span className="autoplay-text">Autoplay</span>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                    </label>
                </div>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="sidebar-video-card">
                        <div className="sidebar-thumbnail"></div>
                        <div className="sidebar-video-info">
                            <div className="sidebar-video-title">Recommended Video Title {i} which might be long</div>
                            <div className="sidebar-meta-row">
                                <div className="sidebar-channel-avatar"></div>
                                <div className="sidebar-text-meta">
                                    <span className="sidebar-channel-name">Channel Name</span>
                                    <span className="sidebar-views-time">100K views • 5 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchPage;
