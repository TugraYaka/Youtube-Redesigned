import React, { useState, useEffect } from 'react';

const ScreenSizeDebug = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#0f0',
            padding: '8px 12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            zIndex: 99999,
            pointerEvents: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #0f0'
        }}>
            Width: {width}px
        </div>
    );
};

export default ScreenSizeDebug;
