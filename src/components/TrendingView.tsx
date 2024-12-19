import React from 'react';
import { useStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Play, TrendingUp } from 'lucide-react';
import type { Track } from '../types';

const TrendingTrack: React.FC<{ track: Track; index: number }> = ({ track, index }) => {
  const { playTrack } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex items-center gap-4 p-2 rounded-lg hover:bg-white/5"
    >
      {/* Index */}
      <div className="w-8 text-center text-white/40 font-medium">
        {(index + 1).toString().padStart(2, '0')}
      </div>

      {/* Album Art */}
      <div className="relative w-12 h-12">
        <img 
          src={track.albumArt} 
          alt={track.name}
          className="w-full h-full rounded object-cover"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playTrack(track)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={20} className="text-white" />
        </motion.button>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{track.name}</div>
        <div className="text-sm text-white/60 truncate">{track.primaryArtists}</div>
      </div>
    </motion.div>
  );
};

const TrendingView: React.FC = () => {
  const { globalTrending, fetchGlobalTrending } = useStore();

  React.useEffect(() => {
    fetchGlobalTrending();
  }, [fetchGlobalTrending]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-purple-400" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="grid gap-2">
        {globalTrending.map((track, index) => (
          <TrendingTrack key={track.id} track={track} index={index} />
        ))}
      </div>

      {globalTrending.length === 0 && (
        <div className="text-center text-white/40 mt-8">
          No trending tracks available
        </div>
      )}
    </div>
  );
};

export default TrendingView; 