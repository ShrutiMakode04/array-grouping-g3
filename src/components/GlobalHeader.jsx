import { Home, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { audioManager } from '../utils/audio';

export default function GlobalHeader({ onHome }) {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <>
      <button className="home-btn" onClick={onHome}>
        <Home size={18} />
        <span>Home</span>
      </button>
      <button 
        className="audio-toggle-btn" 
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </>
  );
}
