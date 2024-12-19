import { Howl } from 'howler';

export class AudioPlayer {
  private static instance: AudioPlayer;
  private currentSound: Howl | null = null;
  private onPlayCallback: (() => void) | null = null;
  private onPauseCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onLoadCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  private constructor() {}

  static getInstance(): AudioPlayer {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer();
    }
    return AudioPlayer.instance;
  }

  play(url: string): void {
    if (this.currentSound) {
      this.currentSound.unload();
    }

    this.currentSound = new Howl({
      src: [url],
      html5: true,
      onplay: () => this.onPlayCallback?.(),
      onpause: () => this.onPauseCallback?.(),
      onend: () => this.onEndCallback?.(),
      onload: () => this.onLoadCallback?.(),
      onloaderror: (id, error) => this.onErrorCallback?.(error)
    });

    this.currentSound.play();
  }

  pause(): void {
    this.currentSound?.pause();
  }

  resume(): void {
    this.currentSound?.play();
  }

  stop(): void {
    this.currentSound?.stop();
  }

  seek(position: number): void {
    this.currentSound?.seek(position);
  }

  setVolume(volume: number): void {
    this.currentSound?.volume(volume);
  }

  getDuration(): number {
    return this.currentSound?.duration() ?? 0;
  }

  getCurrentTime(): number {
    return this.currentSound?.seek() as number ?? 0;
  }

  onPlay(callback: () => void): void {
    this.onPlayCallback = callback;
  }

  onPause(callback: () => void): void {
    this.onPauseCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  onLoad(callback: () => void): void {
    this.onLoadCallback = callback;
  }

  onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }
}

export const audioPlayer = AudioPlayer.getInstance();