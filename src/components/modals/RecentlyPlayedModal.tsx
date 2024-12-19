import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar } from 'lucide-react';
import { useStore } from '../../store/musicStore';

interface RecentlyPlayedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecentlyPlayedModal: React.FC<RecentlyPlayedModalProps> = ({ isOpen, onClose }) => {
  const { recentlyPlayed, playTrack } = useStore();

  const groupedTracks = recentlyPlayed.reduce((groups, track) => {
    const date = new Date(track.playedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel = '';
    if (date.toDateString() === today.toDateString()) {
      dateLabel = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(track);
    return groups;
  }, {} as Record<string, typeof recentlyPlayed>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-gray-900 rounded-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recently Played</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {Object.entries(groupedTracks).map(([dateLabel, tracks]) => (
                <div key={dateLabel} className="mb-8 last:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      dateLabel === 'Today' ? 'bg-purple-500/20' : 'bg-white/5'
                    }`}>
                      {dateLabel === 'Today' ? (
                        <Clock size={16} className="text-purple-400" />
                      ) : (
                        <Calendar size={16} className="text-white/60" />
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold ${
                      dateLabel === 'Today' 
                        ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
                        : 'text-white/60'
                    }`}>
                      {dateLabel}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {tracks.map((track) => (
                      <motion.button
                        key={`${track.id}-${track.playedAt}`}
                        whileHover={{ x: 4 }}
                        onClick={() => playTrack(track)}
                        className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5"
                      >
                        <img
                          src={track.albumArt}
                          alt={track.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">{track.name}</h4>
                          <p className="text-sm text-white/60">{track.artist}</p>
                        </div>
                        <div className="text-sm text-white/40">
                          {new Date(track.playedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}

              {recentlyPlayed.length === 0 && (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto mb-4 text-white/20" />
                  <h3 className="text-lg font-semibold mb-2">No Recent Tracks</h3>
                  <p className="text-white/60">
                    Start playing some music and it will appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentlyPlayedModal; 