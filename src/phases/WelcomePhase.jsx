import { useState, useEffect } from 'react';
import { BookOpen, Star, Compass, Sparkles, Volume2, Play, Award } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function WelcomePhase({ onNext }) {
  const [step, setStep] = useState('start'); // 'start' | 'playing' | 'ready'

  useEffect(() => {
    return () => audioManager.stop();
  }, []);

  const handleStartLearning = () => {
    audioManager.play('welcome_intro');
    setStep('playing');
    setTimeout(() => {
      setStep('ready');
    }, 4000); // 4 seconds intro
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Math Quest</div>
      <h1 className="intro-title">
        Multiplication with<br/>
        <span style={{ color: 'var(--gold)', textShadow: '0 0 20px rgba(255,193,7,0.5)' }}>Arrays and Grouping</span>
      </h1>
      <p className="intro-desc" style={{ fontSize: '1.4rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 30px' }}>
        Join Sarah and John in the Magic Garden. 
        Learn how to arrange objects in neat grids to multiply fast!
      </p>
      
      {step === 'start' && (
        <button className="btn btn-outline btn-lg intro-start-btn" onClick={handleStartLearning} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Volume2 size={24} />
          Start Learning
        </button>
      )}

      {step === 'playing' && (
        <div style={{ padding: '15px', color: 'var(--gold)', fontSize: '1.4rem', animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Volume2 className="animate-spin-slow" /> Let's go!
        </div>
      )}

      {step === 'ready' && (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={onNext} style={{ animation: 'bounceIn 0.5s', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
          <Play size={26} />
          Begin Your Quest!
        </button>
      )}

      <div className="intro-journey-map" style={{ marginTop: '50px' }}>
        <div className="intro-journey-title" style={{ fontSize: '2rem', marginBottom: '25px' }}>Your Learning Path</div>
        <div className="intro-journey-steps" style={{ gap: '20px' }}>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Compass size={24} color="var(--gold)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>Wonder</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>The Counting Problem</div>
            </div>
          </div>
          <div className="intro-journey-arrow" style={{ fontSize: '1.5rem' }}>→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><BookOpen size={24} color="var(--purple-light)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>Story</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Mr. Owl's Grid</div>
            </div>
          </div>
          <div className="intro-journey-arrow" style={{ fontSize: '1.5rem' }}>→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Sparkles size={24} color="var(--blue-bright)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>Simulate</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Build Arrays</div>
            </div>
          </div>
          <div className="intro-journey-arrow" style={{ fontSize: '1.5rem' }}>→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Star size={24} color="var(--green-light)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>Play</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Test your skills</div>
            </div>
          </div>
          <div className="intro-journey-arrow" style={{ fontSize: '1.5rem' }}>→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Award size={24} color="var(--coral)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>Reflect</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Review your journey</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
