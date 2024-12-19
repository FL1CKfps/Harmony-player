import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play } from 'lucide-react';
import { useStore } from '../../store/musicStore';

const GlobalTrending: React.FC = () => {
  const { globalTrending, fetchGlobalTrending, playTrack } = useStore();

  useEffect(() => {
    fetchGlobalTrending();
  }, [fetchGlobalTrending]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp size={20} className="text-purple-500" />
          <h2 className="font-semibold">Global Trending</h2>
        </div>
      </div>

      <div className="space-y-2">
        {globalTrending.slice(0, 5).map((track, index) => (
          <motion.div
            key={`global-trending-${track.id}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group cursor-pointer"
            onClick={() => playTrack(track)}
          >
            <span className="w-5 text-sm text-white/40">{index + 1}</span>
            <img
              src={track.albumArt}
              alt={track.name}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate text-sm">{track.name}</h3>
              <p className="text-xs text-white/60 truncate">{track.primaryArtists}</p>
            </div>
            <Play 
              size={16} 
              className="opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalTrending; 