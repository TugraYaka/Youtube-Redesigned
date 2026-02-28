import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaylistCard.css';
import { useLanguage } from '../i18n/LanguageContext';

const PlaylistIcon = () => (
    <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z" />
    </svg>
);

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;

    if (max === min) {
        h = 0;
        s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

const PlaylistCard = ({ playlist }) => {
    const { t } = useLanguage();
    const [themeHue, setThemeHue] = useState(playlist.baseHue || 0);
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = () => {
        window.scrollTo(0, 0);
        navigate(`/playlists/${playlist.id}`);
    };

    useEffect(() => {
        const extractColor = () => {
            const img = imgRef.current;
            if (!img) return;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const sampleSize = 14;
            canvas.width = sampleSize;
            canvas.height = sampleSize;

            try {
                context.drawImage(img, 0, 0, sampleSize, sampleSize);
                const imageData = context.getImageData(0, 0, sampleSize, sampleSize).data;

                let rSum = 0;
                let gSum = 0;
                let bSum = 0;
                let count = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];

                    const rN = r / 255;
                    const gN = g / 255;
                    const bN = b / 255;
                    const max = Math.max(rN, gN, bN);
                    const min = Math.min(rN, gN, bN);
                    const l = (max + min) / 2;
                    const d = max - min;
                    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                    if (l > 0.15 && l < 0.9 && max !== min && s > 0.1) {
                        rSum += r;
                        gSum += g;
                        bSum += b;
                        count += 1;
                    }
                }

                if (count === 0) {
                    for (let i = 0; i < imageData.length; i += 4) {
                        rSum += imageData[i];
                        gSum += imageData[i + 1];
                        bSum += imageData[i + 2];
                        count += 1;
                    }
                }

                if (count > 0) {
                    const avgR = Math.floor(rSum / count);
                    const avgG = Math.floor(gSum / count);
                    const avgB = Math.floor(bSum / count);
                    const [h] = rgbToHsl(avgR, avgG, avgB);
                    setThemeHue(h);
                }
            } catch (error) {
                console.warn('Color extraction failed', error);
            }
        };

        const img = imgRef.current;
        if (!img) return undefined;

        if (img.complete && img.naturalHeight !== 0) {
            extractColor();
            return undefined;
        }

        img.addEventListener('load', extractColor);
        return () => img.removeEventListener('load', extractColor);
    }, [playlist.thumbnail]);

    const lightColor = `hsl(${themeHue}, 85%, 70%)`;
    const darkColor = `hsl(${themeHue}, 90%, 35%)`;

    return (
        <div className="playlist-card" onClick={handleClick}>
            <div className="playlist-thumbnail-container">
                <div className="playlist-layer-2" style={{ backgroundColor: darkColor }}></div>
                <div className="playlist-layer-1" style={{ backgroundColor: lightColor }}></div>

                <div className="playlist-main-image">
                    <img
                        ref={imgRef}
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        crossOrigin="anonymous"
                    />

                    <div className="playlist-badge-overlay">
                        <span className="playlist-icon-small"><PlaylistIcon /></span>
                        <span>{t('playlist.videoCount', { count: playlist.videoCount })}</span>
                    </div>
                </div>
            </div>

            <div className="playlist-details">
                <h3 className="playlist-title">{playlist.title}</h3>
                <div className="playlist-meta">
                    <span className="playlist-channel">{playlist.channel}</span>
                    <div className="playlist-view-full">{t('playlist.viewFullPlaylist')}</div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistCard;
