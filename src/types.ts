export interface Track {
  id: string;
  name: string;
  primaryArtists: string;
  duration: number;
  albumArt: string;
  audioUrl: string;
  album: string;
  artistImage?: string | null;
  language?: string;
}

// Add other types as needed 