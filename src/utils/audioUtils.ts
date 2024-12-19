export const validateAudioUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if URL is valid
  try {
    new URL(url);
  } catch {
    return false;
  }

  // Check if URL points to an audio file
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export const getHighestQualityUrl = (urls: string[]): string | null => {
  if (!urls || urls.length === 0) return null;
  
  // Sort by quality indicators in URL
  const qualityOrder = ['320', 'high', '256', '192', '128', '96', '64', '32'];
  
  return urls
    .filter(validateAudioUrl)
    .sort((a, b) => {
      const aQuality = qualityOrder.findIndex(q => a.includes(q));
      const bQuality = qualityOrder.findIndex(q => b.includes(q));
      return (aQuality === -1 ? 999 : aQuality) - (bQuality === -1 ? 999 : bQuality);
    })[0] || null;
};