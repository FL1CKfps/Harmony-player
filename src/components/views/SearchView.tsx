import React, { useState } from 'react';
import { Search, Play, Plus, ListPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/musicStore';
import AddToPlaylistModal from '../modals/AddToPlaylistModal';
import { toast } from 'react-hot-toast';

const SearchView: React.FC = () => {
  const { tracks, playTrack, addToQueue, addToPlaylist, playlists } = useStore();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const handleAddToQueue = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    toast.success('Added to queue');
  };

  const handleAddToPlaylist = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTrack(track);
    setShowPlaylistModal(true);
  };

  const topResult = tracks[0];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {tracks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Result Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Top result</h2>
                {topResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative p-5 rounded-xl bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer"
                    onClick={() => playTrack(topResult)}
                  >
                    <div className="flex flex-col h-[250px]">
                      <img
                        src={topResult.albumArt}
                        alt={topResult.name}
                        className="w-24 h-24 rounded-lg shadow-lg mb-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-[2rem] font-bold mb-2">{topResult.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white/60">{topResult.primaryArtists}</p>
                          <span className="text-white/60">•</span>
                          <p className="text-sm text-white/60">Song</p>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-5 left-0 right-0 px-5 flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(topResult);
                          }}
                        >
                          <Play size={24} fill="currentColor" />
                        </motion.button>

                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToQueue(topResult, e)}
                            className="p-2 text-white/60 hover:text-white transition-colors"
                          >
                            <Plus size={24} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToPlaylist(topResult, e)}
                            className="p-2 text-white/60 hover:text-white transition-colors"
                          >
                            <ListPlus size={24} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Songs Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition-all duration-300 cursor-pointer"
                      onClick={() => playTrack(track)}
                    >
                      <img
                        src={track.albumArt}
                        alt={track.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{track.name}</h3>
                        <p className="text-sm text-white/60 truncate">{track.primaryArtists}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToQueue(track, e)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                        >
                          <Plus size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToPlaylist(track, e)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                        >
                          <ListPlus size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto mb-4 text-white/20" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-white/60">
              Try searching for songs, artists, or albums
            </p>
          </div>
        )}
      </div>

      {showPlaylistModal && selectedTrack && (
        <AddToPlaylistModal
          track={selectedTrack}
          onClose={() => setShowPlaylistModal(false)}
          playlists={playlists}
          onAddToPlaylist={(playlistId) => {
            addToPlaylist(playlistId, selectedTrack);
            setShowPlaylistModal(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchView;