import React, { useState, useEffect } from 'react';
import { useStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import GenreCard from './shared/GenreCard';

const genres = [
  { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
  { id: 'rock', name: 'Rock', color: 'bg-red-500' },
  { id: 'hiphop', name: 'Hip Hop', color: 'bg-purple-500' },
  { id: 'electronic', name: 'Electronic', color: 'bg-blue-500' },
  { id: 'jazz', name: 'Jazz', color: 'bg-yellow-500' },
  { id: 'classical', name: 'Classical', color: 'bg-green-500' },
  { id: 'rnb', name: 'R&B', color: 'bg-indigo-500' },
  { id: 'folk', name: 'Folk', color: 'bg-orange-500' }
];

const languages = [
  { id: 'english', name: 'English', color: 'bg-blue-600' },
  { id: 'hindi', name: 'Hindi', color: 'bg-orange-600' },
  { id: 'punjabi', name: 'Punjabi', color: 'bg-green-600' },
  { id: 'tamil', name: 'Tamil', color: 'bg-red-600' },
  { id: 'telugu', name: 'Telugu', color: 'bg-purple-600' },
  { id: 'malayalam', name: 'Malayalam', color: 'bg-yellow-600' },
  { id: 'kannada', name: 'Kannada', color: 'bg-pink-600' },
  { id: 'bengali', name: 'Bengali', color: 'bg-indigo-600' }
];

const SearchView: React.FC = () => {
  const { searchTracks, tracks, isLoading } = useStore();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query) {
      const delayDebounceFn = setTimeout(() => {
        searchTracks(query);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowResults(false);
    }
  }, [query, searchTracks]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {!showResults && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <GenreCard
                    key={genre.id}
                    title={genre.name}
                    color={genre.color}
                    onClick={() => {
                      setQuery(genre.name);
                      searchTracks(genre.name);
                      setShowResults(true);
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Browse by Language</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <GenreCard
                    key={lang.id}
                    title={lang.name}
                    color={lang.color}
                    onClick={() => {
                      setQuery(lang.name);
                      searchTracks(lang.name);
                      setShowResults(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {showResults && (
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <img
                      src={track.albumArt}
                      alt={track.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-medium truncate">{track.name}</h3>
                    <p className="text-sm text-white/60 truncate">
                      {track.primaryArtists}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
