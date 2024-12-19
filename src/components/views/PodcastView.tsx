import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Play, Clock, Plus } from 'lucide-react';

const podcasts = [
  {
    id: '1',
    title: 'Tech Talk Weekly',
    host: 'Sarah Johnson',
    cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    description: 'Latest updates in technology and development',
    latestEpisode: 'The Future of AI Development',
    duration: '45:32'
  },
  {
    id: '2',
    title: 'Music Production Insights',
    host: 'David Chen',
    cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    description: 'Behind the scenes of music production',
    latestEpisode: 'Modern Music Production Techniques',
    duration: '52:15'
  },
  {
    id: '3',
    title: 'Creative Corner',
    host: 'Emily Williams',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    description: 'Exploring creativity in various forms',
    latestEpisode: 'Finding Your Creative Voice',
    duration: '38:45'
  }
];

const PodcastView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mic2 className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold">Podcasts</h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-purple-500 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Subscribe to New</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <motion.div
            key={podcast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="relative aspect-video">
              <img
                src={podcast.cover}
                alt={podcast.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-green-500 text-white shadow-lg"
              >
                <Play size={24} fill="white" />
              </motion.button>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold">{podcast.title}</h3>
              <p className="text-sm text-white/60 mb-2">Hosted by {podcast.host}</p>
              <p className="text-sm text-white/80 mb-4">{podcast.description}</p>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-medium mb-2">Latest Episode</h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/60">{podcast.latestEpisode}</p>
                  <div className="flex items-center space-x-2 text-white/40">
                    <Clock size={16} />
                    <span className="text-sm">{podcast.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PodcastView;