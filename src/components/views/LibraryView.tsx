import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Plus, Play, MoreVertical } from 'lucide-react';
import { useStore } from '../../store/musicStore';

const LibraryView: React.FC = () => {
  const { tracks, setCurrentTrack } = useStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'artist' | 'recent'>('recent');

  const sortedTracks = [...tracks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      default:
        return 0;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Library className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold">Your Library</h2>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass px-4 py-2 rounded-lg text-sm"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name</option>
            <option value="artist">Artist</option>
          </select>

          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
          >
            {view === 'grid' ? 'List View' : 'Grid View'}
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-500 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Music</span>
          </motion.button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedTracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={track.albumArt}
                  alt={track.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTrack(track)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-green-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Play size={24} fill="white" />
                </motion.button>
              </div>
              <div className="mt-3">
                <h3 className="font-medium truncate">{track.name}</h3>
                <p className="text-sm text-white/60 truncate">{track.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={track.albumArt}
                  alt={track.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{track.name}</h3>
                  <p className="text-sm text-white/60">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTrack(track)}
                  className="p-2 rounded-full bg-green-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play size={20} fill="white" />
                </motion.button>
                <button className="text-white/60 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LibraryView;