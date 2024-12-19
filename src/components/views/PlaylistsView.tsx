import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Music } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import type { Playlist } from '../../types';

const PlaylistsView: React.FC = () => {
  const { playlists, setCurrentPlaylist } = useStore();
  const navigate = useNavigate();

  const handlePlaylistClick = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    navigate(`/playlist/${playlist.id}`);
  };

  const handleCreatePlaylist = () => {
    navigate('/search');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* User Created Playlists */}
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 p-4 rounded-xl cursor-pointer group"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-4">
              {playlist.tracks.length > 0 ? (
                <div 
                  className={`w-full h-full grid ${
                    playlist.tracks.length === 1 ? 'grid-cols-1' : 
                    playlist.tracks.length === 2 ? 'grid-cols-2' :
                    playlist.tracks.length === 3 ? 'grid-cols-2 grid-rows-2' :
                    'grid-cols-2 grid-rows-2'
                  } gap-0.5 bg-black/20`}
                >
                  {playlist.tracks.slice(-4).map((track, index, array) => (
                    <div 
                      key={`${track.id}-${index}`}
                      className={`relative overflow-hidden ${
                        array.length === 3 && index === array.length - 1 
                          ? 'col-span-2' 
                          : ''
                      }`}
                    >
                      <img
                        src={track.albumArt}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={40} className="text-white/20" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{playlist.name}</h3>
              <p className="text-sm text-white/60">{playlist.tracks.length} songs</p>
            </div>
          </motion.div>
        ))}

        {/* Create Playlist Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreatePlaylist}
          className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center aspect-square text-white/60 hover:text-white/80 transition-colors"
        >
          <Plus size={40} className="mb-2" />
          <span className="font-medium">Create Playlist</span>
        </motion.button>
      </div>

      {/* Empty State */}
      {playlists.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">No playlists yet</p>
          <p className="text-white/40 text-sm">
            Search for songs to create your first playlist
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaylistsView; 