import React from 'react';
import { useStore } from '../store/musicStore';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FullscreenQueueViewProps {
  onClose: () => void;
}

const FullscreenQueueView: React.FC<FullscreenQueueViewProps> = ({ onClose }) => {
  const { currentTrack, priorityQueue } = useStore();

  // Get first two tracks from priority queue
  const nextTracks = priorityQueue.slice(0, 2);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h3 className="text-lg font-semibold">Queue</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 border-b border-white/10">
          <div className="text-sm text-white/60 mb-2">Now Playing</div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.name}
              className="w-12 h-12 rounded object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentTrack.name}</div>
              <div className="text-sm text-white/60 truncate">{currentTrack.primaryArtists}</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Next Up - Show up to two tracks */}
      {nextTracks.length > 0 && (
        <div className="p-4">
          <div className="text-sm text-white/60 mb-2">Next Up</div>
          <div className="space-y-3">
            {nextTracks.map((track, index) => (
              <motion.div 
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <img 
                  src={track.albumArt} 
                  alt={track.name}
                  className="w-12 h-12 rounded object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.name}</div>
                  <div className="text-sm text-white/60 truncate">{track.primaryArtists}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenQueueView; 