import { useState, useEffect } from 'react';
import { Award, RotateCcw } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function ReflectPhase({ score, total = 30, onRestart }) {
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    audioManager.play('reflect_intro');
    return () => audioManager.stop();
  }, []);

  const confidenceOptions = [
    { id: 'high', emoji: '🤩', label: 'I can do this easily!', color: '#4caf50' },
    { id: 'med', emoji: '😊', label: 'I need a little more practice', color: '#ffc107' },
    { id: 'low', emoji: '🤔', label: 'I need help with this', color: '#ef5350' },
  ];

  return (
    <div className="reflect-phase">
      {/* Phase Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Reflect Phase
        </h2>
      </div>

      {!confidence ? (
        <div className="reflect-card">
          <div className="reflect-header">
            <div className="reflect-label">Self Check</div>
            <div className="reflect-sublabel">How do you feel about arrays and grouping?</div>
          </div>
          
          <div className="reflect-mascot-row">
            <div className="mascot happy">🦉</div>
            <div className="speech-bubble">
              You did great! How do you feel about building arrays to multiply now?
            </div>
          </div>

          <div className="confidence-grid">
            {confidenceOptions.map(opt => (
              <button
                key={opt.id}
                className="confidence-btn"
                style={{ '--conf-color': opt.color }}
                onClick={() => setConfidence(opt.id)}
              >
                <span className="confidence-emoji">{opt.emoji}</span>
                <span className="confidence-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="certificate-card">
          <div className="confetti-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#ffc107', '#4caf50', '#ef5350', '#3f51b5'][Math.floor(Math.random() * 4)],
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 1}s`
                }}
              />
            ))}
          </div>
          
          <div className="cert-badge">🏆</div>
          <h2 className="cert-title">Array Master</h2>
          <div className="cert-subtitle">Certificate of Achievement</div>
          
          <div className="cert-stats">
            <div className="cert-stat">
              <div className="cert-stat-value">{score}</div>
              <div className="cert-stat-label">Total XP</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>1</div>
              <div className="cert-stat-label">Worlds Cleared</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>100%</div>
              <div className="cert-stat-label">Effort</div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={onRestart} style={{ marginTop: '20px' }}>
            <RotateCcw size={20} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}
