import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const TopResult: React.FC<{ track: Track }> = ({ track }) => {
  const { playTrack } = useStore();

  return (
    <div className="relative group rounded-lg bg-white/5 p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-4">
        {/* Album Art */}
        <img 
          src={track.albumArt} 
          alt={track.name}
          className="w-24 h-24 rounded object-cover"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* Track Info */}
        <div className="flex-1 min-w-0 pr-12">
          <h3 className="text-xl font-bold truncate">{track.name}</h3>
          <p className="text-white/60 truncate">{track.primaryArtists}</p>
        </div>

        {/* Play Button - Absolute positioned */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playTrack(track)}
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-400 transition-colors"
        >
          <Play size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default TopResult; 