'use client';

import { useState, useEffect } from 'react';

export function useSplashScreen() {
    const [showSplash, setShowSplash] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (!hasVisited) {
            setShowSplash(true);
            sessionStorage.setItem('hasVisited', 'true');
        }

        setIsLoading(false);
    }, []);

    const hideSplash = () => setShowSplash(false);

    return { showSplash, isLoading, hideSplash };
}
