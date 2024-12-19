import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Shuffle } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import SongTile from '../common/SongTile';

const LikedSongsView: React.FC = () => {
  const { likedSongs, playLikedSongs } = useStore();

  if (!likedSongs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Heart size={48} className="text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
        <p className="text-white/60">Save songs by tapping the heart icon</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-60 h-60 bg-gradient-to-br from-purple-500 to-purple-900 rounded-lg flex items-center justify-center">
          <Heart size={64} className="text-white" />
        </div>

        <div className="flex-1">
          <h1 className="text-7xl font-bold mb-6">Liked Songs</h1>
          <div className="flex items-center gap-2 text-white/60 mb-6">
            <Heart size={20} className="text-purple-400" />
            <span>{likedSongs.length} songs</span>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playLikedSongs()}
              className="px-8 py-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Play size={20} fill="white" />
              <span>Play All</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playLikedSongs(true)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Shuffle size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-1">
        {likedSongs.map((track, index) => (
          <SongTile
            key={track.id}
            track={track}
            showIndex={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default LikedSongsView; 