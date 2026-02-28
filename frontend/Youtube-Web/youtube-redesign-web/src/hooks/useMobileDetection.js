import { useState, useEffect } from 'react';

const useMobileDetection = () => {
    const [isMobileUserAgent, setIsMobileUserAgent] = useState(false);

    useEffect(() => {
        const checkUserAgent = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            
            if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
                setIsMobileUserAgent(true);
            } else {
                setIsMobileUserAgent(false);
            }
        };

        checkUserAgent();
        
        
    }, []);

    return isMobileUserAgent;
};

export default useMobileDetection;
