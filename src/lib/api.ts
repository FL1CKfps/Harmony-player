import axios from 'axios';

const BASE_URL = 'https://saavn.dev/api';

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface Song {
  id: string;
  name: string;
  album: {
    name: string;
    url: string;
  };
  year: string;
  duration: string;
  label: string;
  primaryArtists: string;
  primaryArtistsId: string;
  featuredArtists: string;
  featuredArtistsId: string;
  explicitContent: number;
  playCount: string;
  language: string;
  hasLyrics: string;
  url: string;
  copyright: string;
  image: Array<{ quality: string; link: string }>;
  downloadUrl: Array<{ quality: string; link: string }>;
}

export interface SearchResponse {
  status: string;
  message: null | string;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

class MusicAPI {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async search({ query, page = 1, limit = 20 }: SearchParams): Promise<SearchResponse> {
    try {
      const response = await this.api.get('/search/songs', {
        params: {
          query,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async getSongDetails(id: string): Promise<Song> {
    try {
      const response = await this.api.get(`/songs/${id}`);
      return response.data.data[0];
    } catch (error) {
      console.error('Get song details error:', error);
      throw error;
    }
  }

  async getLyrics(id: string): Promise<string> {
    try {
      const response = await this.api.get(`/lyrics/${id}`);
      return response.data.data.lyrics;
    } catch (error) {
      console.error('Get lyrics error:', error);
      throw error;
    }
  }

  async getTrending(): Promise<Song[]> {
    try {
      const response = await this.api.get('/trending/songs');
      return response.data.data;
    } catch (error) {
      console.error('Get trending error:', error);
      throw error;
    }
  }

  async getAlbumSongs(albumId: string): Promise<Song[]> {
    try {
      const response = await this.api.get(`/albums/${albumId}`);
      return response.data.data.songs;
    } catch (error) {
      console.error('Get album songs error:', error);
      throw error;
    }
  }
}

export const musicAPI = new MusicAPI();