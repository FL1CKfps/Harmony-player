import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/musicStore';

interface RecentlyPlayedProps {
  onSeeAll: () => void;
  searchQuery: string;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ onSeeAll, searchQuery }) => {
  const { recentlyPlayed, playTrack } = useStore();

  // Get the last 3 recently played tracks
  const recentTracks = recentlyPlayed.slice(0, 3);

  if (recentTracks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-purple-500" />
          <h3 className="text-sm font-semibold text-white/80">Recently Played</h3>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={onSeeAll}
          className="text-xs text-white/60 hover:text-white flex items-center space-x-1"
        >
          <span>See All</span>
          <ChevronRight size={14} />
        </motion.button>
      </div>

      <div className="space-y-2">
        {recentTracks.map((track) => (
          <motion.button
            key={track.id}
            whileHover={{ x: 4 }}
            onClick={() => playTrack(track)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <img
              src={track.albumArt}
              alt={track.name}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div className="flex-1 text-left truncate">
              <h4 className="text-sm font-medium truncate">{track.name}</h4>
              <p className="text-xs text-white/60 truncate">{track.artist}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;