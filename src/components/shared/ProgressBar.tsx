import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/musicStore';

interface ProgressBarProps {
  size?: 'sm' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ size = 'md' }) => {
  const { playbackState, seekTo } = useStore();
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * playbackState.duration;
    seekTo(time);
  };

  const progress = (playbackState.currentTime / playbackState.duration) * 100;

  return (
    <div 
      ref={progressRef}
      onClick={handleProgressClick}
      className={`relative w-full h-1 bg-white/20 rounded-full cursor-pointer group`}
    >
      <div 
        className="absolute left-0 top-0 h-full bg-purple-500 rounded-full"
        style={{ width: `${progress}%` }}
      />
      <div 
        className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ 
          left: `${progress}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};

export default ProgressBar;