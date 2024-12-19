import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/musicStore';

const Queue: React.FC = () => {
  const { queue, removeFromQueue } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        Up Next
      </h2>
      <div className="space-y-4">
        {queue.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass p-4 rounded-xl group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={track.albumArt}
                  alt={track.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold group-hover:text-purple-500 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-gray-400">{track.artist}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromQueue(track.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                Remove
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Queue;