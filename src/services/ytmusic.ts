import type { Track } from '../types';
import { searchSongs } from './api';
import { initializeYTMusic } from './ytmusic-auth';

const API_KEY = 'AIzaSyCCykdP6hHsj-yPgfEMl1SjoQASBC3b8N8';

// Use this in your API calls
const ytMusic = new YTMusic({ auth: API_KEY });

export const getSimilarSongs = async (track: Track): Promise<Track[]> => {
  try {
    if (!ytMusic) {
      console.warn('YTMusic not initialized');
      return [];
    }

    console.log('Searching for:', track.name);
    
    // Search for the track
    const searchResults = await ytMusic.search(track.name, {
      filter: 'songs',
      limit: 1
    });
    
    if (!searchResults?.length) {
      console.warn('No YTMusic results found for:', track.name);
      return [];
    }

    // Get watch playlist (similar songs)
    const watchPlaylist = await ytMusic.getWatchPlaylist(searchResults[0].videoId);
    const relatedSongs = watchPlaylist?.tracks || [];

    const tracks = await Promise.all(
      relatedSongs.slice(0, 10).map(async (song: any) => {
        try {
          const cleanTitle = cleanVideoTitle(song.title);
          const searchResults = await searchSongs(cleanTitle);
          
          if (searchResults?.length) {
            const saavnTrack = searchResults[0];
            const audioUrl = saavnTrack.downloadUrl?.[saavnTrack.downloadUrl.length - 1]?.url;
            const imageUrl = saavnTrack.image?.[saavnTrack.image.length - 1]?.url;

            if (!audioUrl) return null;

            return {
              id: `yt-${song.videoId}`,
              name: saavnTrack.name || cleanTitle,
              primaryArtists: saavnTrack.primaryArtists || song.artists?.[0]?.name || 'Unknown Artist',
              duration: parseInt(saavnTrack.duration) || 0,
              albumArt: imageUrl || 'https://placehold.co/400x400?text=No+Image',
              audioUrl,
              album: saavnTrack.album?.name || song.album?.name
            };
          }
          return null;
        } catch (error) {
          console.error('Error processing song:', error);
          return null;
        }
      })
    );

    const validTracks = tracks.filter((t): t is Track => t !== null);
    console.log('Found valid tracks:', validTracks.length);
    return validTracks;
  } catch (error) {
    console.error('Error fetching similar songs:', error);
    return [];
  }
};

export const getTrendingTracks = async (): Promise<Track[]> => {
  try {
    if (!ytMusic) {
      console.warn('YTMusic not initialized');
      return [];
    }

    // Get trending music from YTMusic charts
    const charts = await ytMusic.getCharts();
    const trendingSongs = charts.trends?.items?.slice(0, 20) || [];

    const tracks = await Promise.all(
      trendingSongs.map(async (song: any) => {
        try {
          const searchResults = await searchSongs(`${song.title} ${song.artists?.[0]?.name}`);
          
          if (searchResults?.length) {
            const saavnTrack = searchResults[0];
            return {
              id: `yt-${song.videoId}`,
              name: saavnTrack.name || song.title,
              primaryArtists: saavnTrack.primaryArtists || song.artists?.[0]?.name,
              duration: parseInt(saavnTrack.duration) || 0,
              albumArt: saavnTrack.image?.[saavnTrack.image.length - 1]?.url || 'https://placehold.co/400x400?text=No+Image',
              audioUrl: saavnTrack.downloadUrl?.[saavnTrack.downloadUrl.length - 1]?.url,
              album: saavnTrack.album?.name || song.album?.name
            };
          }
          return null;
        } catch (error) {
          console.error('Error processing trending song:', error);
          return null;
        }
      })
    );

    return tracks.filter((track): track is Track => track !== null);
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return [];
  }
};

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