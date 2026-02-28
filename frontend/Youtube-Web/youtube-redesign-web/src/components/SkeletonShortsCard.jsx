import React from 'react';
import './SkeletonShortsCard.css';

const SkeletonShortsCard = () => {
    return (
        <div className="skeleton-shorts-card">
            <div className="skeleton-shorts-thumbnail"></div>
            <div className="skeleton-shorts-title"></div>
            <div className="skeleton-shorts-views"></div>
        </div>
    );
};

export default SkeletonShortsCard;
