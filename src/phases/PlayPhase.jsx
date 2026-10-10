import { useState, useEffect } from 'react';
import { Lock, Star, ArrowRight, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

const WORLDS = [
  { id: 1, name: 'Food Festival', icon: '🍔', desc: 'Delicious Arrays', color: '#ff9800', emojis: ['🍔', '🍕', '🍩', '🍪', '🍎'] },
  { id: 2, name: 'Space Station', icon: '🚀', desc: 'Galactic Grids', color: '#3f51b5', emojis: ['🚀', '🛸', '⭐', '🪐', '👽'] },
  { id: 3, name: 'Animal Safari', icon: '🦁', desc: 'Wild Rows', color: '#4caf50', emojis: ['🐶', '🦁', '🐒', '🐸', '🐢'] }
];

function makeQuestion(type, rows, cols, emoji, total) {
  switch (type) {
    case 'find_multiplication': {
      const correct = `${rows} × ${cols}`;
      let wrong1 = `${cols} × ${rows + 1}`;
      let wrong2 = `${rows + 1} × ${cols}`;
      let wrong3 = `${total} × 1`;
      return {
        prompt: `What multiplication fact matches this array?`,
        showArray: true,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'mult'),
        explanation: `This array has ${rows} rows and ${cols} columns. That's ${rows} × ${cols} = ${total}.`
      };
    }
    case 'find_total': {
      const correct = `${total}`;
      const wrong1 = `${total + 1}`;
      let wrong2 = `${total - cols}`;
      if (wrong2 === correct) wrong2 = `${total + 2}`;
      const wrong3 = `${rows + cols}`;
      return {
        prompt: `Find the total in this ${rows} × ${cols} array.`,
        showArray: true,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'num'),
        explanation: `Count the items! ${rows} rows with ${cols} in each row = ${total}.`
      };
    }
    case 'identify_rows': {
      const correct = `${rows} rows`;
      const wrong1 = `${rows + 1} rows`;
      let wrong2 = `${cols} rows`;
      if (wrong2 === correct) wrong2 = `${rows + 2} rows`;
      let wrong3 = `${total} rows`;
      return {
        prompt: `How many ROWS (↔️) are in this array?`,
        showArray: true,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'groups'),
        explanation: `Rows go across! There are exactly ${rows} rows here.`
      };
    }
    case 'identify_cols': {
      const correct = `${cols} columns`;
      const wrong1 = `${cols + 1} columns`;
      let wrong2 = `${rows} columns`;
      if (wrong2 === correct) wrong2 = `${cols + 2} columns`;
      let wrong3 = `${total} columns`;
      return {
        prompt: `How many COLUMNS (↕️) are in this array?`,
        showArray: true,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'groups'),
        explanation: `Columns go up and down! There are exactly ${cols} columns here.`
      };
    }
    case 'match_description': {
      const correct = `${rows} rows of ${cols}`;
      let wrong1 = `${cols} rows of ${rows}`;
      if (wrong1 === correct) wrong1 = `${rows} rows of ${cols + 1}`;
      const wrong2 = `${rows + 1} rows of ${cols}`;
      const wrong3 = `${total} rows of 1`;
      return {
        prompt: `Which description perfectly matches this array?`,
        showArray: true,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'desc'),
        explanation: `Look at the grid! It clearly shows ${rows} rows, and each row has ${cols} items.`
      };
    }
    case 'odd_one_out': {
      const correct_a = `${rows} × ${cols} = ${total}`;
      const correct_b = `${rows} rows of ${cols}`;
      const correct_c = `${total} total items`;
      const wrong = `${rows + 1} rows of ${cols}`;
      return {
        prompt: `Which is WRONG about this array?`,
        showArray: true,
        answer: wrong,
        options: ensureFourUniqueOptions([correct_a, correct_b, correct_c, wrong], wrong, 'mixed'),
        explanation: `The array DOES have ${rows} rows of ${cols}, which equals ${total}. So "${wrong}" is the incorrect statement!`
      };
    }
    case 'word_problem': {
      const correct = `${total} items`;
      const wrong1 = `${total + 1} items`;
      let wrong2 = `${rows + cols} items`;
      if (wrong2 === correct) wrong2 = `${total - 1} items`;
      const wrong3 = `${rows * rows} items`;
      return {
        prompt: `Word Problem: You have ${rows} boxes. Each box has ${cols} items inside. How many items total?`,
        showArray: false,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'groups'),
        explanation: `This is the same as an array! ${rows} groups of ${cols} = ${total}.`
      };
    }
    case 'addition_match': {
      const buildAddition = (count, num) => Array.from({length: count}).fill(num).join(' + ');
      const correct = buildAddition(rows, cols);
      const wrong1 = buildAddition(cols, rows);
      const wrong2 = buildAddition(rows + 1, cols);
      const wrong3 = buildAddition(rows, cols + 1);
      return {
        prompt: `Which repeated addition matches ${rows} × ${cols}? (Hint: ${rows} rows of ${cols})`,
        showArray: false,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'mixed'),
        explanation: `${rows} × ${cols} means adding the number ${cols} exactly ${rows} times: ${correct}.`
      };
    }
    case 'missing_factor': {
      const correct = `${cols} columns`;
      const wrong1 = `${cols + 1} columns`;
      const wrong2 = `${rows} columns`;
      const wrong3 = `${total} columns`;
      return {
        prompt: `Mystery Array: If an array has a total of ${total} items and ${rows} rows, how many COLUMNS does it have?`,
        showArray: false,
        answer: correct,
        options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'groups'),
        explanation: `Think backwards! What number multiplied by ${rows} gives ${total}? Yes, ${cols}! So there are ${cols} columns.`
      };
    }
    default: return makeQuestion('find_total', rows, cols, emoji, total);
  }
}

function ensureFourUniqueOptions(optsArr, answer, typeFallback) {
  let uniqueOpts = [...new Set(optsArr)];
  let fallbackNum = 2;
  while (uniqueOpts.length < 4) {
    let fallback;
    if (typeFallback === 'mult') fallback = `${fallbackNum + 1} × ${fallbackNum}`;
    else if (typeFallback === 'num') fallback = `${fallbackNum * 5}`;
    else if (typeFallback === 'groups') fallback = `${fallbackNum + 3} rows`;
    else if (typeFallback === 'desc') fallback = `${fallbackNum} rows of ${fallbackNum + 2}`;
    else fallback = `${fallbackNum} + 1`;
    
    if (!uniqueOpts.includes(fallback) && fallback !== answer) {
      uniqueOpts.push(fallback);
    }
    fallbackNum++;
  }
  return shuffle(uniqueOpts).slice(0, 4);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const PATTERNS = ['find_multiplication', 'find_total', 'word_problem', 'identify_rows', 'addition_match', 'missing_factor', 'odd_one_out'];

function generateQuestions(world) {
  const qs = [];
  for (let i = 0; i < 10; i++) {
    let rows, cols;
    if (world.id === 1) {
      // Basic Arrays
      rows = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
      cols = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
    } else if (world.id === 2) {
      // Intermediate Arrays
      rows = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
      cols = Math.floor(Math.random() * 5) + 3; // 3, 4, 5, 6, 7
    } else {
      // Advanced Arrays
      rows = Math.floor(Math.random() * 3) + 5; // 5, 6, 7
      cols = Math.floor(Math.random() * 6) + 4; // 4, 5, 6, 7, 8, 9
    }
    const emoji = world.emojis[Math.floor(Math.random() * world.emojis.length)];
    const total = rows * cols;
    const type = PATTERNS[i % PATTERNS.length];
    const q = makeQuestion(type, rows, cols, emoji, total);
    qs.push({ id: i, rows, cols, emoji, total, type, ...q });
  }
  return shuffle(qs); // Shuffle so it's random every time!
}

export default function PlayPhase({ onComplete }) {
  const [currentWorldId, setCurrentWorldId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [completedWorlds, setCompletedWorlds] = useState([]);
  const [view, setView] = useState('map');

  const startWorld = (world) => {
    setCurrentWorldId(world.id);
    setQuestions(generateQuestions(world));
    setQIndex(0);
    setFeedback(null);
    setView('playing');
  };

  useEffect(() => {
    audioManager.play('play_intro');
    return () => audioManager.stop();
  }, []);

  const handleOptionSelect = (opt) => {
    if (feedback) return;
    const q = questions[qIndex];
    const isCorrect = opt === q.answer;
    if (isCorrect) {
      audioManager.playCorrectSFX();
      audioManager.play('play_correct');
      setScore(s => s + 10);
      setTimeout(() => handleNext(), 1500);
    } else {
      audioManager.playWrongSFX();
      audioManager.play('play_wrong');
      setTimeout(() => handleNext(), 2500);
    }
    setFeedback({ result: isCorrect ? 'correct' : 'wrong', explanation: q.explanation, selected: opt, correct: q.answer });
  };

  const handleNext = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex(qi => qi + 1);
      setFeedback(null);
    } else {
      setCompletedWorlds(prev => prev.includes(currentWorldId) ? prev : [...prev, currentWorldId]);
      setView('worldComplete');
    }
  };

  const goToNextWorld = () => {
    const nextId = currentWorldId + 1;
    if (nextId <= 3) startWorld(WORLDS.find(w => w.id === nextId));
    else onComplete(score);
  };

  const currentWorld = WORLDS.find(w => w.id === currentWorldId);

  // MAP VIEW
  if (view === 'map') {
    return (
      <div className="play-phase">
        <div className="play-header" style={{ marginBottom: '30px' }}>
          <div className="play-world-badge" style={{ fontSize: '1.2rem', padding: '8px 24px' }}>Play Phase</div>
          <h2 className="play-title" style={{ fontSize: '2.5rem' }}>Select a World to Play</h2>
          <div className="play-xp-badge" style={{ fontSize: '1.2rem' }}>XP: {score}</div>
        </div>
        <div className="world-map">
          {WORLDS.map((world, i) => {
            const isUnlocked = i === 0 || completedWorlds.includes(world.id - 1);
            const isDone = completedWorlds.includes(world.id);
            return (
              <div
                key={world.id}
                className={`world-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => isUnlocked && startWorld(world)}
                style={{ '--world-color': world.color, cursor: isUnlocked ? 'pointer' : 'not-allowed', opacity: isUnlocked ? 1 : 0.55 }}
              >
                <div className="world-icon">{isUnlocked ? world.icon : '🔒'}</div>
                <div className="world-name">{world.name}</div>
                <div className="world-desc">{isUnlocked ? world.desc : 'Complete previous world first!'}</div>
                <div className="world-stars">
                  {[1, 2, 3].map(s => <Star key={s} fill={isDone ? '#ffc107' : 'none'} color="#ffc107" size={18} />)}
                </div>
                {isUnlocked
                  ? <button className="world-play-btn">{isDone ? '↺ Replay' : 'Play ▶'}</button>
                  : <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: '6px' }}>🔒 Locked</div>
                }
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // WORLD COMPLETE
  if (view === 'worldComplete') {
    const isLast = currentWorldId === 3;
    const nextWorld = WORLDS.find(w => w.id === currentWorldId + 1);
    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div style={{ fontSize: '5rem' }}>{currentWorld.icon}</div>
          <h2 className="world-complete-title">{currentWorld.name} Complete! 🎉</h2>
          <div className="world-complete-stars">
            {[1, 2, 3].map(s => <Star key={s} fill="#ffc107" color="#ffc107" size={40} />)}
          </div>
          <div style={{ fontSize: '2rem', color: 'var(--gold)', margin: '15px 0', fontWeight: 'bold' }}>Score: {score} XP</div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => setView('map')}><RefreshCcw size={18} /> Map</button>
            <button className="btn btn-primary" onClick={goToNextWorld} style={{ fontSize: '1.1rem', padding: '12px 28px' }}>
              {isLast ? '🎓 Finish Quest' : `Next: ${nextWorld?.name} ${nextWorld?.icon}`} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING
  const q = questions[qIndex];
  const patternLabel = {
    find_multiplication: 'Find the Fact', find_total: 'Find the Total',
    identify_rows: 'Identify Rows', identify_cols: 'Identify Columns',
    match_description: 'Match Array', odd_one_out: 'Odd One Out 🔍',
    word_problem: 'Word Problem 📝', addition_match: 'Addition Match ➕',
    missing_factor: 'Mystery Array 🕵️'
  }[q.type] || 'Question';

  return (
    <div className="play-phase" style={{ paddingTop: '10px' }}>
      <div className="hud">
        <div className="hud-item" style={{ background: '#ffc10726', color: '#ffc107' }}><Star size={16} /> {score}</div>
        <div className="hud-item">{currentWorld?.icon} {currentWorld?.name}</div>
        <div className="hud-item">Q {qIndex + 1} / 10</div>
      </div>

      <div className="question-card" style={{ marginTop: '16px', maxWidth: '820px', width: '100%' }}>
        {/* Pattern label */}
        <div style={{ display: 'inline-block', background: 'rgba(255,193,7,0.15)', border: '1px solid var(--gold)', borderRadius: '20px', padding: '4px 16px', fontSize: '0.85rem', color: 'var(--gold)', marginBottom: '12px', fontWeight: 'bold' }}>
          {patternLabel}
        </div>

        {/* Visual Array Grid */}
        {q.showArray && (
          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', 
            marginBottom: '20px', padding: '20px', background: 'rgba(0,0,0,0.2)', 
            borderRadius: '14px', border: `2px solid ${currentWorld.color}`,
            boxShadow: `0 0 15px ${currentWorld.color}40`
          }}>
            {Array.from({ length: q.rows }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                {Array.from({ length: q.cols }).map((_, j) => (
                  <span key={j} style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{q.emoji}</span>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Question Prompt */}
        <div className="question-text" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{q.prompt}</div>

        {/* Options */}
        <div className="options-grid">
          {q.options.map((opt, i) => {
            let cls = 'option-btn';
            if (feedback) {
              if (opt === feedback.correct) cls += ' correct';
              else if (opt === feedback.selected && feedback.result === 'wrong') cls += ' wrong';
              else cls += ' disabled';
            }
            return <button key={i} className={cls} onClick={() => handleOptionSelect(opt)}>{opt}</button>;
          })}
        </div>

        {/* Explanation Panel */}
        {feedback && (
          <div style={{
            marginTop: '20px', padding: '18px 22px', borderRadius: '14px',
            background: feedback.result === 'correct' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
            border: `2px solid ${feedback.result === 'correct' ? '#4caf50' : '#f44336'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 'bold', color: feedback.result === 'correct' ? '#81c784' : '#ef9a9a' }}>
              {feedback.result === 'correct' ? <CheckCircle size={24} /> : <XCircle size={24} />}
              {feedback.result === 'correct' ? 'Awesome! 🎉' : 'Not quite — here\'s why:'}
            </div>
            <p style={{ fontSize: '1.1rem', color: '#e0e0ff', margin: 0, textAlign: 'center', lineHeight: 1.65 }}>
              {feedback.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
