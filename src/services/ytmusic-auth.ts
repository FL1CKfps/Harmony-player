import { YTMusic } from 'ytmusicapi';

// Initialize YTMusic with headers
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Content-Type': 'application/json',
  'X-Goog-AuthUser': '0',
  'origin': 'https://music.youtube.com'
};

export const initializeYTMusic = async () => {
  try {
    const ytmusic = new YTMusic({ auth: headers });
    await ytmusic.initialize(); // Make sure the client is initialized
    return ytmusic;
  } catch (error) {
    console.error('Failed to initialize YTMusic:', error);
    return null;
  }
}; 