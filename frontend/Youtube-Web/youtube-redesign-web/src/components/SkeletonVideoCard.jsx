import React from 'react';
import './SkeletonVideoCard.css';

const SkeletonVideoCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-meta">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-text skeleton-title-1"></div>
                    <div className="skeleton-text skeleton-title-2"></div>
                    <div className="skeleton-text skeleton-meta-text"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonVideoCard;
