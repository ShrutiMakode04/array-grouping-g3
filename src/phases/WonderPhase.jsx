import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function WonderPhase({ onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    audioManager.play('wonder_intro');
    const t1 = setTimeout(() => setRevealed(true), 500);
    const t2 = setTimeout(() => setShowButton(true), 1500);
    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      audioManager.stop();
    };
  }, []);

  return (
    <div className="wonder-phase">
      {/* Phase Title */}
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', margin: 0 }}>
          Wonder Phase 🤔
        </h2>
      </div>

      <div className="wonder-content" style={{ maxWidth: '650px', width: '100%' }}>
        <div className={`wonder-question-card ${revealed ? 'visible' : ''}`} style={{ padding: '32px 36px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤔</div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--gold)', marginBottom: '14px', fontWeight: 'bold' }}>
            Have you ever seen things arranged in a perfect grid?
          </div>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
            Sarah wants to plant <strong style={{ color: '#fff' }}>12 seeds</strong>.
            Instead of placing them randomly, she makes an ARRAY:
          </p>

          <div style={{ background: 'rgba(255,193,7,0.12)', border: '2px solid var(--gold)', borderRadius: '12px', padding: '12px 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold)', marginBottom: '14px' }}>
            3 rows of 4
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            We can find the total using a <strong style={{ color: '#fff' }}>magic shortcut</strong> — <strong style={{ color: 'var(--gold)' }}>Multiplication!</strong>
          </p>

          <div style={{ background: 'rgba(100,200,255,0.1)', border: '2px solid var(--blue-bright)', borderRadius: '12px', padding: '12px 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--blue-bright)', marginTop: '14px' }}>
            3 × 4 = 12 ⚡
          </div>

          <div className="story-mascot" style={{ justifyContent: 'center', marginTop: '18px' }}>
            <div className="mascot">🦊</div>
            <div className="speech-bubble" style={{ fontSize: '0.95rem' }}>
              "I'm John! An array is a neat grid. Just multiply rows by columns!"
            </div>
          </div>
        </div>

        <button
          className={`btn btn-wonder ${showButton ? 'visible' : ''}`}
          onClick={onNext}
          style={{ marginTop: '18px' }}
        >
          <span>✨</span> See the Story! <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
