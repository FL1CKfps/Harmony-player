import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/musicStore';
import { useNavigate } from 'react-router-dom';

interface GenreCard {
  id: string;
  name: string;
  color: string;
  type: 'language' | 'genre';
  image: string;
}

const genres: GenreCard[] = [
  {
    id: 'hindi',
    name: 'Hindi',
    color: 'from-rose-500 to-pink-500',
    type: 'language',
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop'
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    color: 'from-amber-500 to-yellow-500',
    type: 'language',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop'
  },
  {
    id: 'hip-hop',
    name: 'Hip Hop',
    color: 'from-purple-500 to-indigo-500',
    type: 'genre',
    image: 'https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=800&auto=format&fit=crop'
  },
  {
    id: 'pop',
    name: 'Pop',
    color: 'from-blue-500 to-cyan-500',
    type: 'genre',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop'
  },
  {
    id: 'rock',
    name: 'Rock',
    color: 'from-red-500 to-orange-500',
    type: 'genre',
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop'
  },
  {
    id: 'electronic',
    name: 'Electronic',
    color: 'from-green-500 to-emerald-500',
    type: 'genre',
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=800&auto=format&fit=crop'
  }
];

const GenreSection: React.FC = () => {
  const { searchTracks } = useStore();
  const navigate = useNavigate();

  const handleGenreClick = async (genre: GenreCard) => {
    try {
      await searchTracks(genre.name);
      navigate('/search');
    } catch (error) {
      console.error('Error searching genre:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse by Genre</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {genres.map((genre, index) => (
          <motion.button
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleGenreClick(genre)}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={genre.image}
              alt={genre.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-75`} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-wider text-white/80">
                {genre.type}
              </span>
              <h3 className="text-lg font-bold text-white">{genre.name}</h3>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;