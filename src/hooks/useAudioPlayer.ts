import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/musicStore';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { 
    currentTrack, 
    playbackState, 
    updatePlaybackState,
    queue,
    intelligentShuffle 
  } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackState.volume;
    }
  }, [playbackState.volume]);

  useEffect(() => {
    if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (playbackState.isPlaying) {
        audioRef.current.play().catch(() => {
          updatePlaybackState({ isPlaying: false });
        });
      }
    }
  }, [currentTrack?.audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (playbackState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        updatePlaybackState({ isPlaying: false });
      });
    }
    updatePlaybackState({ isPlaying: !playbackState.isPlaying });
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    updatePlaybackState({
      currentTime: audioRef.current.currentTime,
      duration: audioRef.current.duration || 0
    });
  };

  const handleEnded = () => {
    if (queue.length > 0) {
      intelligentShuffle();
    } else {
      updatePlaybackState({ isPlaying: false, currentTime: 0 });
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      updatePlaybackState({ volume });
    }
  };

  return {
    audioRef,
    isReady,
    togglePlay,
    handleTimeUpdate,
    handleEnded,
    seekTo,
    setVolume
  };
};