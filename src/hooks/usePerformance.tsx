import React, { useEffect } from 'react';

// Preload critical resources for faster page loads
export const usePreloadCriticalResources = () => {
  useEffect(() => {
    // Preload Google OAuth script when user is likely to need it
    const preloadGoogleOAuth = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = 'https://accounts.google.com/gsi/client';
      document.head.appendChild(link);
    };

    // Preload after a short delay to not block initial render
    const timer = setTimeout(preloadGoogleOAuth, 500);

    return () => clearTimeout(timer);
  }, []);
};

// Hook to improve perceived performance with skeleton loading
export const usePageLoadingState = () => {
  return {
    // Minimal loading state for better UX
    LoadingSkeleton: () => (
      <div className="w-full h-11 bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-2"></div>
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    )
  };
};
