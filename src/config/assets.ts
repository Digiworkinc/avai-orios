/**
 * Asset Configuration
 * Maps external URLs to local assets for production deployment
 * Replace placeholder paths with actual local image files
 */

export const ASSET_CONFIG = {
  images: {
    // Hero section - Main tech/technology image
    heroTech: '/images/hero-tech.svg',
    
    // Portfolio images
    portfolioAltar: '/images/portfolio-altar.svg',
    portfolioAudio: '/images/portfolio-audio.svg',
    portfolioStreaming: '/images/portfolio-streaming.svg',
  },
  icons: {
    // App icons for PWA
    appIcon192: '/images/app-icon-192.svg',
    appIcon512: '/images/app-icon-512.svg',
  },
};

/**
 * Get image URL - uses local assets in production
 */
export const getImageUrl = (key: keyof typeof ASSET_CONFIG.images): string => {
  return ASSET_CONFIG.images[key];
};

/**
 * Get icon URL - uses local assets in production
 */
export const getIconUrl = (key: keyof typeof ASSET_CONFIG.icons): string => {
  return ASSET_CONFIG.icons[key];
};
