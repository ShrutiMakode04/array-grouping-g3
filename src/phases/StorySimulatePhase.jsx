import { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function StorySimulatePhase({ onNext }) {
  const [step, setStep] = useState(0); 
  // 0: intro
  // 1: sorting
  // 2: compressed

  const groups = 4;
  const groupSize = 5;

  const [applesSorted, setApplesSorted] = useState(0);

  const handleSortApple = () => {
    if (applesSorted < groups * groupSize) {
      setApplesSorted(applesSorted + 1);
    }
    if (applesSorted + 1 === groups * groupSize) {
      setTimeout(() => setStep(2), 1500);
    }
  };

  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <div className="simulate-label">Equal Groups Magic</div>
        <div className="simulate-sublabel">Help Mo group the apples!</div>
      </div>

      {step === 0 && (
        <div className="story-card" style={{ padding: '40px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '4rem' }}>🦊🍎</div>
          <h2>Let's put the apples into EQUAL groups!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Same number in each basket.</p>
        </div>
      )}

      {step >= 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
          {step === 1 && applesSorted < groups * groupSize && (
            <div className="simulate-tip">
              Tap the apples to sort them! ({applesSorted}/{groups * groupSize})
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: groups }).map((_, i) => {
              const countInBasket = Math.min(groupSize, Math.max(0, applesSorted - i * groupSize));
              return (
                <div key={i} className={`group-circle ${countInBasket === groupSize ? 'complete' : ''}`}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', padding: '10px', justifyContent: 'center' }}>
                    {Array.from({ length: countInBasket }).map((_, j) => (
                      <span key={j} style={{ fontSize: '1.2rem', animation: 'bounceIn 0.3s' }}>🍎</span>
                    ))}
                  </div>
                  <div className="group-circle-counter">{countInBasket}</div>
                </div>
              );
            })}
          </div>

          {step === 1 && applesSorted < groups * groupSize && (
            <div className="object-pool" onClick={handleSortApple} style={{ cursor: 'pointer' }}>
              <span className="pool-object selected" style={{ fontSize: '3rem' }}>🍎</span>
              <div style={{ fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>Tap to sort!</div>
            </div>
          )}

          {applesSorted === groups * groupSize && (
            <div style={{ animation: 'slideUp 0.5s', marginTop: '20px', textAlign: 'center' }}>
              <div className="sentence-row" style={{ position: 'relative', height: '60px' }}>
                <span style={{ 
                  position: 'absolute', 
                  transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: step === 2 ? 0 : 1,
                  transform: step === 2 ? 'scale(0) translateY(-20px)' : 'scale(1) translateY(0)'
                }}>
                  {Array.from({ length: groups }).map((_, i) => (
                    <span key={i}>
                      <span className="given-value">{groupSize}</span>
                      {i < groups - 1 && <span className="sentence-label"> + </span>}
                    </span>
                  ))}
                  <span className="sentence-equals"> = </span>
                  <span className="given-value" style={{ color: 'var(--green-light)' }}>{groups * groupSize}</span>
                </span>

                <span style={{ 
                  position: 'absolute', 
                  transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: step === 2 ? 1 : 0,
                  transform: step === 2 ? 'scale(1) translateY(0)' : 'scale(2) translateY(20px)',
                  color: 'var(--gold)',
                  textShadow: '0 0 15px rgba(255,193,7,0.5)'
                }}>
                  <span className="given-value" style={{ color: 'var(--gold)' }}>{groups}</span>
                  <span className="sentence-label" style={{ color: '#fff' }}> × </span>
                  <span className="given-value" style={{ color: 'var(--gold)' }}>{groupSize}</span>
                  <span className="sentence-equals" style={{ color: '#fff' }}> = </span>
                  <span className="given-value" style={{ color: 'var(--green-light)' }}>{groups * groupSize}</span>
                </span>
              </div>
              
              {step === 2 && (
                <div style={{ marginTop: '30px', animation: 'fadeIn 1s' }}>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Multiplication is just a faster way to write repeated addition!
                  </p>
                  <button className="btn btn-primary" onClick={onNext}>
                    Let's Play! <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
