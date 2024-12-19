import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, ListMusic, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/musicStore';
import { formatTime } from '../utils/formatTime';
import Howl from 'howler';
import FullscreenPlayer from './FullscreenPlayer';
import ProgressBar from './shared/ProgressBar';

interface PlayerProps {
  onQueueOpen: () => void;
  isQueueOpen?: boolean;
}

const Player: React.FC<PlayerProps> = ({ onQueueOpen, isQueueOpen }) => {
  const {
    currentTrack,
    playbackState,
    queue,
    pauseTrack,
    resumeTrack,
    setVolume,
    seekTo,
    fetchSuggestions,
    updatePlaybackTime,
    playNext,
    playPrevious,
    shuffleQueue,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle
  } = useStore();

  const progressRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackState.isPlaying) {
      interval = setInterval(() => {
        const { sound } = useStore.getState();
        if (sound) {
          const time = sound.seek();
          updatePlaybackTime(time);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState.isPlaying, updatePlaybackTime]);

  useEffect(() => {
    if (currentTrack && playbackState.isPlaying) {
      fetchSuggestions();
    }
  }, [currentTrack?.id, playbackState.isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * playbackState.duration;
    seekTo(time);
  };

  const togglePlay = () => {
    if (playbackState.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x400?text=No+Image';
  };

  const getRepeatTooltip = () => {
    switch (repeatMode) {
      case 'ONE': return 'Repeat One';
      case 'ALL': return 'Repeat All';
      default: return 'Repeat Off';
    }
  };

  const RepeatIcon = () => {
    switch (repeatMode) {
      case 'ONE':
        return (
          <div className="relative">
            <Repeat size={20} />
            <span className="absolute -bottom-1 -right-1 text-[10px]">1</span>
          </div>
        );
      case 'ALL':
        return <Repeat size={20} />;
      default:
        return <Repeat size={20} />;
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-[300px]">
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              crossOrigin="anonymous"
              onError={handleImageError}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium truncate">{currentTrack.name}</h3>
              <p className="text-sm text-white/60 truncate">{currentTrack.primaryArtists}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-[500px]">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-purple-500 hover:text-purple-400' : 'text-white/60 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playPrevious()}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <SkipBack size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="p-3 rounded-full bg-purple-500 hover:bg-purple-600"
              >
                {playbackState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playNext()}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <SkipForward size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== 'OFF' ? 'text-purple-500 hover:text-purple-400' : 'text-white/60 hover:text-white'
                }`}
                title={getRepeatTooltip()}
              >
                <RepeatIcon />
              </motion.button>
            </div>

            <div className="w-full flex items-center gap-2 text-sm">
              <span className="w-12 text-right">{formatTime(playbackState.currentTime)}</span>
              <ProgressBar size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-4 w-[300px] justify-end">
            <div className="flex items-center gap-2">
              <Volume2 size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={playbackState.volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full hover:bg-white/10"
              title="Fullscreen"
            >
              <Maximize2 size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onQueueOpen}
              className={`p-2 rounded-full hover:bg-white/10 ${
                isQueueOpen ? 'text-purple-500' : ''
              }`}
              title="Queue"
            >
              <ListMusic size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      <FullscreenPlayer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        onQueueOpen={onQueueOpen}
      />
    </>
  );
};

export default Player;