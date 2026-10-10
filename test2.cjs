const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });

  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/');

  try {
    console.log('Waiting for Play Phase Map View...');
    await page.waitForSelector('.world-card', { timeout: 10000 });
    
    console.log('Clicking Food Festival (World 1)...');
    await page.click('.world-card'); // clicks the first one

    await new Promise(r => setTimeout(r, 2000));
    
    const hasQuestion = await page.$('.question-text');
    if (hasQuestion) {
      console.log('SUCCESS: Question rendered perfectly!');
    } else {
      console.log('FAILED: Question did not render!');
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log('Body HTML:', bodyHTML.substring(0, 500) + '...');
    }
  } catch (e) {
    console.error('Test script error:', e);
  }

  await browser.close();
})();
