import React, { useState, useEffect } from 'react';
import { audioManager } from '../utils/audio';

const T = { click: () => audioManager.playTap(), correct: () => audioManager.playTap(), badge: () => audioManager.playTap() };

function randomPos() {
  return { left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%` };
}

export default function SimulatePhase({ onNext }) {
  const [level, setLevel] = useState(1);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    audioManager.play(`sim_${level}`);
  }, [level]);

  // Level 1 State: Grid Builder
  const [l1Grid, setL1Grid] = useState({ r: 0, c: 0 });
  const [l1Done, setL1Done] = useState(false);

  // Level 2 State: Highlighter
  const [l2Rows, setL2Rows] = useState(new Set());
  const [l2Cols, setL2Cols] = useState(new Set());
  const [l2Mode, setL2Mode] = useState('rows'); // 'rows' then 'cols'
  const [l2Done, setL2Done] = useState(false);

  // Level 3 State: Scatter to Array
  const [l3Balloons, setL3Balloons] = useState(Array.from({ length: 15 }, (_, i) => ({ id: i, ...randomPos() })));
  const [l3Sorted, setL3Sorted] = useState(false);

  // Level 4 State: Robot Assembly
  const [l4Rows, setL4Rows] = useState(0);
  const [l4Done, setL4Done] = useState(false);

  // Level 5 State: Array Rotation
  const [l5Rotated, setL5Rotated] = useState(false);
  const [l5Answered, setL5Answered] = useState(false);

  // Level 6 State: Missing Pieces
  const [l6Filled, setL6Filled] = useState(new Set([0, 1, 2, 3, 5, 6, 8])); // Missing 4 and 7 in a 3x3 grid
  const [l6Answered, setL6Answered] = useState(false);

  // Handlers
  const handleL1Click = (r, c) => {
    if (l1Done) return;
    T.click();
    setL1Grid({ r, c });
    if (r === 3 && c === 4) {
      T.correct();
      setL1Done(true);
    }
  };

  const handleL2Click = (idx) => {
    if (l2Done) return;
    T.click();
    if (l2Mode === 'rows') {
      setL2Rows(prev => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
    } else {
      setL2Cols(prev => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
    }
  };

  const submitL2Rows = () => {
    if (l2Rows.size === 3) {
      T.correct();
      setL2Mode('cols');
    } else {
      audioManager.playWrongSFX();
    }
  };

  const submitL2Cols = () => {
    if (l2Cols.size === 4) {
      T.correct();
      setL2Done(true);
    } else {
      audioManager.playWrongSFX();
    }
  };

  const handleL3Sort = () => {
    if (l3Sorted || animating) return;
    T.click();
    setAnimating(true);
    
    const sorted = l3Balloons.map((b, i) => {
      const r = Math.floor(i / 5);
      const c = i % 5;
      return { ...b, left: `${c * 80 + 60}px`, top: `${r * 80 + 40}px` };
    });
    setL3Balloons(sorted);
    
    setTimeout(() => {
      setL3Sorted(true);
      T.correct();
      setAnimating(false);
    }, 1500);
  };

  const handleL4AddRow = () => {
    if (l4Done || l4Rows >= 4 || animating) return;
    T.click();
    setL4Rows(r => r + 1);
    if (l4Rows + 1 === 4) {
      T.correct();
      setL4Done(true);
    }
  };

  const handleL5Rotate = () => {
    if (l5Rotated || animating) return;
    T.click();
    setL5Rotated(true);
  };

  const handleL5Answer = (ans) => {
    T.click();
    if (ans === '4x2') {
      T.correct();
      setL5Answered(true);
    } else {
      audioManager.playTap(); // play wrong
    }
  };

  const handleL6Click = (idx) => {
    if (l6Filled.has(idx)) return;
    T.click();
    setL6Filled(prev => {
      const next = new Set([...prev, idx]);
      if (next.size === 9) {
        T.correct();
      }
      return next;
    });
  };

  const handleL6Answer = (ans) => {
    T.click();
    if (ans === '9') {
      T.correct();
      setL6Answered(true);
    } else {
      audioManager.playTap(); // play wrong
    }
  };

  const nextLevel = () => {
    T.click();
    if (level < 6) {
      setLevel(l => l + 1);
    } else {
      T.badge();
      onNext();
    }
  };

  const NextButton = ({ text }) => (
    <button 
      className="btn btn-primary" 
      onClick={nextLevel} 
      style={{ 
        marginTop: '30px', padding: '15px 30px', fontSize: '1.4rem', 
        borderRadius: '30px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', 
        color: '#fff', border: 'none', cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(34,197,94,0.4)', animation: 'bounceIn 0.5s',
        display: 'flex', alignItems: 'center', gap: '10px', margin: '30px auto 0'
      }}
    >
      {text || "Next Simulation ➡️"}
    </button>
  );

  return (
    <div className="sim-container" style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1e1e2f', color: '#fff' }}>
      
      {/* Progress Header */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', marginTop: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map(l => (
          <div key={l} style={{ width: '40px', height: '10px', borderRadius: '5px', background: l < level ? '#4ade80' : l === level ? '#fbbf24' : '#333' }} />
        ))}
      </div>

      {/* Level 1: Grid Builder */}
      {level === 1 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#fbbf24', marginBottom: '10px' }}>Build an Array</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Click the grid to make an array with <strong>3 rows</strong> and <strong>4 columns</strong>!</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#2a2a3e', padding: '20px', borderRadius: '16px', border: '2px solid #fbbf24' }}>
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {Array.from({ length: 6 }).map((_, c) => {
                  const isActive = (r + 1) <= l1Grid.r && (c + 1) <= l1Grid.c;
                  const isTarget = l1Done && isActive;
                  return (
                    <div 
                      key={c} 
                      onClick={() => handleL1Click(r + 1, c + 1)}
                      style={{
                        width: '60px', height: '60px', borderRadius: '12px', cursor: 'pointer',
                        background: isActive ? '#4ade80' : '#1e1e2f',
                        border: `2px solid ${isActive ? '#22c55e' : '#444'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', transition: 'all 0.2s',
                        transform: isTarget ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive ? '0 0 15px rgba(74,222,128,0.4)' : 'none'
                      }}
                    >
                      {isActive ? '🍎' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {l1Done && (
            <div style={{ animation: 'bounceIn 0.5s' }}>
              <div style={{ fontSize: '1.5rem', color: '#4ade80', marginTop: '20px' }}>Awesome! 3 rows × 4 columns = 12 Apples!</div>
              <NextButton />
            </div>
          )}
        </div>
      )}

      {/* Level 2: Highlighter */}
      {level === 2 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#38bdf8', marginBottom: '10px' }}>Highlight the {l2Mode === 'rows' ? 'Rows' : 'Columns'}</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            {l2Mode === 'rows' ? "We need to find an array of 3 rows and 4 columns. First, highlight exactly 3 rows!" : "Great! Now highlight exactly 4 columns!"}
          </p>

          <div style={{ position: 'relative', background: '#2a2a3e', padding: '30px', borderRadius: '16px', border: '2px solid #38bdf8', display: 'inline-block' }}>
            {/* The Grid of Stars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 70px)', gap: '15px', position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>⭐</div>
              ))}
            </div>

            {/* Row Click Targets */}
            {l2Mode === 'rows' && Array.from({ length: 4 }).map((_, r) => (
              <div 
                key={r} 
                onClick={() => handleL2Click(r)}
                style={{
                  position: 'absolute', top: `${r * 85 + 30}px`, left: '15px', right: '15px', height: '70px',
                  background: l2Rows.has(r) ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)',
                  border: l2Rows.has(r) ? '3px solid #38bdf8' : '2px dashed #666', borderRadius: '12px',
                  cursor: 'pointer', zIndex: 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', paddingLeft: '10px'
                }}
              >
                {!l2Rows.has(r) && <span style={{ color: '#fff', fontSize: '0.8rem', opacity: 0.5 }}>Click Row {r+1}</span>}
              </div>
            ))}

            {/* Col Click Targets */}
            {l2Mode === 'cols' && Array.from({ length: 5 }).map((_, c) => (
              <div 
                key={c} 
                onClick={() => handleL2Click(c)}
                style={{
                  position: 'absolute', top: '15px', bottom: '15px', left: `${c * 85 + 30}px`, width: '70px',
                  background: l2Cols.has(c) ? 'rgba(244,114,182,0.3)' : 'rgba(255,255,255,0.05)',
                  border: l2Cols.has(c) ? '3px solid #f472b6' : '2px dashed #666', borderRadius: '12px',
                  cursor: 'pointer', zIndex: 1, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px'
                }}
              >
                {!l2Cols.has(c) && <span style={{ color: '#fff', fontSize: '0.8rem', opacity: 0.5 }}>Col {c+1}</span>}
              </div>
            ))}
          </div>

            {l2Mode === 'rows' && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={submitL2Rows} style={{ background: '#38bdf8', color: '#fff', padding: '10px 20px', fontSize: '1.1rem', borderRadius: '8px', border: 'none' }}>
                  Submit 3 Rows
                </button>
              </div>
            )}
            {l2Mode === 'cols' && !l2Done && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={submitL2Cols} style={{ background: '#f472b6', color: '#fff', padding: '10px 20px', fontSize: '1.1rem', borderRadius: '8px', border: 'none' }}>
                  Submit 4 Columns
                </button>
              </div>
            )}
          {l2Done && (
            <div style={{ animation: 'bounceIn 0.5s' }}>
              <div style={{ fontSize: '1.5rem', color: '#f472b6', marginTop: '20px' }}>Great job! 3 Rows and 4 Columns!</div>
              <NextButton />
            </div>
          )}
        </div>
      )}

      {/* Level 3: Scatter to Array */}
      {level === 3 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#c084fc', marginBottom: '10px' }}>Organize the Balloons</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>These 15 balloons are messy! Group them into a perfect array.</p>
          
          {!l3Sorted && !animating && (
            <button className="btn btn-primary" onClick={handleL3Sort} style={{ background: '#c084fc', color: '#fff', padding: '12px 24px', fontSize: '1.2rem', borderRadius: '30px', border: 'none', cursor: 'pointer', marginBottom: '20px', boxShadow: '0 4px 15px rgba(192,132,252,0.4)' }}>
              ✨ Organize into 3 Rows! ✨
            </button>
          )}

          <div style={{ position: 'relative', background: '#2a2a3e', width: '500px', height: '350px', borderRadius: '16px', border: '2px solid #c084fc', overflow: 'hidden', margin: '0 auto' }}>
            {l3Balloons.map(b => (
              <div 
                key={b.id} 
                style={{ 
                  position: 'absolute', left: b.left, top: b.top, fontSize: '3rem', 
                  transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                }}
              >
                🎈
              </div>
            ))}
          </div>

          {l3Sorted && (
            <div style={{ animation: 'bounceIn 0.5s' }}>
              <div style={{ fontSize: '1.5rem', color: '#c084fc', marginTop: '20px' }}>Perfect! 3 rows of 5 = 15 Balloons!</div>
              <NextButton />
            </div>
          )}
        </div>
      )}

      {/* Level 4: Robot Assembly */}
      {level === 4 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#f87171', marginBottom: '10px' }}>Robot Factory</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Assemble a 4 × 3 array of robots! Add them row by row.</p>
          
          <button 
            disabled={l4Rows >= 4}
            onClick={handleL4AddRow} 
            style={{ background: l4Rows >= 4 ? '#555' : '#f87171', color: '#fff', padding: '12px 24px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', cursor: l4Rows >= 4 ? 'not-allowed' : 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
          >
            {l4Rows >= 4 ? 'Factory Complete!' : '⚙️ Drop a Row (3 Robots)'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#2a2a3e', padding: '30px', borderRadius: '16px', border: '2px solid #f87171', minHeight: '380px' }}>
            {Array.from({ length: l4Rows }).map((_, r) => (
              <div key={r} style={{ display: 'flex', gap: '20px', justifyContent: 'center', animation: 'slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                {Array.from({ length: 3 }).map((_, c) => (
                  <div key={c} style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>🤖</div>
                ))}
              </div>
            ))}
          </div>

          {l4Done && (
            <div style={{ animation: 'bounceIn 0.5s' }}>
              <div style={{ fontSize: '1.5rem', color: '#f87171', marginTop: '20px' }}>Array Complete! 4 rows × 3 = 12 Robots!</div>
              <NextButton />
            </div>
          )}
        </div>
      )}

      {/* Level 5: Array Rotation */}
      {level === 5 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#eab308', marginBottom: '10px' }}>Rotate the Array</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Arrays can be rotated! Turn the <strong>2 × 4</strong> array to see what happens.</p>
          
          <button 
            disabled={l5Rotated}
            onClick={handleL5Rotate} 
            style={{ background: l5Rotated ? '#555' : '#eab308', color: '#fff', padding: '12px 24px', fontSize: '1.2rem', borderRadius: '8px', border: 'none', cursor: l5Rotated ? 'not-allowed' : 'pointer', marginBottom: '30px', fontWeight: 'bold' }}
          >
            {l5Rotated ? 'Rotated!' : '🔄 Rotate Array 90°'}
          </button>

          <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%',
              background: '#2a2a3e', padding: '30px', borderRadius: '16px', border: '2px solid #eab308', 
              transition: 'transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              transform: l5Rotated ? 'translate(-50%, -50%) rotate(90deg)' : 'translate(-50%, -50%) rotate(0deg)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 2 }).map((_, r) => (
                  <div key={r} style={{ display: 'flex', gap: '10px' }}>
                    {Array.from({ length: 4 }).map((_, c) => (
                      <div key={c} style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))', transform: l5Rotated ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 1.5s' }}>🍩</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {l5Rotated && !l5Answered && (
            <div style={{ animation: 'fadeIn 0.5s', marginTop: '20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#eab308' }}>What is the new array size?</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                <button className="btn btn-outline" onClick={() => handleL5Answer('4x4')}>4 rows of 4</button>
                <button className="btn btn-outline" onClick={() => handleL5Answer('4x2')}>4 rows of 2</button>
              </div>
            </div>
          )}

          {l5Answered && (
            <div style={{ animation: 'bounceIn 0.5s', marginTop: '20px' }}>
              <div style={{ fontSize: '1.5rem', color: '#eab308' }}>Magic! 2 × 4 became <strong>4 × 2</strong>.<br/>The total is still 8 Donuts!</div>
              <NextButton />
            </div>
          )}
        </div>
      )}

      {/* Level 6: Complete the Array */}
      {level === 6 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#a855f7', marginBottom: '10px' }}>Complete the Array</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>A true array has no missing spots. Fill in the empty holes to complete the <strong>3 × 3</strong> grid!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '15px', background: '#2a2a3e', padding: '30px', borderRadius: '16px', border: '2px solid #a855f7', justifyContent: 'center', width: 'fit-content', margin: '0 auto' }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                onClick={() => handleL6Click(i)}
                style={{ 
                  width: '80px', height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem',
                  background: l6Filled.has(i) ? '#a855f744' : '#1e1e2f',
                  border: l6Filled.has(i) ? '2px solid #a855f7' : '2px dashed #666',
                  cursor: l6Filled.has(i) ? 'default' : 'pointer', transition: 'all 0.3s'
                }}
              >
                {l6Filled.has(i) ? (
                  <span style={{ animation: 'bounceIn 0.4s' }}>🧁</span>
                ) : (
                  <span style={{ fontSize: '1rem', color: '#666' }}>Click</span>
                )}
              </div>
            ))}
          </div>

          {l6Filled.size === 9 && !l6Answered && (
            <div style={{ animation: 'fadeIn 0.5s', marginTop: '20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#a855f7' }}>The array is complete! What is the total now?</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                <button className="btn btn-outline" onClick={() => handleL6Answer('6')}>6 Cupcakes</button>
                <button className="btn btn-outline" onClick={() => handleL6Answer('9')}>9 Cupcakes</button>
              </div>
            </div>
          )}

          {l6Answered && (
            <div style={{ animation: 'bounceIn 0.5s', marginTop: '30px' }}>
              <div style={{ fontSize: '1.5rem', color: '#a855f7' }}>Perfect! The 3 × 3 array is complete with 9 Cupcakes!</div>
              <NextButton text="🏁 Finish Simulations" />
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}} />
    </div>
  );
}
