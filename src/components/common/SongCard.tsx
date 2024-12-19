import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ListPlus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import type { Track } from '../../types';
import PlaylistSelector from './PlaylistSelector';

interface SongCardProps {
  track: Track;
  index?: number;
}

const SongCard: React.FC<SongCardProps> = ({ track, index }) => {
  const { playTrack, addToQueue, addToPlaylist } = useStore();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlaylistSelector(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index ? index * 0.1 : 0 
      }}
      className="group relative bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 overflow-hidden"
    >
      <div className="p-4">
        <div className="relative aspect-square mb-4">
          <img
            src={track.albumArt}
            alt={track.name}
            className="w-full h-full object-cover rounded-lg"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = 'https://placehold.co/400x400?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToQueue}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              <Plus size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToPlaylist}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              <ListPlus size={20} />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-2 left-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            onClick={() => playTrack(track)}
          >
            <Play size={20} fill="white" />
          </motion.button>
        </div>
        <div>
          <h3 className="font-semibold truncate mb-1">{track.name}</h3>
          <p className="text-sm text-white/60 truncate">{track.primaryArtists}</p>
        </div>
        {typeof index === 'number' && (
          <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-full text-xs">
            #{index + 1}
          </div>
        )}
        {showPlaylistSelector && (
          <PlaylistSelector
            isOpen={showPlaylistSelector}
            onClose={() => setShowPlaylistSelector(false)}
            track={track}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SongCard; 