import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disc } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const DiscoverView: React.FC = () => {
  const { tracks, setCurrentTrack, fetchTrending, isLoading } = useStore();

  useEffect(() => {
    fetchTrending().catch(error => {
      console.error('Error in DiscoverView:', error);
    });
  }, [fetchTrending]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Trending Songs</h2>
        <p className="text-white/60">Try refreshing the page or check back later</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold">Discover New Music</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="group relative aspect-square overflow-hidden rounded-xl glass cursor-pointer"
            onClick={() => setCurrentTrack(track)}
          >
            <img
              src={track.albumArt}
              alt={track.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <h3 className="font-bold text-lg">{track.name}</h3>
              <p className="text-white/80">{track.artist}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DiscoverView;