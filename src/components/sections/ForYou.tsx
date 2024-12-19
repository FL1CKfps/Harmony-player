import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { useStore } from '../../store/musicStore';

const ForYou: React.FC = () => {
  const { tracks, playTrack } = useStore();
  
  // Get first 6 tracks for recommendations
  const recommendations = tracks.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2">
        <Sparkles className="text-purple-500" size={24} />
        <h2 className="text-2xl font-bold">Made For You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group glass rounded-xl p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <img
                  src={track.albumArt}
                  alt={track.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playTrack(track)}
                  className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-green-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Play size={16} fill="white" />
                </motion.button>
              </div>
              <div>
                <h3 className="font-medium line-clamp-1">{track.name}</h3>
                <p className="text-sm text-white/60 line-clamp-1">{track.artist}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForYou;