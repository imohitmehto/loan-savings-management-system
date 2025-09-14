'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

export default function SplashProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      setShowSplash(false);
    }

    setIsLoading(false);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (isLoading) {
    return null; // or a simple loading state
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <>{children}</>;
}
