import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useStore } from '../store/musicStore';

const analyzeTrackVibe = (track: Track): { mood: string; energy: number; danceability: number } => {
  let mood = 'neutral';
  let energy = 0.5;
  let danceability = 0.5;

  if (!track) return { mood, energy, danceability };

  // Analyze track name and artist for mood keywords
  const text = `${track.name} ${track.primaryArtists}`.toLowerCase();
  
  // Mood keywords and their weights
  const moodKeywords = {
    happy: ['happy', 'joy', 'fun', 'party', 'dance', 'celebration', 'love', 'smile'],
    sad: ['sad', 'lonely', 'pain', 'hurt', 'cry', 'tears', 'heartbreak', 'goodbye'],
    energetic: ['energy', 'power', 'rock', 'jump', 'hype', 'fire', 'wild', 'crazy'],
    calm: ['calm', 'peace', 'relax', 'sleep', 'gentle', 'soft', 'quiet', 'smooth'],
    romantic: ['love', 'romance', 'heart', 'kiss', 'forever', 'beautiful', 'sweet', 'dream']
  };

  // Calculate mood scores
  const moodScores = Object.entries(moodKeywords).map(([mood, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0);
    }, 0);
    return { mood, score };
  });

  // Find dominant mood
  const dominantMood = moodScores.reduce((a, b) => a.score > b.score ? a : b);
  mood = dominantMood.mood;

  // Calculate energy based on mood and title length
  switch (mood) {
    case 'happy':
    case 'energetic':
      energy = 0.7 + Math.random() * 0.3;
      danceability = 0.6 + Math.random() * 0.4;
      break;
    case 'sad':
      energy = 0.2 + Math.random() * 0.3;
      danceability = 0.3 + Math.random() * 0.3;
      break;
    case 'calm':
      energy = 0.1 + Math.random() * 0.3;
      danceability = 0.2 + Math.random() * 0.3;
      break;
    case 'romantic':
      energy = 0.4 + Math.random() * 0.3;
      danceability = 0.5 + Math.random() * 0.3;
      break;
    default:
      energy = 0.4 + Math.random() * 0.4;
      danceability = 0.4 + Math.random() * 0.4;
  }

  // Additional factors
  const titleLength = track.name.length;
  const artistCount = track.primaryArtists.split(',').length;

  // Adjust energy based on title length (longer titles often mean more complex/energetic songs)
  energy += (titleLength > 20 ? 0.1 : 0) + (artistCount > 1 ? 0.1 : 0);
  energy = Math.min(1, Math.max(0, energy));

  // Adjust danceability based on artist count (collaborations are often more danceable)
  danceability += artistCount > 1 ? 0.1 : 0;
  danceability = Math.min(1, Math.max(0, danceability));

  return { mood, energy, danceability };
};

const MoodMatcher: React.FC = () => {
  const { currentTrack } = useStore();
  const [vibe, setVibe] = useState<{ mood: string; energy: number; danceability: number } | null>(null);

  useEffect(() => {
    if (currentTrack) {
      const newVibe = analyzeTrackVibe(currentTrack);
      setVibe(newVibe);
    }
  }, [currentTrack]);

  if (!currentTrack || !vibe) return null;

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Track Vibe Analysis</h3>
      <div className="space-y-4">
        <div>
          <p className="text-white/60 mb-1">Mood</p>
          <p className="font-medium capitalize">{vibe.mood}</p>
        </div>
        <div>
          <p className="text-white/60 mb-1">Energy</p>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${vibe.energy * 100}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-white/60 mb-1">Danceability</p>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${vibe.danceability * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodMatcher;