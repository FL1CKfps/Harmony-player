import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import type { Track } from '../../types';
import { createPortal } from 'react-dom';

interface PlaylistSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ isOpen, onClose, track }) => {
  const { playlists, addToPlaylist, createPlaylist } = useStore();

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, track);
    onClose();
  };

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      const newPlaylist = createPlaylist(name);
      handleAddToPlaylist(newPlaylist.id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100]">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#282828] rounded-xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add to Playlist</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {playlists.map(playlist => (
                  <motion.button
                    key={playlist.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-4"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      {playlist.tracks.length > 0 ? (
                        <div className="w-full h-full grid grid-cols-2 gap-px">
                          {playlist.tracks.slice(0, 4).map((track, i) => (
                            <img
                              key={i}
                              src={track.albumArt}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <Plus size={20} className="text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium truncate">{playlist.name}</p>
                      <p className="text-sm text-white/60">
                        {playlist.tracks.length} songs
                      </p>
                    </div>
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                  onClick={handleCreatePlaylist}
                >
                  <Plus size={20} />
                  <span>Create New Playlist</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>,
        document.body
      )}
    </AnimatePresence>
  );
};

export default PlaylistSelector; 