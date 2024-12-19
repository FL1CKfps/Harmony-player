import { searchSongs } from './api';
import type { Track } from '../types';
import axios from 'axios';
import { getProxiedImageUrl, getProxiedAudioUrl } from '../utils/mediaUtils';

const YOUTUBE_API_KEY = 'AIzaSyAewJIJ52vYdj8K5mAzkktv8jRpwBqOboQ';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Add the correct proxy with anonymous region
const IMG_PROXY = 'https://corsproxy.io/?region=anonymous&url=';

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
  };
}

// Fetch trending music videos from YouTube
export const getTrendingTracks = async (): Promise<Track[]> => {
  try {
    console.log('Fetching trending music videos from YouTube...');
    
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10',
        regionCode: 'IN',
        maxResults: 20,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items as YouTubeVideo[];
    console.log('Found trending videos:', videos.length);

    // Convert each YouTube video title to a Saavn track
    const tracks = await Promise.all(
      videos.map(async (video, index) => {
        try {
          const cleanTitle = cleanVideoTitle(video.snippet.title);
          console.log(`Searching Saavn for: "${cleanTitle}"`);
          
          const searchResults = await searchSongs(cleanTitle).catch(error => {
            console.error(`Saavn search failed for "${cleanTitle}":`, error);
            return null;
          });
          
          if (!searchResults?.length) {
            console.warn('No Saavn results found for:', cleanTitle);
            return null;
          }

          const saavnTrack = searchResults[0];
          console.log(`Found Saavn track: "${saavnTrack.name}" for YouTube video: "${cleanTitle}"`);

          // Use direct Saavn CDN URL with anonymous proxy
          const originalImageUrl = saavnTrack.image?.[saavnTrack.image.length - 1]?.url;
          const imageUrl = originalImageUrl ? `${IMG_PROXY}${encodeURIComponent(originalImageUrl)}` : 'https://placehold.co/400x400?text=No+Image';

          return {
            id: `yt-${video.id}-${index}`,
            name: saavnTrack.name,
            primaryArtists: saavnTrack.primaryArtists,
            duration: parseInt(saavnTrack.duration),
            albumArt: imageUrl,
            audioUrl: getProxiedAudioUrl(saavnTrack.downloadUrl?.[saavnTrack.downloadUrl.length - 1]?.url),
            album: saavnTrack.album?.name,
            youtubeTitle: cleanTitle
          };
        } catch (error) {
          console.error(`Error processing video: ${video.snippet.title}`, error);
          return null;
        }
      })
    );

    const validTracks = tracks.filter(Boolean);
    console.log(`Successfully converted ${validTracks.length} out of ${videos.length} videos to tracks`);
    
    return validTracks.length ? validTracks : await getFallbackTracks();
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return getFallbackTracks();
  }
};

// Get similar tracks based on current track
export const getSimilarTracks = async (track: Track): Promise<Track[]> => {
  try {
    console.log('Searching similar tracks for:', track.name);
    
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10',
        maxResults: 10,
        q: `${track.name} ${track.primaryArtists} song`,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      snippet: item.snippet
    }));

    const tracks = await Promise.all(
      videos.map(async (video, index) => {
        const cleanTitle = cleanVideoTitle(video.snippet.title);
        const searchResults = await searchSongs(cleanTitle);
        
        if (searchResults && searchResults.length > 0) {
          const saavnTrack = searchResults[0];

          return {
            id: `similar-${video.id}-${index}`,
            name: saavnTrack.name,
            primaryArtists: saavnTrack.primaryArtists,
            duration: parseInt(saavnTrack.duration),
            albumArt: getProxiedImageUrl(saavnTrack.image?.[saavnTrack.image.length - 1]?.url),
            audioUrl: getProxiedAudioUrl(saavnTrack.downloadUrl?.[saavnTrack.downloadUrl.length - 1]?.url),
            album: saavnTrack.album?.name
          };
        }
        return null;
      })
    );

    return tracks.filter(Boolean);
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    return [];
  }
};

// Clean up YouTube video titles for better Saavn search
const cleanVideoTitle = (title: string): string => {
  return title
    .replace(/\(Official.*?\)/gi, '')
    .replace(/\[.*?\]/gi, '')
    .replace(/ft\.|feat\./gi, '')
    .replace(/\|.*$/g, '')
    .replace(/Official Music Video/gi, '')
    .replace(/Official Video/gi, '')
    .replace(/Official Audio/gi, '')
    .replace(/Full Video/gi, '')
    .replace(/With Lyrics/gi, '')
    .replace(/Lyrics/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Fallback tracks if everything fails
const getFallbackTracks = async (): Promise<Track[]> => {
  const fallbackSongs = [
    { title: "Tere Vaaste", artist: "Varun Jain" },
    { title: "Kesariya", artist: "Arijit Singh" },
    { title: "Raatan Lambiyan", artist: "Jubin Nautiyal" },
    { title: "Pasoori", artist: "Ali Sethi" }
  ];

  const tracks = await Promise.all(
    fallbackSongs.map(async (song, index) => {
      const results = await searchSongs(`${song.title} ${song.artist}`);
      if (results && results.length > 0) {
        const track = results[0];
        return {
          ...track,
          id: `fallback-${index}`,
          albumArt: getProxiedImageUrl(track.image?.[track.image.length - 1]?.url),
          audioUrl: getProxiedAudioUrl(track.downloadUrl?.[track.downloadUrl.length - 1]?.url)
        };
      }
      return null;
    })
  );

  return tracks.filter(Boolean);
};

export type { YouTubeVideo };