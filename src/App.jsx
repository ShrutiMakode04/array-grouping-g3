import { useState } from 'react';
import WelcomePhase from './phases/WelcomePhase';
import WonderPhase from './phases/WonderPhase';
import StoryPhase from './phases/StoryPhase';
import SimulatePhase from './phases/SimulatePhase';
import PlayPhase from './phases/PlayPhase';
import ReflectPhase from './phases/ReflectPhase';
import GlobalHeader from './components/GlobalHeader';

export default function App() {
  const [phase, setPhase] = useState('welcome');
  const [score, setScore] = useState(0);

  const handleNext = (nextPhase) => {
    setPhase(nextPhase);
  };

  const handleComplete = (finalScore) => {
    setScore(finalScore);
    setPhase('reflect');
  };

  const handleRestart = () => {
    setScore(0);
    setPhase('welcome');
  };

  return (
    <div className="app-container">
      <GlobalHeader onHome={handleRestart} />
      
      {/* Floating Background Elements */}
      <div className="floating-numbers">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-number"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `-${Math.random() * 20}s`,
              opacity: Math.random() * 0.15 + 0.05,
              fontSize: `${Math.random() * 3 + 2}rem`,
              color: i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--purple-light)' : 'var(--blue-bright)'
            }}
          >
            {['+', '×', '=', '20', '15', '4', '5'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {phase === 'welcome' && <WelcomePhase onNext={() => handleNext('wonder')} />}
      {phase === 'wonder' && <WonderPhase onNext={() => handleNext('story')} />}
      {phase === 'story' && <StoryPhase onNext={() => handleNext('simulate')} />}
      {phase === 'simulate' && <SimulatePhase onNext={() => handleNext('play')} />}
      {phase === 'play' && <PlayPhase onComplete={handleComplete} />}
      {phase === 'reflect' && <ReflectPhase score={score} onRestart={handleRestart} />}
    </div>
  );
}
