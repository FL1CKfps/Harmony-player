import { create } from 'zustand';
import { Howl } from 'howler';
import toast from 'react-hot-toast';
import { searchSongs, getTrendingSongs, type SongResult } from '../services/api';
import { nanoid } from 'nanoid';
import { getTrendingTracks } from '../services/recommendations';
import { getSimilarSongs } from '../services/youtube';
import axios from 'axios';
import { api, proxyImageUrl } from '../services/api';

interface Track {
  id: string;
  name: string;
  primaryArtists: string;
  duration: number;
  albumArt: string;
  audioUrl: string;
  album?: string;
  language?: string;
  artistImage?: string | null;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

interface Playlist {
  id: string;
  name: string;
  coverArt: string;
  tracks: Track[];
  createdAt: string;
}

interface RecentlyPlayedTrack extends Track {
  playedAt: number; // timestamp
}

interface PlayedTrack {
  id: string;
  timestamp: number;
}

interface QueueContext {
  type: 'playlist' | 'liked' | 'standalone' | 'radio';
  sourceId?: string; // playlist id if applicable
  shuffled: boolean;
}

interface MusicStore {
  tracks: Track[];
  currentTrack: Track | null;
  playbackState: PlaybackState;
  queue: Track[];
  history: Track[];
  currentTrackIndex: number;
  suggestions: Track[];
  isLoading: boolean;
  error: string | null;
  currentView: string;
  sound: Howl | null;
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  recentlyPlayed: RecentlyPlayedTrack[];
  showAllRecentlyPlayed: boolean;
  currentPlaylist: Playlist | null;
  globalTrending: Track[];
  globalTrendingTimestamp: number;
  showAllTrending: boolean;
  isRepeatEnabled: boolean;
  priorityQueue: Track[];
  playedTracks: PlayedTrack[];
  cachedSuggestions: Record<string, Track[]>;
  cachedTrending: Track[];
  cachedSimilarSongs: Record<string, Track[]>;
  lastTrendingFetch: number;
  lastSuggestionsFetch: Record<string, number>;
  lastSimilarSongsFetch: Record<string, number>;
  likedSongs: Track[];
  repeatMode: 'OFF' | 'ONE' | 'ALL';
  isShuffled: boolean;
  queueContext: QueueContext | null;
  artistImage: string | null;

  // Actions
  searchTracks: (query: string) => Promise<void>;
  fetchTrending: () => Promise<void>;
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track, context?: QueueContext) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setCurrentView: (view: string) => void;
  createPlaylist: (name: string) => Playlist;
  addToPlaylist: (playlistId: string, track: Track) => void;
  setSelectedPlaylistId: (id: string | null) => void;
  updatePlaylistName: (playlistId: string, newName: string) => void;
  addToPriorityQueue: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromPriorityQueue: (index: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  shuffleQueue: () => void;
  shufflePlaylist: (tracks: Track[]) => void;
  addToRecentlyPlayed: (track: Track) => void;
  setShowAllRecentlyPlayed: (show: boolean) => void;
  updatePlaybackTime: (time: number) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylists: () => Playlist[];
  setCurrentPlaylist: (playlist: Playlist) => void;
  fetchSimilarTracks: (track: Track) => Promise<void>;
  fetchGlobalTrending: () => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  toggleRepeat: () => void;
  toggleShowAllTrending: () => void;
  setRecentlyPlayed: (tracks: RecentlyPlayedTrack[]) => void;
  toggleLikeSong: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  playLikedSongs: (shuffle?: boolean) => void;
  toggleShuffle: () => void;
  playPlaylist: (playlist: Playlist, shuffle?: boolean) => void;
  fetchArtistImage: (artistId: string) => Promise<string | null>;
}

declare module 'howler' {
  export interface Howl {
    // existing Howl types...
  }
  export interface HowlOptions {
    xhr?: {
      headers?: Record<string, string>;
    };
  }
}

const CORS_PROXY = 'https://proxy.cors.sh/';

// Helper function to handle image URLs
const getProxiedUrl = (url: string | undefined, defaultUrl = 'https://placehold.co/400x400?text=No+Image'): string => {
  if (!url) return defaultUrl;
  
  // If URL is already proxied or is a data URL, return as is
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes(CORS_PROXY)) {
    return url;
  }

  // For Saavn CDN URLs, use a different proxy pattern
  if (url.includes('saavncdn.com')) {
    // Replace c.saavncdn.com with ts.saavncdn.com which has CORS headers
    return url.replace('c.saavncdn.com', 'ts.saavncdn.com')
              .replace('i.saavncdn.com', 'ts.saavncdn.com');
  }

  // For other URLs, use CORS proxy
  return `${CORS_PROXY}${url}`;
};

// Update the convertToTrack function
const convertToTrack = (song: SongResult): Track => {
  // Get highest quality image directly
  const getHighestQualityImage = () => {
    if (!song.image || song.image.length === 0) {
      return 'https://placehold.co/400x400?text=No+Image';
    }
    // Get the 500x500 quality image URL and keep original URL
    const imageUrl = song.image.find(img => img.quality === '500x500')?.url 
      || song.image[song.image.length - 1].url;
    
    // Use original URL with c.saavncdn.com domain
    return imageUrl.replace('ts.saavncdn.com', 'c.saavncdn.com');
  };

  // Get highest quality audio directly
  const getHighestQualityAudio = () => {
    if (!song.downloadUrl || song.downloadUrl.length === 0) {
      console.error('No audio URL available for track:', song.name);
      return '';
    }
    // Get the 320kbps quality audio URL
    return song.downloadUrl.find(dl => dl.quality === '320kbps')?.url 
      || song.downloadUrl[song.downloadUrl.length - 1].url;
  };

  // Get artist image URL
  const getArtistImage = () => {
    const primaryArtist = song.artists?.primary?.[0];
    if (!primaryArtist?.image?.length) return null;

    const imageUrl = primaryArtist.image.find(img => img.quality === '500x500')?.url
      || primaryArtist.image[primaryArtist.image.length - 1].url;
    
    return imageUrl ? imageUrl.replace('ts.saavncdn.com', 'c.saavncdn.com') : null;
  };

  // Get primary artists string
  const getPrimaryArtists = () => {
    if (typeof song.primaryArtists === 'string') {
      return song.primaryArtists;
    }
    if (Array.isArray(song.primaryArtists)) {
      return song.primaryArtists.join(', ');
    }
    if (song.artists?.primary?.length > 0) {
      return song.artists.primary.map(artist => artist.name).join(', ');
    }
    return 'Unknown Artist';
  };

  return {
    id: song.id,
    name: song.name,
    primaryArtists: getPrimaryArtists(),
    duration: parseInt(song.duration),
    albumArt: getHighestQualityImage(),
    audioUrl: getHighestQualityAudio(),
    album: song.album?.name || '',
    language: song.language,
    artistImage: getArtistImage()
  };
};

const loadPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem('harmony_playlists');
    // If no playlists saved, return empty array
    if (!saved) return [];
    
    // Filter out any "Liked Songs" playlist when loading
    const playlists = JSON.parse(saved).filter(
      (p: Playlist) => p.name.toLowerCase() !== 'liked songs'
    );
    
    console.log('Loaded playlists:', playlists);
    return playlists;
  } catch (error) {
    console.error('Error loading playlists:', error);
    return [];
  }
};

const savePlaylists = (playlists: Playlist[]) => {
  try {
    // Filter out any "Liked Songs" playlist when saving
    const filteredPlaylists = playlists.filter(
      p => p.name.toLowerCase() !== 'liked songs'
    );
    localStorage.setItem('harmony_playlists', JSON.stringify(filteredPlaylists));
    console.log('Saved playlists:', filteredPlaylists);
  } catch (error) {
    console.error('Error saving playlists:', error);
    throw error;
  }
};

const loadRecentlyPlayed = (): RecentlyPlayedTrack[] => {
  const saved = localStorage.getItem('harmony_recently_played');
  return saved ? JSON.parse(saved) : [];
};

const saveRecentlyPlayed = (tracks: RecentlyPlayedTrack[]) => {
  localStorage.setItem('harmony_recently_played', JSON.stringify(tracks));
};

// Add these helper functions before the store creation
const determineTrackContext = (track: Track, state: MusicStore): QueueContext => {
  const isInPlaylist = state.currentPlaylist?.tracks.some(t => t.id === track.id);
  const isInLiked = state.likedSongs.some(t => t.id === track.id);
  const isFromQueue = state.queue.some(t => t.id === track.id) || 
                     state.priorityQueue.some(t => t.id === track.id);

  if (isInPlaylist && !isFromQueue) {
    return {
      type: 'playlist',
      sourceId: state.currentPlaylist!.id,
      shuffled: state.isShuffled
    };
  }

  if (isInLiked && !isFromQueue) {
    return {
      type: 'liked',
      shuffled: state.isShuffled
    };
  }

  return {
    type: 'standalone',
    shuffled: false
  };
};

const updateQueueBasedOnContext = (
  track: Track, 
  context: QueueContext, 
  state: MusicStore,
  setState: (fn: (state: MusicStore) => Partial<MusicStore>) => void
) => {
  switch (context.type) {
    case 'playlist': {
      const playlist = state.playlists.find(p => p.id === context.sourceId);
      if (!playlist) return;

      const currentIndex = playlist.tracks.findIndex(t => t.id === track.id);
      if (currentIndex === -1) return;

      let remainingTracks = playlist.tracks.slice(currentIndex + 1);
      if (context.shuffled) {
        remainingTracks = shuffleArray(remainingTracks);
      }

      setState(state => ({
        queue: remainingTracks,
        priorityQueue: [],
        suggestions: [],
        queueContext: context,
        currentPlaylist: playlist
      }));
      break;
    }

    case 'liked': {
      const currentIndex = state.likedSongs.findIndex(t => t.id === track.id);
      if (currentIndex === -1) return;

      let remainingTracks = state.likedSongs.slice(currentIndex + 1);
      if (context.shuffled) {
        remainingTracks = shuffleArray(remainingTracks);
      }

      setState(state => ({
        queue: remainingTracks,
        priorityQueue: [],
        suggestions: [],
        queueContext: context,
        currentPlaylist: null
      }));
      break;
    }

    case 'standalone': {
      // Keep existing queue if track is from queue
      const isFromQueue = state.queue.some(t => t.id === track.id) || 
                         state.priorityQueue.some(t => t.id === track.id);

      setState(state => ({
        queue: isFromQueue ? state.queue.filter(t => t.id !== track.id) : state.queue,
        priorityQueue: state.priorityQueue.filter(t => t.id !== track.id),
        queueContext: context,
        currentPlaylist: null
      }));

      // Fetch similar tracks only for standalone tracks
      if (!isFromQueue && state.queue.length === 0) {
        state.fetchSimilarTracks(track);
      }
      break;
    }
  }
};

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface SuggestionScore {
  track: Track;
  score: number;
  lastPlayed?: number;
}

const calculateSuggestionScore = (
  track: Track,
  recentlyPlayed: RecentlyPlayedTrack[],
  currentTrack: Track | null
): number => {
  let score = 0;

  // Base score for matching genre/language
  if (currentTrack) {
    if (track.language === currentTrack.language) score += 2;
    // Add more genre matching when genre field is available
  }

  // Analyze recently played tracks
  recentlyPlayed.forEach((recent, index) => {
    const recentTrack = recent.track;
    const recencyBonus = 1 / (index + 1); // More recent = higher bonus

    // Artist match
    if (track.primaryArtists === recentTrack.primaryArtists) {
      score += 3 * recencyBonus;
    }

    // Language match
    if (track.language === recentTrack.language) {
      score += 2 * recencyBonus;
    }

    // Album match
    if (track.album === recentTrack.album) {
      score += 2 * recencyBonus;
    }
  });

  // Random factor to add variety (10% randomness)
  score += Math.random() * 0.1;

  return score;
};

const getSuggestedTracks = async (
  recentlyPlayed: RecentlyPlayedTrack[],
  currentTrack: Track | null,
  existingSuggestions: Track[],
  lastSuggestionUpdate: number
): Promise<Track[]> => {
  // Check if 24 hours have passed since last update
  const now = new Date().getTime();
  if (lastSuggestionUpdate && now - lastSuggestionUpdate < 24 * 60 * 60 * 1000) {
    return existingSuggestions;
  }

  // Get potential tracks from various sources
  const potentialTracks: Track[] = [];
  
  // 1. Get tracks from same artists as recently played
  for (const recent of recentlyPlayed.slice(0, 5)) {
    const artistTracks = await searchSongs(recent.track.primaryArtists);
    potentialTracks.push(...artistTracks);
  }

  // 2. Get trending tracks
  const trending = await getTrendingSongs();
  potentialTracks.push(...trending);

  // Remove duplicates and current track
  const uniqueTracks = potentialTracks.filter((track, index) => {
    const isUnique = potentialTracks.findIndex(t => t.id === track.id) === index;
    const notCurrentTrack = currentTrack ? track.id !== currentTrack.id : true;
    const notInExisting = !existingSuggestions.some(s => s.id === track.id);
    return isUnique && notCurrentTrack && notInExisting;
  });

  // Score and sort tracks
  const scoredTracks: SuggestionScore[] = uniqueTracks.map(track => ({
    track,
    score: calculateSuggestionScore(track, recentlyPlayed, currentTrack)
  }));

  // Sort by score and take top 10
  scoredTracks.sort((a, b) => b.score - a.score);
  return scoredTracks.slice(0, 10).map(st => st.track);
};

const BASE_URL = 'https://saavn.dev/api';

export const useStore = create<MusicStore>((set, get) => {
  // Helper function inside store creation to access get
  const getFallbackTracks = (currentTrack: Track, existingQueue: Track[]): Track[] => {
    // First try to get tracks by same artist
    let fallbackTracks = get().tracks.filter(t => 
      t.id !== currentTrack.id && 
      t.primaryArtists === currentTrack.primaryArtists &&
      !existingQueue.some(q => q.id === t.id)
    );

    // If not enough tracks, add some from trending
    if (fallbackTracks.length < 5) {
      const trendingTracks = get().globalTrending.filter(t => 
        t.id !== currentTrack.id &&
        !existingQueue.some(q => q.id === t.id) &&
        !fallbackTracks.some(f => f.id === t.id)
      );
      fallbackTracks = [...fallbackTracks, ...trendingTracks];
    }

    return fallbackTracks.slice(0, 5);
  };

  return {
    tracks: [],
    currentTrack: null,
    playbackState: {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
    },
    queue: [],
    history: [],
    currentTrackIndex: -1,
    suggestions: [],
    isLoading: false,
    error: null,
    currentView: 'home',
    sound: null,
    playlists: loadPlaylists().filter(p => p.name.toLowerCase() !== 'liked songs'),
    selectedPlaylistId: null,
    recentlyPlayed: loadRecentlyPlayed(),
    showAllRecentlyPlayed: false,
    currentPlaylist: null,
    globalTrending: [],
    globalTrendingTimestamp: 0,
    showAllTrending: false,
    isRepeatEnabled: false,
    priorityQueue: [],
    playedTracks: [],
    cachedSuggestions: {},
    cachedTrending: [],
    cachedSimilarSongs: {},
    lastTrendingFetch: 0,
    lastSuggestionsFetch: {},
    lastSimilarSongsFetch: {},
    likedSongs: JSON.parse(localStorage.getItem('harmony_liked_songs') || '[]'),
    repeatMode: 'OFF' as const,
    isShuffled: false,
    queueContext: null,
    artistImage: null,

    searchTracks: async (query: string) => {
      if (!query.trim()) return;
      
      try {
        set({ isLoading: true, error: null });
        const songs = await searchSongs(query);
        const tracks = songs.map(convertToTrack);
        set({ tracks, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to search tracks', isLoading: false });
        toast.error('Failed to search tracks');
      }
    },

    fetchTrending: async () => {
      try {
        set({ isLoading: true, error: null });
        const songs = await getTrendingSongs();
        const tracks = songs.map(convertToTrack);
        set({ tracks, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to fetch trending tracks', isLoading: false });
        toast.error('Failed to fetch trending tracks');
      }
    },

    setCurrentTrack: (track: Track) => {
      set({ currentTrack: track });
      get().playTrack(track);
    },

    playTrack: (track: Track, context?: QueueContext) => {
      if (!track?.audioUrl) {
        console.error('No audio URL for track:', track);
        toast.error('No audio available for this track');
        return;
      }

      // Determine track context if not provided
      const currentContext = context || determineTrackContext(track, get());

      // Clear existing queues and context when switching context types
      const previousContext = get().queueContext;
      if (previousContext?.type !== currentContext.type) {
        set({
          queue: [],
          priorityQueue: [],
          suggestions: [],
          queueContext: currentContext
        });
      }

      // Check if track is from queue
      const isFromQueue = get().queue.some(t => t.id === track.id) || 
                         get().priorityQueue.some(t => t.id === track.id);

      // Remove the current track from both queues before playing
      set(state => ({
        queue: state.queue.filter(t => t.id !== track.id),
        priorityQueue: state.priorityQueue.filter(t => t.id !== track.id)
      }));

      // Update queue based on context
      updateQueueBasedOnContext(track, currentContext, get(), set);

      // If track is not from queue and not from playlist/liked songs, refresh suggestions
      if (!isFromQueue && currentContext.type === 'standalone') {
        // Clear existing suggestions
        set({ suggestions: [] });
        // Fetch new suggestions after a short delay to ensure track is playing
        setTimeout(() => {
          get().fetchSuggestions();
        }, 1000);
      }

      // Audio setup
      const { sound: currentSound } = get();
      if (currentSound) {
        currentSound.unload();
      }

      console.log('Playing track:', track.name, 'context:', context, 'isFromQueue:', isFromQueue);

      // Audio setup
      let progressInterval: NodeJS.Timer;

      const newSound = new Howl({
        src: [track.audioUrl],
        html5: true,
        volume: get().playbackState.volume,
        format: ['mp4', 'mp3'],
        xhr: {
          headers: {
            'Accept': '*/*',
            'Range': 'bytes=0-',
            'Origin': window.location.origin
          }
        },
        onload: function() {
          set(state => ({
            playbackState: { ...state.playbackState, duration: this.duration() }
          }));
        },
        onplay: function() {
          set(state => ({
            playbackState: { ...state.playbackState, isPlaying: true }
          }));
          
          progressInterval = setInterval(() => {
            if (this.playing()) {
              set(state => ({
                playbackState: { 
                  ...state.playbackState, 
                  currentTime: this.seek() as number 
                }
              }));
            }
          }, 1000);
        },
        onpause: function() {
          set(state => ({
            playbackState: { ...state.playbackState, isPlaying: false }
          }));
        },
        onend: function() {
          clearInterval(progressInterval);
          get().playNext();
        },
        onstop: function() {
          clearInterval(progressInterval);
        },
        onloaderror: function() {
          console.error('Failed to load audio:', track.audioUrl);
          toast.error('Failed to load audio');
        }
      });

      newSound.play();
      
      set({ 
        sound: newSound, 
        currentTrack: track,
        playbackState: { 
          ...get().playbackState,
          currentTime: 0,
          duration: 0,
          isPlaying: true
        }
      });

      get().addToRecentlyPlayed(track);

      // Fetch artist image
      if (track.primaryArtists) {
        const mainArtist = track.primaryArtists.split(',')[0].trim();
        get().fetchArtistImage(mainArtist);
      }
    },

    pauseTrack: () => {
      const { sound } = get();
      if (sound) {
        sound.pause();
        set(state => ({
          playbackState: { ...state.playbackState, isPlaying: false }
        }));
      }
    },

    resumeTrack: () => {
      const { sound } = get();
      if (sound) {
        sound.play();
        set(state => ({
          playbackState: { ...state.playbackState, isPlaying: true }
        }));
      }
    },

    setVolume: (volume: number) => {
      const { sound } = get();
      if (sound) {
        sound.volume(volume);
      }
      set(state => ({
        playbackState: { ...state.playbackState, volume }
      }));
    },

    seekTo: (time: number) => {
      const { sound } = get();
      if (sound) {
        sound.seek(time);
        set(state => ({
          playbackState: { 
            ...state.playbackState, 
            currentTime: time
          }
        }));
      }
    },

    setCurrentView: (view: string) => set({ currentView: view }),

    createPlaylist: (name: string) => {
      const newPlaylist: Playlist = {
        id: nanoid(),
        name,
        tracks: [],
        coverArt: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300',
        createdAt: new Date().toISOString(),
      };

      set(state => {
        // Don't allow creating a playlist named "Liked Songs"
        if (name.toLowerCase() === 'liked songs') {
          toast.error('Cannot create a playlist named "Liked Songs"');
          return state;
        }

        const newPlaylists = [...state.playlists, newPlaylist];
        savePlaylists(newPlaylists);
        return { playlists: newPlaylists };
      });

      return newPlaylist;
    },
    
    addToPlaylist: (playlistId: string, track: Track) => {
      try {
        set(state => {
          const playlist = state.playlists.find(p => p.id === playlistId);
          
          if (!playlist) {
            toast.error('Playlist not found');
            return state;
          }

          // Check for duplicates
          if (playlist.tracks.some(t => t.id === track.id)) {
            toast.error('Track already in playlist');
            return state;
          }

          const newPlaylists = state.playlists.map(p => {
            if (p.id === playlistId) {
              return {
                ...p,
                tracks: [...p.tracks, track]
              };
            }
            return p;
          });

          savePlaylists(newPlaylists);
          toast.success('Added to playlist');
          return { playlists: newPlaylists };
        });
      } catch (error) {
        console.error('Error adding to playlist:', error);
        toast.error('Failed to add to playlist');
      }
    },

    setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),

    updatePlaylistName: (playlistId: string, newName: string) => {
      set((state) => {
        const newPlaylists = state.playlists.map((playlist) => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              name: newName
            };
          }
          return playlist;
        });
        savePlaylists(newPlaylists);
        return { playlists: newPlaylists };
      });
    },

    addToPriorityQueue: (track: Track) => {
      set(state => {
        // Check if track exists in either queue
        const isInPriorityQueue = state.priorityQueue.some(t => t.id === track.id);
        const isInQueue = state.queue.some(t => t.id === track.id);
        const isCurrentTrack = state.currentTrack?.id === track.id;

        if (isInPriorityQueue || isInQueue || isCurrentTrack) {
          toast.error('Track already in queue');
          return state;
        }

        return {
          priorityQueue: [track, ...state.priorityQueue]
        };
      });
      toast.success('Added to queue (next up)');
    },

    addToQueue: (track: Track) => {
      set(state => ({
        priorityQueue: [track, ...state.priorityQueue]
      }));
      toast.success('Added to queue');
    },

    removeFromPriorityQueue: (index: number) => {
      set(state => ({
        priorityQueue: state.priorityQueue.filter((_, i) => i !== index)
      }));
    },

    removeFromQueue: (index: number) => {
      set(state => ({
        queue: state.queue.filter((_, i) => i !== index)
      }));
    },

    clearQueue: () => {
      set({ 
        priorityQueue: [],
        queue: [] 
      });
    },

    playNext: () => {
      const { priorityQueue, queue, currentTrack, queueContext, repeatMode } = get();

      // Keep track of the current track to avoid adding it back to queue
      const currentTrackId = currentTrack?.id;

      if (repeatMode === 'ONE' && currentTrack) {
        set({ repeatMode: 'OFF' });
        get().playTrack(currentTrack, queueContext);
        return;
      }

      if (priorityQueue.length > 0) {
        const nextTrack = priorityQueue[0];
        set(state => ({
          priorityQueue: state.priorityQueue.slice(1),
          // Don't add the current track back to queue
          queue: currentTrackId ? state.queue.filter(t => t.id !== currentTrackId) : state.queue
        }));
        get().playTrack(nextTrack, queueContext);
        return;
      }

      if (queue.length > 0) {
        const nextTrack = queue[0];
        set(state => ({
          queue: state.queue.slice(1),
          // Don't add the current track back to queue
          priorityQueue: currentTrackId ? state.priorityQueue.filter(t => t.id !== currentTrackId) : state.priorityQueue
        }));
        get().playTrack(nextTrack, queueContext);
        return;
      }

      // Handle end of queue based on context and repeat mode
      if (queueContext && repeatMode === 'ALL') {
        switch (queueContext.type) {
          case 'playlist': {
            const playlist = get().currentPlaylist;
            if (playlist) {
              get().playPlaylist(playlist, queueContext.shuffled);
            }
            break;
          }
          case 'liked': {
            get().playLikedSongs(queueContext.shuffled);
            break;
          }
        }
      } else if (!queueContext && repeatMode === 'OFF') {
        // Only fetch suggestions for standalone tracks
        get().fetchSuggestions();
      }
    },

    playPrevious: () => {
      const { history, currentTrack, sound } = get();
      
      // If we're in the first 3 seconds of the track, go to previous track
      // Otherwise restart the current track
      if (sound && sound.seek() > 3) {
        sound.seek(0);
        return;
      }

      // Get the last played track from history
      const previousTrack = history[history.length - 1];
      
      if (previousTrack) {
        // Remove the track we're about to play from history
        set(state => ({
          history: state.history.slice(0, -1)
        }));

        // If current track exists, add it to the front of the queue
        if (currentTrack) {
          set(state => ({
            priorityQueue: [currentTrack, ...state.priorityQueue]
          }));
        }

        // Play the previous track
        get().playTrack(previousTrack);
      } else if (currentTrack) {
        // If no history but we have a current track, just restart it
        sound?.seek(0);
      }
    },

    shuffleQueue: () => {
      if (!get().isShuffled) return;
      
      set(state => {
        const shuffleTracks = (tracks: Track[]) => {
          const shuffled = [...tracks];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };

        return { 
          priorityQueue: shuffleTracks(state.priorityQueue),
          queue: shuffleTracks(state.queue)
        };
      });
      toast.success('Queue shuffled');
    },

    shufflePlaylist: (tracks: Track[]) => {
      if (!tracks || tracks.length === 0) {
        toast.error('No tracks to shuffle');
        return;
      }

      try {
        // Create a copy of tracks and shuffle them
        const shuffledTracks = [...tracks]
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        // Play first track and add rest to queue
        const firstTrack = shuffledTracks[0];
        const remainingTracks = shuffledTracks.slice(1);
        
        set({ queue: remainingTracks });
        get().playTrack(firstTrack);
        
        toast.success('Shuffling playlist');
      } catch (error) {
        console.error('Error shuffling playlist:', error);
        toast.error('Failed to shuffle playlist');
      }
    },

    addToRecentlyPlayed: (track: Track) => {
      set(state => {
        // Check if track already exists in recently played
        const exists = state.recentlyPlayed.find(t => t.id === track.id);
        if (exists) {
          // If it exists, don't add it again
          return state;
        }

        const newTrack: RecentlyPlayedTrack = {
          ...track,
          playedAt: Date.now()
        };

        const newRecentlyPlayed = [newTrack, ...state.recentlyPlayed].slice(0, 50); // Keep last 50 tracks
        saveRecentlyPlayed(newRecentlyPlayed);
        return { recentlyPlayed: newRecentlyPlayed };
      });
    },

    setShowAllRecentlyPlayed: (show: boolean) => set({ showAllRecentlyPlayed: show }),

    updatePlaybackTime: (time: number) => set(state => ({
      playbackState: { ...state.playbackState, currentTime: time }
    })),

    removeFromPlaylist: (playlistId: string, trackId: string) => {
      try {
        const state = get();
        const newPlaylists = state.playlists.map(playlist => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              tracks: playlist.tracks.filter(t => t.id !== trackId)
            };
          }
          return playlist;
        });

        savePlaylists(newPlaylists);
        set({ playlists: newPlaylists });
        toast.success('Removed from playlist');
      } catch (error) {
        console.error('Error removing from playlist:', error);
        toast.error('Failed to remove from playlist');
      }
    },

    getPlaylists: () => {
      const state = get();
      console.log('Current playlists:', state.playlists);
      return state.playlists;
    },

    setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),

    fetchSimilarTracks: async (track: Track) => {
      try {
        const now = Date.now();
        const lastUpdate = get().lastSimilarSongsFetch[track.id] || 0;
        const sixHours = 6 * 60 * 60 * 1000;

        // Use cached data if available and less than 6 hours old
        if (now - lastUpdate < sixHours && get().cachedSimilarSongs[track.id]?.length > 0) {
          const cachedSongs = get().cachedSimilarSongs[track.id];
          set(state => ({
            queue: [...state.queue, ...cachedSongs],
            suggestions: cachedSongs
          }));
          return;
        }

        const similarTracks = await getSimilarSongs(track);
        
        if (similarTracks.length > 0) {
          set(state => ({
            queue: [...state.queue, ...similarTracks],
            suggestions: similarTracks,
            cachedSimilarSongs: {
              ...state.cachedSimilarSongs,
              [track.id]: similarTracks
            },
            lastSimilarSongsFetch: {
              ...state.lastSimilarSongsFetch,
              [track.id]: now
            }
          }));
        } else {
          // Use fallback tracks if no similar tracks found
          const fallbackTracks = getFallbackTracks(track, []);
          if (fallbackTracks.length > 0) {
            set(state => ({
              queue: [...state.queue, ...fallbackTracks],
              suggestions: fallbackTracks
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching similar tracks:', error);
        // Use fallback tracks on error
        const fallbackTracks = getFallbackTracks(track, []);
        if (fallbackTracks.length > 0) {
          set(state => ({
            queue: [...state.queue, ...fallbackTracks],
            suggestions: fallbackTracks
          }));
        }
      }
    },

    fetchGlobalTrending: async () => {
      try {
        const lastFetch = get().lastTrendingFetch;
        const now = Date.now();
        
        // Return cached results if less than 5 minutes old
        if (lastFetch && now - lastFetch < 5 * 60 * 1000 && get().cachedTrending.length > 0) {
          set({ globalTrending: get().cachedTrending });
          return;
        }

        const songs = await getTrendingSongs();
        
        // Convert SongResult to Track
        const tracks: Track[] = songs.map(song => ({
          id: song.id,
          name: song.name,
          primaryArtists: typeof song.primaryArtists === 'string' 
            ? song.primaryArtists 
            : Array.isArray(song.primaryArtists) && song.primaryArtists.length > 0
              ? song.primaryArtists.join(', ')
              : song.artists?.primary?.map(artist => artist.name).join(', ') || 'Unknown Artist',
          duration: parseInt(song.duration),
          albumArt: song.image?.find(img => img.quality === '500x500')?.url 
            || song.image?.[song.image.length - 1]?.url 
            || 'https://placehold.co/400x400?text=No+Image',
          audioUrl: song.downloadUrl?.find(dl => dl.quality === '320kbps')?.url 
            || song.downloadUrl?.[song.downloadUrl.length - 1]?.url 
            || '',
          album: song.album?.name || '',
          language: song.language
        })).filter(track => track.audioUrl); // Filter out tracks without audio URL

        set({ 
          globalTrending: tracks,
          cachedTrending: tracks,
          lastTrendingFetch: now
        });
      } catch (error) {
        console.error('Error fetching global trending:', error);
        set({ error: 'Failed to fetch trending songs' });
      }
    },

    fetchSuggestions: async () => {
      const state = get();
      const { recentlyPlayed, currentTrack, suggestions, lastSuggestionUpdate } = state;

      try {
        const newSuggestions = await getSuggestedTracks(
          recentlyPlayed,
          currentTrack,
          suggestions,
          lastSuggestionUpdate || 0
        );

        set({
          suggestions: newSuggestions,
          lastSuggestionUpdate: new Date().getTime()
        });
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    },

    toggleRepeat: () => {
      set(state => {
        const modes = {
          'OFF': 'ONE',
          'ONE': 'ALL',
          'ALL': 'OFF'
        } as const;
        
        const newMode = modes[state.repeatMode];
        
        // Show toast message for each mode
        switch (newMode) {
          case 'ONE':
            toast.success('Repeat once');
            break;
          case 'ALL':
            toast.success('Repeat all');
            break;
          case 'OFF':
            toast.success('Repeat off');
            break;
        }
        
        return { repeatMode: newMode };
      });
    },

    toggleShowAllTrending: () => {
      set(state => ({ showAllTrending: !state.showAllTrending }));
    },

    setRecentlyPlayed: (tracks) => {
      set({ recentlyPlayed: tracks });
      saveRecentlyPlayed(tracks);
    },

    toggleLikeSong: (track: Track) => {
      set(state => {
        const isLiked = state.likedSongs.some(t => t.id === track.id);
        const newLikedSongs = isLiked
          ? state.likedSongs.filter(t => t.id !== track.id)
          : [...state.likedSongs, track];
        
        // Save to localStorage
        localStorage.setItem('harmony_liked_songs', JSON.stringify(newLikedSongs));
        
        return { likedSongs: newLikedSongs };
      });
    },

    isLiked: (trackId: string) => {
      return get().likedSongs.some(t => t.id === trackId);
    },

    playLikedSongs: (shuffle = false) => {
      const { likedSongs } = get();
      if (!likedSongs.length) return;

      console.log('Playing liked songs, shuffle:', shuffle);

      let tracksToPlay = [...likedSongs];
      if (shuffle) {
        tracksToPlay = tracksToPlay.sort(() => Math.random() - 0.5);
      }

      console.log('Queuing liked songs:', tracksToPlay.length);

      set({
        queue: tracksToPlay.slice(1),
        priorityQueue: [],
        suggestions: [],
        cachedSimilarSongs: {},
        lastSimilarSongsFetch: {},
        currentPlaylist: null
      });

      get().playTrack(tracksToPlay[0], true);
    },

    toggleShuffle: () => {
      set(state => ({ isShuffled: !state.isShuffled }));
      get().shuffleQueue();
    },

    playPlaylist: (playlist: Playlist, shuffle = false) => {
      if (!playlist.tracks.length) return;

      console.log('Playing playlist:', playlist.name, 'shuffle:', shuffle);

      let tracksToPlay = [...playlist.tracks];
      if (shuffle) {
        tracksToPlay = tracksToPlay.sort(() => Math.random() - 0.5);
      }

      console.log('Queuing playlist tracks:', tracksToPlay.length);

      set({
        queue: tracksToPlay.slice(1),
        priorityQueue: [],
        suggestions: [],
        cachedSimilarSongs: {},
        lastSimilarSongsFetch: {},
        currentPlaylist: playlist
      });

      get().playTrack(tracksToPlay[0], true);
    },

    fetchArtistImage: async (artistId: string) => {
      try {
        const response = await api.get('/search/songs', {
          params: { query: artistId }
        });
        
        const primaryArtist = response.data?.data?.results?.[0]?.artists?.primary?.[0];
        if (primaryArtist?.image?.length > 0) {
          const imageUrl = primaryArtist.image.find(img => img.quality === '500x500')?.url;
          if (imageUrl) {
            const proxiedUrl = proxyImageUrl(imageUrl);
            // Verify image loads before setting
            const img = new Image();
            img.src = proxiedUrl;
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            set({ artistImage: proxiedUrl });
            return proxiedUrl;
          }
        }

        // Fallback to current track's album art
        const currentTrack = get().currentTrack;
        if (currentTrack?.albumArt) {
          set({ artistImage: currentTrack.albumArt });
          return currentTrack.albumArt;
        }

        return null;
      } catch (error) {
        console.error('Error fetching artist image:', error);
        // Fallback to album art
        const currentTrack = get().currentTrack;
        if (currentTrack?.albumArt) {
          set({ artistImage: currentTrack.albumArt });
          return currentTrack.albumArt;
        }
        return null;
      }
    },
  };
});