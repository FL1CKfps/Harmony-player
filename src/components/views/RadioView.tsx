import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Heart } from 'lucide-react';
import { useStore } from '../../store/musicStore';

const stations = [
  { id: 'lofi', name: 'Lofi Beats', genre: 'Lofi', cover: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=800', stream: 'https://stream.0x7.me/lofi' },
  { id: 'jazz', name: 'Jazz Cafe', genre: 'Jazz', cover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', stream: 'https://stream.0x7.me/jazz' },
  { id: 'classical', name: 'Classical Symphony', genre: 'Classical', cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800', stream: 'https://stream.0x7.me/classical' },
  { id: 'ambient', name: 'Ambient Waves', genre: 'Ambient', cover: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800', stream: 'https://stream.0x7.me/ambient' }
];

const RadioView: React.FC = () => {
  const { setCurrentTrack } = useStore();
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-3">
        <Radio className="text-purple-500" size={24} />
        <h2 className="text-2xl font-bold">Live Radio</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stations.map((station) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl glass"
          >
            <div className="aspect-square">
              <img
                src={station.cover}
                alt={station.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-lg font-bold">{station.name}</h3>
              <p className="text-sm text-white/60">{station.genre}</p>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(station.id)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-lg text-white shadow-lg"
              >
                <Heart
                  size={20}
                  fill={favorites.includes(station.id) ? 'currentColor' : 'none'}
                />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setActiveStation(station.id);
                setCurrentTrack({
                  id: station.id,
                  name: station.name,
                  artist: station.genre,
                  duration: 0,
                  albumArt: station.cover,
                  audioUrl: station.stream,
                  genre: station.genre
                });
              }}
              className={`absolute bottom-24 right-4 p-3 rounded-full ${
                activeStation === station.id ? 'bg-green-500' : 'bg-purple-500'
              } text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <Play size={24} fill="white" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RadioView;