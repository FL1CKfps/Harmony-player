import axios from 'axios';

const API_KEY = '4a116cda48412684e4a40f4f8727e2d2';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const lastfmApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    format: 'json',
  },
});

export interface LastFmTrack {
  name: string;
  artist: {
    name: string;
    mbid: string;
  };
  url: string;
  duration: string;
  playcount: string;
  listeners: string;
  mbid: string;
  image: Array<{
    '#text': string;
    size: string;
  }>;
}

export const getArtistTopTracks = async (artistName: string, limit: number = 10): Promise<LastFmTrack[]> => {
  try {
    const response = await lastfmApi.get('', {
      params: {
        method: 'artist.getTopTracks',
        artist: artistName,
        limit,
      },
    });

    if (!response.data?.toptracks?.track) {
      console.warn('No top tracks found for artist:', artistName);
      return [];
    }

    return response.data.toptracks.track;
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    return [];
  }
};

export const getSimilarTracks = async (trackName: string, artistName: string): Promise<LastFmTrack[]> => {
  try {
    console.log('Fetching similar tracks for:', { trackName, artistName });
    
    const response = await lastfmApi.get('', {
      params: {
        method: 'track.getSimilar',
        track: trackName,
        artist: artistName,
        limit: 10,
      },
    });

    if (!response.data?.similartracks?.track) {
      console.warn('No similar tracks found, falling back to artist top tracks');
      return getArtistTopTracks(artistName);
    }

    return response.data.similartracks.track;
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    return [];
  }
};

export const getGlobalTrending = async (limit: number = 20): Promise<LastFmTrack[]> => {
  try {
    const genres = ['pop', 'rock', 'hip-hop', 'electronic', 'indie'];
    const tracksPerGenre = Math.floor(limit / genres.length);

    const genreTracks = await Promise.all(
      genres.map(async (genre) => {
        const response = await lastfmApi.get('', {
          params: {
            method: 'tag.getTopTracks',
            tag: genre,
            limit: tracksPerGenre,
          },
        });

        if (!response.data?.tracks?.track) {
          console.warn(`No tracks found for genre: ${genre}`);
          return [];
        }

        return response.data.tracks.track.map((track: LastFmTrack) => ({
          ...track,
          genre,
        }));
      })
    );

    // Combine and shuffle tracks from all genres
    const allTracks = genreTracks.flat();
    return allTracks
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching global trending:', error);
    
    // Fallback to regular top tracks
    try {
      const response = await lastfmApi.get('', {
        params: {
          method: 'chart.getTopTracks',
          limit,
        },
      });

      if (!response.data?.tracks?.track) {
        console.warn('No trending tracks found');
        return [];
      }

      return response.data.tracks.track;
    } catch (fallbackError) {
      console.error('Error fetching fallback trending tracks:', fallbackError);
      return [];
    }
  }
}; 