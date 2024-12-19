import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, Plus, ListPlus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import { toast } from 'react-hot-toast';
import PlaylistSelector from '../modals/PlaylistSelector';

const PlaylistView: React.FC = () => {
  const { currentPlaylist, playTrack, shufflePlaylist, addToQueue, addToPlaylist } = useStore();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState<Track | null>(null);

  if (!currentPlaylist) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Playlist Selected</h2>
        <p className="text-white/60">Select a playlist from your library to view its contents</p>
      </div>
    );
  }

  const handleAddToQueue = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    toast.success('Added to queue');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Playlist Header */}
        <div className="flex items-end space-x-6 mb-8">
          <img 
            src={currentPlaylist.coverArt} 
            alt={currentPlaylist.name}
            className="w-60 h-60 shadow-2xl rounded-lg"
          />
          <div>
            <h1 className="text-5xl font-bold mb-6">{currentPlaylist.name}</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playTrack(currentPlaylist.tracks[0])}
                className="p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors"
              >
                <Play size={24} fill="white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shufflePlaylist(currentPlaylist.tracks)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Shuffle size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {currentPlaylist.tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <span className="w-6 text-center text-white/60 group-hover:hidden">
                {index + 1}
              </span>
              <Play 
                size={16} 
                className="w-6 text-white hidden group-hover:block" 
                fill="white"
              />
              <img
                src={track.albumArt}
                alt={track.name}
                className="w-12 h-12 rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{track.name}</h3>
                <p className="text-sm text-white/60 truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleAddToQueue(track, e)}
                  className="p-2 text-white/60 hover:text-purple-400 transition-colors"
                >
                  <Plus size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlaylistSelector(track);
                  }}
                  className="p-2 text-white/60 hover:text-purple-400 transition-colors"
                >
                  <ListPlus size={20} />
                </motion.button>
              </div>
              <span className="text-sm text-white/40 w-12 text-right">
                {new Date(track.duration * 1000).toISOString().substr(14, 5)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {showPlaylistSelector && (
        <PlaylistSelector
          isOpen={true}
          onClose={() => setShowPlaylistSelector(null)}
          track={showPlaylistSelector}
        />
      )}
    </div>
  );
};

export default PlaylistView;