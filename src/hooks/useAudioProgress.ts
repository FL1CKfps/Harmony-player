import { useEffect, useState } from 'react';
import { audioPlayer } from '../utils/audioPlayer';

export const useAudioProgress = () => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(audioPlayer.getCurrentTime());
      setDuration(audioPlayer.getDuration());
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  return { progress, duration };
};