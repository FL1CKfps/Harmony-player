import React from 'react';
import { motion } from 'framer-motion';
import { X, Music, Plus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import type { Track } from '../../types';

interface PlaylistSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ isOpen, onClose, track }) => {
  const { playlists, addToPlaylist, createPlaylist } = useStore();
  const [isCreating, setIsCreating] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist = createPlaylist(newPlaylistName);
    addToPlaylist(newPlaylist.id, track);
    setNewPlaylistName('');
    setIsCreating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col relative"
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

        <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isCreating ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="playlist-name"
                name="playlist-name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="flex-1 bg-white/5 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                autoComplete="off"
              />
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-3 bg-purple-500 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                Create
              </button>
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
              onClick={() => {
                addToPlaylist(playlist.id, track);
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                {playlist.tracks.length > 0 ? (
                  <div className="w-full h-full grid grid-cols-2 gap-[1px]">
                    {Array.from({ length: 4 }).map((_, i) => {
                      const track = playlist.tracks[i];
                      return (
                        <div key={i} className="bg-white/5">
                          {track ? (
                            <img
                              src={track.albumArt}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                              <Music size={16} className="text-white/20" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
        </div>
      </motion.div>
    </div>
  );
};

export default PlaylistSelector; 