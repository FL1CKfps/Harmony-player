import { useState, useCallback } from 'react';
import { jiosaavnApi } from '../services/jiosaavnApi';
import type { 
  JioSaavnSearchResults, 
  JioSaavnSong, 
  JioSaavnAlbum, 
  JioSaavnPlaylist, 
  JioSaavnArtist,
  JioSaavnLyrics 
} from '../types/jiosaavn';

export const useJioSaavn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T>(request: Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await request;
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const search = useCallback(async (
    query: string,
    type: 'all' | 'songs' | 'albums' | 'artists' | 'playlists' = 'all'
  ) => {
    return handleRequest(jiosaavnApi.search(query, type));
  }, []);

  const getSongDetails = useCallback(async (id: string) => {
    return handleRequest(jiosaavnApi.getSongDetails(id));
  }, []);

  const getAlbumDetails = useCallback(async (id: string) => {
    return handleRequest(jiosaavnApi.getAlbumDetails(id));
  }, []);

  const getPlaylistDetails = useCallback(async (id: string) => {
    return handleRequest(jiosaavnApi.getPlaylistDetails(id));
  }, []);

  const getArtistDetails = useCallback(async (id: string) => {
    return handleRequest(jiosaavnApi.getArtistDetails(id));
  }, []);

  const getLyrics = useCallback(async (id: string) => {
    return handleRequest(jiosaavnApi.getLyrics(id));
  }, []);

  const getCharts = useCallback(async () => {
    return handleRequest(jiosaavnApi.getCharts());
  }, []);

  const getTrending = useCallback(async () => {
    return handleRequest(jiosaavnApi.getTrending());
  }, []);

  return {
    isLoading,
    error,
    search,
    getSongDetails,
    getAlbumDetails,
    getPlaylistDetails,
    getArtistDetails,
    getLyrics,
    getCharts,
    getTrending
  };
};