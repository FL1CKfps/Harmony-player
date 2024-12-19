export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  albumArt: string;
  audioUrl: string;
  album?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface MusicStore {
  // State
  tracks: Track[];
  currentTrack: Track | null;
  playbackState: PlaybackState;
  queue: Track[];
  recentlyPlayed: Track[];
  isLoading: boolean;
  error: string | null;
  searchResults: Track[];
  currentView: 'home' | 'search' | 'library' | 'playlist' | 'album';

  // Actions
  setTracks: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  setCurrentView: (view: MusicStore['currentView']) => void;
  
  // API Actions
  searchTracks: (query: string) => Promise<void>;
  fetchTrending: () => Promise<void>;
}