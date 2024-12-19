import axios from 'axios';
import { YOUTUBE_API_KEY, YOUTUBE_API_BASE } from './youtube'; // Import YouTube constants

const BASE_URL = 'https://saavn.dev/api';
export const CORS_PROXY = 'https://corsproxy.io/?';

export interface SongResult {
  id: string;
  name: string;
  primaryArtists: string | string[];
  artists: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
      image?: Array<{
        quality: string;
        url: string;
      }>;
    }>;
  };
  duration: string;
  image: Array<{ quality: string; url: string }>;
  downloadUrl: Array<{ quality: string; url: string }>;
  album: {
    name: string;
    url: string;
  };
  language?: string;
}

export interface SearchResponse {
  status: string;
  data: {
    results: SongResult[];
  };
}

export interface ArtistResult {
  id: string;
  name: string;
  image: { quality: string; link: string }[];
  description: string;
  url: string;
}

export interface AlbumResult {
  id: string;
  name: string;
  artists: string[];
  image: { quality: string; link: string }[];
  songs: SongResult[];
}

export interface PlaylistResult {
  id: string;
  name: string;
  description: string;
  image: { quality: string; link: string }[];
  songs: SongResult[];
}

// Create axios instance without CORS proxy for API calls
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Helper function to handle image URLs
const getProxiedUrl = (url: string | undefined, defaultUrl = 'https://placehold.co/400x400?text=No+Image'): string => {
  if (!url) return defaultUrl;
  
  // If URL is already proxied or is a data URL, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // For Saavn CDN URLs, keep original URL
  if (url.includes('saavncdn.com')) {
    return url.replace('ts.saavncdn.com', 'c.saavncdn.com');
  }

  // Use CORS proxy for non-Saavn URLs
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

// Add separate functions for audio and image URLs
export const proxyAudioUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('saavncdn.com')) {
    return url;  // Don't proxy audio URLs from Saavn
  }
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

export const proxyImageUrl = (url: string) => {
  if (!url) return 'https://placehold.co/400x400?text=No+Image';
  
  // For Saavn CDN URLs, use c.saavncdn.com
  if (url.includes('saavncdn.com')) {
    return url.replace(/[a-z]\.saavncdn\.com/, 'c.saavncdn.com');
  }
  
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Song not found'));
    }
    return Promise.reject(error);
  }
);

export const searchAll = async (query: string) => {
  try {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

export const searchSongs = async (query: string): Promise<SongResult[]> => {
  try {
    if (!query.trim()) return [];

    const response = await api.get('/search/songs', {
      params: { query: query.trim() }
    });

    if (!response.data?.data?.results) {
      return [];
    }

    // Process and return the results with original URLs
    const results = response.data.data.results.map((song: any) => ({
      id: song.id,
      name: song.name,
      primaryArtists: song.primaryArtists,
      artists: song.artists || { primary: [] },
      duration: song.duration,
      // Keep original URLs from API response
      image: song.image || [],
      downloadUrl: song.downloadUrl || [],
      album: song.album || { name: '', url: '' },
      language: song.language
    }));

    return results;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export const searchArtists = async (query: string) => {
  try {
    const response = await api.get(`/search/artists?query=${encodeURIComponent(query)}`);
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};

export const searchAlbums = async (query: string) => {
  try {
    const response = await api.get(`/search/albums?query=${encodeURIComponent(query)}`);
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching albums:', error);
    throw error;
  }
};

export const searchPlaylists = async (query: string) => {
  try {
    const response = await api.get(`/search/playlists?query=${encodeURIComponent(query)}`);
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching playlists:', error);
    throw error;
  }
};

export const getTrendingSongs = async (): Promise<SongResult[]> => {
  try {
    // First get trending music videos from YouTube
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music category
        regionCode: 'IN',
        maxResults: 20,
        key: YOUTUBE_API_KEY
      }
    }).catch(error => {
      if (error.response?.status === 403) {
        console.warn('YouTube API quota exceeded or key invalid');
        return { data: { items: [] } };
      }
      throw error;
    });

    if (!response?.data?.items?.length) {
      return [];
    }

    // Get clean song names from YouTube results
    const songQueries = response.data.items.map((video: any) => {
      const title = cleanVideoTitle(video.snippet.title);
      return title;
    });

    // Search each song on Saavn
    const songResults = await Promise.all(
      songQueries.map(async (query) => {
        try {
          const saavnResponse = await api.get('/search/songs', {
            params: { query }
          });
          return saavnResponse.data?.data?.results?.[0];
        } catch (error) {
          console.error('Error searching Saavn for:', query);
          return null;
        }
      })
    );

    // Filter out null results and format response
    const results = songResults
      .filter(song => song !== null)
      .map((song: any) => ({
        id: song.id,
        name: song.name,
        primaryArtists: song.primaryArtists,
        artists: song.artists || { primary: [] },
        duration: song.duration,
        image: song.image?.map((img: any) => ({
          quality: img.quality,
          url: img.url.replace('ts.saavncdn.com', 'c.saavncdn.com')
        })) || [],
        downloadUrl: song.downloadUrl?.map((dl: any) => ({
          quality: dl.quality,
          url: dl.url
        })) || [],
        album: song.album?.name || '',
        language: song.language
      }));

    return results;
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    return [];
  }
};

// Helper function to clean video titles
const cleanVideoTitle = (title: string): string => {
  return title
    .replace(/\(Official.*?\)/gi, '')
    .replace(/\[.*?\]/gi, '')
    .replace(/ft\.|feat\./gi, '')
    .replace(/\|.*$/g, '')
    .replace(/Official (Music )?Video/gi, '')
    .replace(/Audio/gi, '')
    .replace(/Lyrics/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getSongDetails = async (id: string): Promise<SongResult> => {
  try {
    const response = await api.get(`/songs?id=${id}`);
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching song details:', error);
    throw error;
  }
};

const convertApiResponse = (song: any): SongResult => {
  return {
    id: song.id,
    name: song.name,
    primaryArtists: song.artists.primary.map((artist: any) => artist.name).join(', '),
    // ... rest of the conversion
  };
};

export const searchByGenre = async (genre: string): Promise<SongResult[]> => {
  try {
    const response = await api.get(`/search/songs`, {
      params: {
        query: genre,
        filter: 'genre'
      }
    });
    
    if (!response.data?.data?.results) {
      return [];
    }
    
    return response.data.data.results;
  } catch (error) {
    console.error('Error searching by genre:', error);
    return [];
  }
};