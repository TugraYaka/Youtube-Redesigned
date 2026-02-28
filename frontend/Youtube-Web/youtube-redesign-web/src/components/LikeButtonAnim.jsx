import React from 'react';
import './LikeButtonAnim.css';

const LikeButtonAnim = ({ isLiked, onClick, className }) => {
    
    

    return (
        <svg
            className={`like-svg-anim ${isLiked ? 'liked' : ''} ${className || ''}`}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="24"
            height="24"
        >
            <g className="p-container p1"><circle className="particle circle-1" cx="32" cy="32" r="2.5" fill="#FF5A5A" /></g>
            <g className="p-container p2"><circle className="particle circle-2" cx="32" cy="32" r="2" fill="#32CD32" /></g>
            <g className="p-container p3"><circle className="particle circle-1" cx="32" cy="32" r="3" fill="#1E90FF" /></g>
            <g className="p-container p4"><circle className="particle circle-2" cx="32" cy="32" r="2" fill="#FFD700" /></g>
            <g className="p-container p5"><circle className="particle circle-1" cx="32" cy="32" r="2" fill="#FF69B4" /></g>
            <g className="p-container p6"><circle className="particle circle-2" cx="32" cy="32" r="2.5" fill="#00CED1" /></g>
            <g className="p-container p7"><circle className="particle circle-1" cx="32" cy="32" r="2" fill="#FFA500" /></g>
            <g className="p-container p8"><circle className="particle circle-2" cx="32" cy="32" r="3" fill="#9370DB" /></g>
            <g className="p-container p9"><circle className="particle circle-1" cx="32" cy="32" r="2.5" fill="#FF4500" /></g>
            <g className="p-container p10"><circle className="particle circle-2" cx="32" cy="32" r="2" fill="#7CFC00" /></g>
            <g className="p-container p11"><circle className="particle circle-1" cx="32" cy="32" r="2" fill="#00BFFF" /></g>
            <g className="p-container p12"><circle className="particle circle-2" cx="32" cy="32" r="2.5" fill="#FF1493" /></g>

            <g transform="translate(20, 20)">
                <path
                    className="thumb"
                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                />
            </g>
        </svg>
    );
};

export default LikeButtonAnim;
