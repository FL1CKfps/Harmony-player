import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ListMusic, ChevronDown } from 'lucide-react';
import { useStore } from '../store/musicStore';
import Logo from './icons/Logo';
import FullscreenQueueView from './FullscreenQueueView';
import ProgressBar from './shared/ProgressBar';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onQueueOpen: () => void;
}

const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({ isOpen, onClose, onQueueOpen }) => {
  const { 
    currentTrack, 
    playbackState, 
    togglePlay, 
    playNext, 
    playPrevious,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    repeatMode,
    artistImage,
    pauseTrack,
    resumeTrack
  } = useStore();

  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Animation variants for inactive state
  const inactiveVariants = {
    active: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    inactive: {
      scale: 0.95,
      y: 20,
      opacity: 0.8,
      transition: { duration: 0.3 }
    }
  };

  // Mouse move handler to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && currentTrack) {
      setBackgroundImage(artistImage || currentTrack.albumArt);
      setIsImageLoading(false);
    }
  }, [isOpen, currentTrack, artistImage]);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 backdrop-blur-lg"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background-image 0.5s ease-in-out',
          }}
          onMouseMove={handleMouseMove}
        >
          {/* Artist Background */}
          {artistImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 z-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url("${artistImage}")`,
                  filter: 'blur(30px)',
                }}
              >
                <img 
                  src={artistImage}
                  alt=""
                  className="opacity-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = currentTrack.albumArt;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

          {/* Main Content */}
          <div className="relative h-full flex">
            {/* Player Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Logo size={24} className="text-white/80" />
                  <span className="text-xs font-medium tracking-widest text-white/60">
                    PLAYING IN HARMONY
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Player Controls */}
              <div className="flex-1 flex items-end p-8">
                <div className="flex items-end space-x-8 max-w-7xl w-full">
                  {/* Album Art and Controls */}
                  <div className="flex items-end space-x-8 flex-1">
                    {/* Album Art */}
                    <motion.div
                      variants={inactiveVariants}
                      animate={showControls ? 'active' : 'inactive'}
                      className="flex-shrink-0"
                    >
                      <img
                        src={currentTrack.albumArt}
                        alt={currentTrack.name}
                        className="w-80 h-80 rounded-lg shadow-2xl"
                      />
                    </motion.div>

                    {/* Controls and Info */}
                    <div className="flex-1 space-y-6">
                      <motion.h1 
                        className="text-4xl font-bold"
                        animate={{ 
                          scale: showControls ? 1 : 0.95,
                          opacity: showControls ? 1 : 0.8 
                        }}
                      >
                        {currentTrack.name}
                      </motion.h1>

                      {/* Progress Bar */}
                      <div className="w-full space-y-2">
                        <ProgressBar size="lg" />
                      </div>

                      {/* Controls */}
                      <motion.div 
                        className="flex items-center space-x-8"
                        animate={{ opacity: showControls ? 1 : 0 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleShuffle}
                          className={`p-2 ${isShuffled ? 'text-purple-500' : 'text-white/60'} hover:text-white`}
                        >
                          <Shuffle size={20} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={playPrevious}
                          className="p-2 text-white/60 hover:text-white"
                        >
                          <SkipBack size={28} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (playbackState.isPlaying) {
                              pauseTrack();
                            } else {
                              resumeTrack();
                            }
                          }}
                          className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-400 transition-colors"
                        >
                          {playbackState.isPlaying ? (
                            <Pause size={28} fill="white" />
                          ) : (
                            <Play size={28} fill="white" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={playNext}
                          className="p-2 text-white/60 hover:text-white"
                        >
                          <SkipForward size={28} />
                        </motion.button>

                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleRepeat}
                            className={`p-2 ${repeatMode !== 'OFF' ? 'text-purple-500' : 'text-white/60'} hover:text-white`}
                          >
                            <Repeat size={20} />
                            {repeatMode === 'ONE' && (
                              <span className="absolute -top-1 -right-1 text-[10px] font-bold">
                                1
                              </span>
                            )}
                          </motion.button>
                        </div>

                        {/* Queue Toggle Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsQueueVisible(prev => !prev)}
                          className={`p-2 ${isQueueVisible ? 'text-purple-500' : 'text-white/60'} hover:text-white`}
                        >
                          <ListMusic size={20} />
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Queue Panel */}
                  <AnimatePresence mode="wait">
                    {isQueueVisible && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="h-full bg-black/40 backdrop-blur-xl border-l border-white/10"
                      >
                        <div className="h-full w-[300px] overflow-hidden">
                          <FullscreenQueueView onClose={() => setIsQueueVisible(false)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenPlayer;