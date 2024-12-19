import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ListPlus, Plus, X, Heart } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import { toast } from 'react-hot-toast';
import PlaylistSelector from '../modals/PlaylistSelector';

interface SongTileProps {
  track: Track;
  showIndex?: number;
  onAddToPlaylist?: () => void;
}

const SongTile: React.FC<SongTileProps> = ({ 
  track, 
  showIndex,
  onAddToPlaylist 
}) => {
  const { 
    currentTrack, 
    priorityQueue, 
    queue, 
    playTrack, 
    isLiked, 
    toggleLikeSong,
    addToPriorityQueue
  } = useStore();

  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [imgError, setImgError] = useState(false);
  const liked = isLiked(track.id);

  const isInQueue = currentTrack?.id === track.id || 
                   priorityQueue.some(t => t.id === track.id) || 
                   queue.some(t => t.id === track.id);

  const fallbackImage = 'https://placehold.co/400x400?text=No+Image';

  const handleClick = () => {
    playTrack(track);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToPriorityQueue(track);
    toast.success('Added to queue');
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlaylistSelector(true);
  };

  return (
    <motion.div 
      className="group flex items-center space-x-4 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {showIndex && (
          <span className="w-5 text-sm text-white/40 text-center">{showIndex}</span>
        )}
        <div className="relative flex-shrink-0">
          <img
            src={imgError ? fallbackImage : track.albumArt}
            alt={track.name}
            className="w-12 h-12 rounded-lg"
            onError={() => setImgError(true)}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-all"
          >
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Play size={16} className="text-white" />
            </div>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{track.name}</h4>
        <p className="text-sm text-white/60 truncate">{track.primaryArtists}</p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist?.();
          }}
          className="w-8 h-8 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 flex items-center justify-center"
        >
          <ListPlus size={16} />
        </motion.button>

        {!isInQueue && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToQueue(e);
            }}
            className="w-8 h-8 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 flex items-center justify-center"
          >
            <Plus size={16} />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeSong(track);
          }}
          className={`w-8 h-8 rounded-lg ${
            liked 
              ? 'bg-purple-500 text-white' 
              : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300'
          } flex items-center justify-center transition-colors`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      <PlaylistSelector 
        isOpen={showPlaylistSelector}
        onClose={() => setShowPlaylistSelector(false)}
        track={track}
      />
    </motion.div>
  );
};

export default SongTile; 