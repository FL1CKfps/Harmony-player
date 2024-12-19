import { isMobile } from './deviceDetector';

export const optimizeForDevice = () => {
  if (isMobile()) {
    // Reduce animation complexity on mobile
    document.body.classList.add('reduce-motion');
    
    // Optimize image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
      
      // Use smaller images for mobile
      if (img.dataset.mobileUrl) {
        img.src = img.dataset.mobileUrl;
      }
    });
    
    // Reduce video quality when on mobile data
    if (navigator.connection) {
      const connection = navigator.connection as any;
      if (connection.saveData || connection.effectiveType === '4g') {
        // Implement lower quality video streaming
        window.localStorage.setItem('videoQuality', 'low');
      }
    }
  }
}; 