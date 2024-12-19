import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ListPlus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import SongTile from '../common/SongTile';
import { toast } from 'react-hot-toast';
import PlaylistSelector from '../common/PlaylistSelector';
import GenreSection from '../sections/GenreSection';

const SearchResults: React.FC = () => {
  const { tracks, playTrack, addToQueue } = useStore();
  const [showPlaylistSelector, setShowPlaylistSelector] = React.useState<Track | null>(null);

  const handleAddToQueue = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    toast.success('Added to queue');
  };

  if (!tracks.length) {
    return (
      <div className="p-6 space-y-8">
        <GenreSection />
      </div>
    );
  }

  const topResult = tracks[0];

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Result Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top result</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => playTrack(topResult)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="relative z-10 flex flex-col h-[250px]">
              <div className="relative">
                <img
                  src={topResult.albumArt}
                  alt={topResult.name}
                  className="w-24 h-24 rounded-lg shadow-lg mb-4"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

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
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
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
                    onClick={(e) => setShowPlaylistSelector(topResult)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ListPlus size={24} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Songs Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <SongTile 
                key={track.id} 
                track={track} 
                showIndex={index + 1}
                onAddToPlaylist={() => setShowPlaylistSelector(track)}
              />
            ))}
          </div>
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

export default SearchResults; 