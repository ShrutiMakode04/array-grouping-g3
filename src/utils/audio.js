import { audioAssets } from './audioAssets';

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.audioCache = new Map();
    this.sfxContext = null; // We can use Web Audio API for simple beeps if needed, or just standard Audio
  }

  // Preload an audio file
  preload(key) {
    if (!audioAssets[key] || this.audioCache.has(key)) return;
    const audio = new Audio(audioAssets[key]);
    audio.load();
    this.audioCache.set(key, audio);
  }

  // Play a voice track (stops previous)
  play(key, onEnded = null) {
    this.stop(); // Stop anything currently playing immediately
    
    if (!audioAssets[key]) {
      console.warn(`Audio key "${key}" not found in assets.`);
      if (onEnded) onEnded();
      return;
    }

    let audio = this.audioCache.get(key);
    if (!audio) {
      audio = new Audio(audioAssets[key]);
      this.audioCache.set(key, audio);
    }
    
    // Reset time just in case it was played before
    audio.currentTime = 0;
    
    if (onEnded) {
      audio.onended = () => {
        audio.onended = null;
        onEnded();
      };
    } else {
      audio.onended = null;
    }

    this.currentAudio = audio;
    audio.play().catch(e => console.warn(`Audio playback failed for ${key}:`, e));
  }

  // Stop current playing voice track
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.onended = null;
      this.currentAudio = null;
    }
  }

  // Simple synthesised beep for correct/wrong if mp3 missing
  playTone(frequency, type = 'sine', duration = 0.1) {
    try {
      if (!this.sfxContext) this.sfxContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = this.sfxContext.createOscillator();
      const gainNode = this.sfxContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.sfxContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, this.sfxContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.sfxContext.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxContext.destination);
      oscillator.start();
      oscillator.stop(this.sfxContext.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext not supported or blocked');
    }
  }

  playTap() {
    // If we have a local click.mp3, play it, else fallback to low beep
    if (audioAssets['click']) {
      const a = new Audio(audioAssets['click']);
      a.volume = 0.5;
      a.play().catch(() => this.playTone(300, 'sine', 0.1));
    } else {
      this.playTone(300, 'sine', 0.1);
    }
  }

  playCorrectSFX() {
    this.playTone(600, 'sine', 0.1);
    setTimeout(() => this.playTone(800, 'sine', 0.15), 100);
  }

  playWrongSFX() {
    this.playTone(300, 'triangle', 0.15);
    setTimeout(() => this.playTone(250, 'triangle', 0.2), 150);
  }
}

export const audioManager = new AudioManager();
