import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import SongCard from '../common/SongCard';
import SongTile from '../common/SongTile';
import GenreSection from '../sections/GenreSection';

const HomeView: React.FC = () => {
  const { 
    globalTrending, 
    showAllTrending, 
    toggleShowAllTrending,
    fetchGlobalTrending,
    recentlyPlayed,
    tracks,
    setRecentlyPlayed,
    searchTracks
  } = useStore();

  useEffect(() => {
    fetchGlobalTrending();
    // Get some initial tracks for suggestions if none exist
    if (tracks.length === 0) {
      searchTracks('trending songs');
    }
  }, []);

  // Get suggested tracks based on recently played artists
  const suggestedTracks = useMemo(() => {
    if (recentlyPlayed.length < 5) return [];

    // Get unique artists and their frequencies from recently played
    const artistFrequency = recentlyPlayed.reduce((acc, track) => {
      if (!track.primaryArtists) return acc;

      const artists = track.primaryArtists
        .split(/[,&]/)
        .map(a => a?.trim()?.toLowerCase())
        .filter(Boolean);

      artists.forEach(artist => {
        if (artist) {
          acc[artist] = (acc[artist] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    // Get all available tracks that aren't in recently played
    const availableTracks = tracks.filter(track => 
      track.primaryArtists && // Add this check
      !recentlyPlayed.some(r => r.id === track.id) && 
      track.audioUrl
    );

    // Score each track based on artist matches
    const scoredTracks = availableTracks.map(track => {
      const trackArtists = track.primaryArtists
        .split(/[,&]/)
        .map(a => a?.trim()?.toLowerCase())
        .filter(Boolean);

      let score = 0;
      trackArtists.forEach(artist => {
        if (artist) {
          Object.entries(artistFrequency).forEach(([recentArtist, frequency]) => {
            if (artist.includes(recentArtist) || recentArtist.includes(artist)) {
              score += frequency;
            }
          });
        }
      });

      return { track, score };
    });

    return scoredTracks
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0)
      .slice(0, 10)
      .map(item => item.track);
  }, [recentlyPlayed, tracks]);

  // Debug logs
  useEffect(() => {
    if (recentlyPlayed.length >= 5) {
      console.log('Recently played count:', recentlyPlayed.length);
      console.log('Available tracks:', tracks.length);
      console.log('Artist frequencies:', getArtistFrequencies(recentlyPlayed));
      console.log('Suggested tracks:', suggestedTracks.map(t => ({
        name: t.name,
        artists: t.primaryArtists,
        score: getArtistScore(t)
      })));
    }
  }, [recentlyPlayed.length, tracks.length, suggestedTracks]);

  // Helper functions
  const getArtistFrequencies = (tracks: Track[]) => {
    return tracks.reduce((acc, track) => {
      if (!track.primaryArtists) return acc;

      const artists = track.primaryArtists
        .split(/[,&]/)
        .map(a => a?.trim()?.toLowerCase())
        .filter(Boolean);

      artists.forEach(artist => {
        if (artist) {
          acc[artist] = (acc[artist] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);
  };

  const getArtistScore = (track: Track) => {
    if (!track.primaryArtists) return 0;
    
    const frequencies = getArtistFrequencies(recentlyPlayed);
    const trackArtists = track.primaryArtists
      .split(/[,&]/)
      .map(a => a?.trim()?.toLowerCase())
      .filter(Boolean);

    let score = 0;
    trackArtists.forEach(artist => {
      if (artist) {
        Object.entries(frequencies).forEach(([recentArtist, frequency]) => {
          if (artist.includes(recentArtist) || recentArtist.includes(artist)) {
            score += frequency;
          }
        });
      }
    });
    return score;
  };

  const displayedTracks = showAllTrending ? globalTrending : globalTrending.slice(0, 5);

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
    localStorage.removeItem('harmony_recently_played');
  };

  const userName = localStorage.getItem('harmony_user_name');
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  return (
    <div className="p-6 space-y-12">
      {/* User Greeting */}
      {userName && (
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, <span className="text-purple-400">{userName}</span>
          </h1>
        </div>
      )}

      {/* Suggested Songs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold">Suggested For You</h2>
          </div>
          {recentlyPlayed.length > 0 && (
            <button
              onClick={clearRecentlyPlayed}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        
        {suggestedTracks.length > 0 ? (
          <div className="space-y-1">
            {suggestedTracks.map((track, index) => (
              <SongTile 
                key={track.id} 
                track={track} 
                showIndex={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-xl">
            <Sparkles size={48} className="text-white/40 mb-4" />
            <p className="text-white/60 text-lg mb-2">No suggestions yet</p>
            <p className="text-white/40 text-sm">
              Start listening to music to get personalized suggestions
            </p>
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleShowAllTrending}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-sm">
              {showAllTrending ? 'Show Less' : 'See More'}
            </span>
            {showAllTrending ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedTracks.map((track, index) => (
            <SongCard 
              key={track.id} 
              track={track} 
              index={index + 1}
            />
          ))}
        </div>
      </section>

      {/* Add Genre Section */}
      <GenreSection />
    </div>
  );
};

export default HomeView; 