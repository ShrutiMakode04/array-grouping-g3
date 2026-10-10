const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Listen to console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });

  console.log('Navigating to local server...');
  await page.goto('http://localhost:5173/');

  // Click through welcome, wonder, story
  console.log('Clicking through phases...');
  try {
    await page.waitForSelector('.start-btn', { timeout: 10000 });
    await page.click('.start-btn');
    
    await page.waitForSelector('.btn-primary', { timeout: 5000 });
    await page.click('.btn-primary'); // Wonder Phase next
    
    // Story Phase
    for (let i = 0; i < 5; i++) {
      await page.waitForSelector('.btn-primary');
      await page.click('.btn-primary');
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Simulate Phase
    for (let i = 0; i < 6; i++) {
      // Click interact buttons until complete
      while (true) {
        try {
          const btn = await page.$('.btn-primary');
          if (!btn) break; // Might be + signs in Sim 6
          
          const text = await page.evaluate(el => el.textContent, btn);
          if (text.includes('Next Simulation') || text.includes('To the Quest Map!')) {
            await btn.click();
            await new Promise(r => setTimeout(r, 1000));
            break;
          } else {
            await btn.click();
            await new Promise(r => setTimeout(r, 500));
          }
        } catch (e) {
          // For Sim 6, click the plus signs
          const plusSigns = await page.$$('span');
          for (const span of plusSigns) {
            const txt = await page.evaluate(el => el.textContent, span);
            if (txt === '+') {
              try { await span.click(); } catch(e){}
            }
          }
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    console.log('Waiting for Play Phase...');
    await page.waitForSelector('.world-card', { timeout: 10000 });
    console.log('Clicking Food Festival...');
    await page.click('.world-card'); // Click first world

    await new Promise(r => setTimeout(r, 2000));
    
    // Check if playing view rendered
    const hasQuestion = await page.$('.question-text');
    if (hasQuestion) {
      console.log('SUCCESS: Question rendered perfectly!');
    } else {
      console.log('FAILED: Question did not render!');
    }
  } catch (e) {
    console.error('Test script error:', e);
  }

  await browser.close();
})();
