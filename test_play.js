const PATTERNS = ['find_addition', 'find_multiplication', 'find_total', 'which_expression', 'count_groups', 'odd_one_out'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function ensureFourUniqueOptions(optsArr, answer, typeFallback) {
  let uniqueOpts = [...new Set(optsArr)];
  let fallbackNum = 2;
  while (uniqueOpts.length < 4) {
    let fallback;
    if (typeFallback === 'add') fallback = `${fallbackNum} + ${fallbackNum} + ${fallbackNum}`;
    else if (typeFallback === 'mult') fallback = `${fallbackNum + 1} × ${fallbackNum}`;
    else if (typeFallback === 'num') fallback = `${fallbackNum * 5}`;
    else if (typeFallback === 'groups') fallback = `${fallbackNum + 3} groups`;
    else fallback = `${fallbackNum} + 1`;
    
    if (!uniqueOpts.includes(fallback) && fallback !== answer) {
      uniqueOpts.push(fallback);
    }
    fallbackNum++;
  }
  return shuffle(uniqueOpts).slice(0, 4);
}

function makeQuestion(type, groups, size, emoji, total) {
  switch (type) {
    case 'find_addition': {
      const correct = Array.from({ length: groups }, () => size).join(' + ');
      let wrong1 = Array.from({ length: size }, () => groups).join(' + ');
      if (wrong1 === correct) wrong1 = Array.from({ length: groups }, () => size + 1).join(' + ');
      const wrong2 = Array.from({ length: groups + 1 }, () => size).join(' + ');
      const wrong3 = `${groups} + ${size}`;
      return { answer: correct, options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'add') };
    }
    case 'find_multiplication': {
      const correct = `${groups} × ${size}`;
      let wrong1 = `${size} × ${groups + 1}`;
      let wrong2 = `${groups + 1} × ${size}`;
      let wrong3 = `${total} × 1`;
      return { answer: correct, options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'mult') };
    }
    case 'find_total': {
      const correct = `${total}`;
      const wrong1 = `${total + 1}`;
      let wrong2 = `${total - size}`;
      if (wrong2 === correct) wrong2 = `${total + 2}`;
      const wrong3 = `${groups + size}`;
      return { answer: correct, options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'num') };
    }
    case 'which_expression': {
      const addStr = Array.from({ length: groups }, () => size).join(' + ');
      const correct = `${groups} × ${size}`;
      let wrong1 = `${size} × ${groups + 1}`;
      let wrong2 = `${groups + 1} × ${size - 1 || 1}`;
      if (wrong2 === correct) wrong2 = `${groups + 2} × ${size}`;
      const wrong3 = `${total} + 0`;
      return { answer: correct, options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'mult') };
    }
    case 'count_groups': {
      const correct = `${groups} groups`;
      const wrong1 = `${groups + 1} groups`;
      let wrong2 = `${groups - 1 || 1} groups`;
      if (wrong2 === correct) wrong2 = `${groups + 2} groups`;
      let wrong3 = `${size} groups`;
      if (wrong3 === correct) wrong3 = `${size + 1} groups`;
      return { answer: correct, options: ensureFourUniqueOptions([correct, wrong1, wrong2, wrong3], correct, 'groups') };
    }
    case 'odd_one_out': {
      const correct_a = Array.from({ length: groups }, () => size).join(' + ');
      const correct_b = `${groups} × ${size}`;
      const correct_c = `${total}`;
      const wrong = `${groups} × ${size + 1}`;
      return { answer: wrong, options: ensureFourUniqueOptions([correct_a, correct_b, correct_c, wrong], wrong, 'mixed') };
    }
    default: return makeQuestion('find_total', groups, size, emoji, total);
  }
}

function generateQuestions() {
  const qs = [];
  for (let i = 0; i < 10000; i++) { // test many combinations
    const groups = Math.floor(Math.random() * 4) + 2;
    const size = Math.floor(Math.random() * 4) + 2;
    const emoji = '🍔';
    const total = groups * size;
    const type = PATTERNS[i % PATTERNS.length];
    qs.push(makeQuestion(type, groups, size, emoji, total));
  }
  return qs;
}

try {
  generateQuestions();
  console.log('SUCCESS');
} catch (e) {
  console.error('FAILED:', e);
}
