export const isMobile = (): boolean => {
  // Check if running in browser environment
  if (typeof window === 'undefined') return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    // Also check screen width for tablets and smaller devices
    window.innerWidth <= 768
  );
};

// Additional helper for more specific device types if needed
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
}; 