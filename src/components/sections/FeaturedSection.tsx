import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import { useStore } from '../../store/musicStore';

const FeaturedSection: React.FC = () => {
  const { featuredPlaylists, setCurrentTrack } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Featured Playlists</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPlaylists?.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl glass"
          >
            <div className="aspect-square">
              <img
                src={playlist.coverArt}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-lg font-bold">{playlist.name}</h3>
              <p className="text-sm text-white/60">{playlist.description}</p>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-purple-500 text-white shadow-lg"
              >
                <Plus size={20} />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-24 right-4 p-3 rounded-full bg-green-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play size={24} fill="white" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedSection;