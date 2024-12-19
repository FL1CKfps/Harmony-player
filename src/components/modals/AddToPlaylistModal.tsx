import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Music } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import { toast } from 'react-hot-toast';

interface AddToPlaylistModalProps {
  track: Track;
  onClose: () => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string) => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  track,
  onClose,
  playlists,
  onAddToPlaylist,
}) => {
  const { createPlaylist, getPlaylists } = useStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    const playlist = createPlaylist(newPlaylistName);
    onAddToPlaylist(playlist.id);
    setIsCreating(false);
    setNewPlaylistName('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#282828] rounded-xl p-6 w-full max-w-md m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Add to Playlist</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {isCreating ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  autoFocus
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Plus size={24} className="text-purple-400" />
                </div>
                <span className="font-medium">Create New Playlist</span>
              </motion.button>
            )}

            {playlists.map((playlist) => (
              <motion.button
                key={playlist.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToPlaylist(playlist.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  {playlist.coverArt ? (
                    <img
                      src={playlist.coverArt}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <Music size={24} className="text-white/40" />
                    </div>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-medium truncate">{playlist.name}</h3>
                  <p className="text-sm text-white/60 truncate">
                    {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
              </motion.button>
            ))}

            <button
              onClick={() => console.log('Current playlists:', getPlaylists())}
              className="px-4 py-2 text-sm text-white/60"
            >
              Debug Playlists
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddToPlaylistModal; 