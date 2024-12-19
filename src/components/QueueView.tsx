import React, { useState } from 'react';
import { useStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Play, X, Shuffle, Clock } from 'lucide-react';
import SongTile from './common/SongTile';
import PlaylistSelector from './common/PlaylistSelector';

interface QueueViewProps {
  onClose: () => void;
}

const QueueView: React.FC<QueueViewProps> = ({ onClose }) => {
  const { queue, priorityQueue, currentTrack } = useStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h3 className="text-lg font-semibold">Queue</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 border-b border-white/10">
          <div className="text-sm text-white/60 mb-2">Now Playing</div>
          <div className="flex items-center gap-3">
            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.name}
              className="w-12 h-12 rounded object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentTrack.name}</div>
              <div className="text-sm text-white/60 truncate">{currentTrack.primaryArtists}</div>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto">
        {priorityQueue.length > 0 && (
          <div className="p-4">
            <div className="text-sm text-white/60 mb-2">Next Up</div>
            {priorityQueue.map((track, index) => (
              <div key={`${track.id}-${index}`} className="flex items-center gap-3 mb-3">
                <img 
                  src={track.albumArt} 
                  alt={track.name}
                  className="w-12 h-12 rounded object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.name}</div>
                  <div className="text-sm text-white/60 truncate">{track.primaryArtists}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {queue.length > 0 && (
          <div className="p-4">
            <div className="text-sm text-white/60 mb-2">Later</div>
            {queue.map((track, index) => (
              <div key={`${track.id}-${index}`} className="flex items-center gap-3 mb-3">
                <img 
                  src={track.albumArt} 
                  alt={track.name}
                  className="w-12 h-12 rounded object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.name}</div>
                  <div className="text-sm text-white/60 truncate">{track.primaryArtists}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {queue.length === 0 && priorityQueue.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/60">
            Queue is empty
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueView; 