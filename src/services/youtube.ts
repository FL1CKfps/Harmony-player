import axios from 'axios';
import { searchSongs } from './api';
import { getProxiedImageUrl, getProxiedAudioUrl } from '../utils/mediaUtils';
import type { Track } from '../types';
import { isMobile } from '../utils/deviceDetector';

export const YOUTUBE_API_KEY = 'AIzaSyCH0X6H6poZ7Y4KSTYvl40sq0QV1vYa47U';
export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Get similar songs based on current track
export const getSimilarSongs = async (track: Track): Promise<Track[]> => {
  try {
    console.log('Searching for:', track.name, 'Artist:', track.primaryArtists, 'Language:', track.language);
    
    // First try to find songs by the same artist
    const artistResponse = await searchSongs(track.primaryArtists);
    let artistSongs = artistResponse
      .filter(song => song.id !== track.id) // Filter out current song
      .slice(0, 5); // Limit to 5 songs by same artist

    try {
      // Try YouTube search
      const searchResponse = await axios.get(`${YOUTUBE_API_BASE}/search`, {
        params: {
          part: 'snippet',
          q: `${track.name} ${track.language} music`,
          type: 'video',
          videoCategoryId: '10',
          maxResults: 15,
          key: YOUTUBE_API_KEY
        }
      });

      if (searchResponse?.data?.items?.length) {
        // Process YouTube results...
        const songQueries = searchResponse.data.items.map((video: any) => {
          const title = cleanVideoTitle(video.snippet.title);
          return title;
        });

        // Search each song on Saavn
        const songResults = await Promise.all(
          songQueries.map(async (query) => {
            try {
              const saavnResponse = await searchSongs(query);
              return saavnResponse.find(song => 
                song.language === track.language || 
                (typeof song.primaryArtists === 'string' && 
                 song.primaryArtists.toLowerCase().includes(track.primaryArtists.toLowerCase()))
              );
            } catch (error) {
              console.error('Error searching Saavn for:', query);
              return null;
            }
          })
        );

        // Combine with artist songs
        artistSongs = [...artistSongs, ...songResults];
      }
    } catch (error) {
      console.warn('YouTube API error, falling back to Saavn search:', error);
      // On YouTube API error, search Saavn directly
      const saavnResults = await searchSongs(`${track.name} ${track.primaryArtists}`);
      artistSongs = [...artistSongs, ...saavnResults.slice(0, 10)];
    }

    // Filter and process results
    const tracks = artistSongs
      .filter((song): song is NonNullable<typeof song> => song !== null)
      .map(song => convertToTrack(song))
      .filter((track): track is NonNullable<typeof track> => 
        track !== null && 
        track.audioUrl && 
        track.name && 
        track.primaryArtists &&
        track.language === track.language // Ensure language matches
      )
      // Remove duplicates by ID
      .filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      );

    console.log(`Found ${tracks.length} similar tracks (${artistSongs.length} by same artist)`);
    return tracks;
  } catch (error) {
    console.error('Error fetching similar songs:', error);
    return [];
  }
};

// Fetch trending music videos from YouTube India
export const getTrendingMusicVideos = async () => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music category
        regionCode: 'IN',
        maxResults: 20,
        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
};

// Clean video titles
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

// Convert Saavn result to Track type
const convertToTrack = (song: any): Track | null => {
  try {
    if (!song?.id || !song?.name) {
      console.debug('Missing basic track info:', song?.name);
      return null;
    }

    // Get highest quality image
    const imageUrl = song.image?.find(img => img.quality === '500x500')?.url 
      || song.image?.[song.image.length - 1]?.url;

    // Get highest quality audio
    const audioUrl = song.downloadUrl?.find(dl => dl.quality === '320kbps')?.url 
      || song.downloadUrl?.[song.downloadUrl.length - 1]?.url;

    // Get artist name(s)
    const artists = typeof song.primaryArtists === 'string' 
      ? song.primaryArtists
      : Array.isArray(song.primaryArtists) 
        ? song.primaryArtists.join(', ')
        : song.artists?.primary?.map(a => a.name)?.join(', ') || 'Unknown Artist';

    if (!audioUrl) {
      console.debug('No audio URL found for:', song.name);
      return null;
    }

    return {
      id: song.id,
      name: song.name,
      primaryArtists: artists,
      duration: parseInt(song.duration || '0'),
      albumArt: imageUrl?.replace('ts.saavncdn.com', 'c.saavncdn.com') || 'https://placehold.co/400x400?text=No+Image',
      audioUrl: audioUrl,
      album: song.album?.name || '',
      language: song.language || ''
    };
  } catch (error) {
    console.error('Error converting track:', error);
    return null;
  }
}; 

export const getOptimizedVideoQuality = () => {
  return isMobile() ? 'medium' : 'high';
};

// Modify your existing video fetching function
export const fetchVideoData = async (videoId: string) => {
  // ... existing code ...
  
  const quality = getOptimizedVideoQuality();
  
  // Add quality parameter to your video requests
  const params = {
    // ... existing params ...
    quality: quality,
  };
  
  // ... rest of the function
}; 