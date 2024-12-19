export const CORS_PROXY = 'https://corsproxy.io/?';

export const getProxiedUrl = (url: string | undefined, defaultUrl = 'https://placehold.co/400x400?text=No+Image'): string => {
  if (!url) return defaultUrl;
  
  // If URL is already proxied or is a data URL, return as is
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes(CORS_PROXY)) {
    return url;
  }

  // Use CORS proxy for all URLs
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

export const getProxiedImageUrl = (url: string | undefined): string => {
  return getProxiedUrl(url, 'https://placehold.co/400x400?text=No+Image');
};

export const getProxiedAudioUrl = (url: string | undefined): string => {
  return getProxiedUrl(url, '');
}; 