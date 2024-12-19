import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, Clock, ListMusic, ArrowLeft, Pencil, Check, X, Plus, ListPlus } from 'lucide-react';
import { useStore } from '../../store/musicStore';
import { useNavigate, useParams } from 'react-router-dom';
import PlaylistSelector from '../modals/PlaylistSelector';

const SinglePlaylistView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    playlists, 
    setCurrentPlaylist, 
    playTrack, 
    shufflePlaylist,
    updatePlaylistName,
    addToQueue 
  } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showPlaylistSelector, setShowPlaylistSelector] = useState<Track | null>(null);

  const playlist = playlists.find(p => p.id === id);

  useEffect(() => {
    if (!id || !playlist) {
      navigate('/playlists');
      return;
    }
    setCurrentPlaylist(playlist);
  }, [id, playlist, setCurrentPlaylist, navigate]);

  const handleBack = () => {
    navigate('/playlists');
  };

  if (!playlist) return null;

  const totalDuration = playlist.tracks.reduce((acc, track) => acc + track.duration, 0);
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes % 60} min`;
    }
    return `${minutes} min`;
  };

  const handleEditClick = () => {
    setEditedName(playlist.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedName.trim()) {
      updatePlaylistName(id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(playlist.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <motion.button
        whileHover={{ x: -4 }}
        onClick={handleBack}
        className="flex items-center space-x-2 text-white/60 hover:text-white"
      >
        <ArrowLeft size={20} />
        <span>Back to Playlists</span>
      </motion.button>

      {playlist ? (
        <>
          <div className="flex items-start space-x-6">
            <div className="w-48 h-48 rounded-xl overflow-hidden glass">
              {playlist.tracks.length > 0 ? (
                <div 
                  className={`w-full h-full grid ${
                    playlist.tracks.length === 1 ? 'grid-cols-1' : 
                    playlist.tracks.length === 2 ? 'grid-cols-2' :
                    playlist.tracks.length === 3 ? 'grid-cols-2 grid-rows-2' :
                    'grid-cols-2 grid-rows-2'
                  } gap-0.5 bg-black/20`}
                >
                  {playlist.tracks.slice(-4).map((track, index, array) => (
                    <div 
                      key={`${track.id}-${index}`} 
                      className={`relative overflow-hidden ${
                        array.length === 3 && index === array.length - 1 
                          ? 'col-span-2' 
                          : ''
                      }`}
                    >
                      <img
                        src={track.albumArt}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <ListMusic size={40} className="text-white/30" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b border-white/20 focus:border-white/60 outline-none"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="p-2 rounded-full hover:bg-white/10"
                    >
                      <Check size={20} className="text-green-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="p-2 rounded-full hover:bg-white/10"
                    >
                      <X size={20} className="text-white/60" />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{playlist.name}</h1>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditClick}
                      className="p-2 rounded-full hover:bg-white/10"
                    >
                      <Pencil size={16} className="text-white/60" />
                    </motion.button>
                  </>
                )}
              </div>
              <p className="text-white/60">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'} •{' '}
                {formatDuration(totalDuration)}
              </p>
              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playTrack(playlist.tracks[0])}
                  className="p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors"
                >
                  <Play size={24} fill="white" />
                </motion.button>
                
                {playlist.tracks.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shufflePlaylist(playlist.tracks)}
                    className="p-4 rounded-full glass hover:bg-white/10 transition-colors"
                  >
                    <Shuffle size={24} className="text-white/60" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {playlist.tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5"
              >
                <span className="w-6 text-center text-white/40 group-hover:text-white/60">
                  {index + 1}
                </span>
                <img
                  src={track.albumArt}
                  alt={track.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.name}</h3>
                  <p className="text-sm text-white/60 truncate">{track.artist}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock size={16} className="text-white/40" />
                  <span className="text-white/40">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlaylistSelector(track);
                      }}
                      className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100"
                    >
                      <ListPlus size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => playTrack(track)}
                      className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100"
                    >
                      <Play size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Playlist Not Found</h2>
          <p className="text-white/60">The playlist you're looking for doesn't exist.</p>
        </div>
      )}

      {showPlaylistSelector && (
        <PlaylistSelector
          isOpen={true}
          onClose={() => setShowPlaylistSelector(null)}
          track={showPlaylistSelector}
        />
      )}
    </motion.div>
  );
};

export default SinglePlaylistView; 