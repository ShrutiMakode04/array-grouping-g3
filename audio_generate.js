import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Simple dotenv parser
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
} catch (e) {
  console.log('No .env file found or error reading it.');
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('ERROR: Please set your ELEVENLABS_API_KEY in the .env file.');
  process.exit(1);
}

const VOICE_ID_ALICE = 'Xb7hH8MSUJpSbSDYk0k2';
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public', 'assets', 'audio');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------------------------------------------------------
// TEXT ASSETS
// ---------------------------------------------------------
const audioAssets = [
  // Welcome
  { key: 'welcome_intro', text: "Multiplication with Arrays, and Grouping. Join Sarah, and John, in the Magic Garden. Learn how to arrange objects, in neat grids, to multiply fast!" },

  // Wonder
  { key: 'wonder_intro', text: "Wonder Phase. Have you ever seen things, arranged in a perfect grid? Sarah wants to plant, 12 seeds. Instead of placing them randomly, she makes an ARRAY: 3 rows, of 4. We can find the total, using a magic shortcut: Multiplication! 3, times 4, equals 12. I'm John! An array is a neat grid. Just multiply rows, by columns!" },

  // Story (Slower pace applied via settings)
  { key: 'story_1', text: "The Messy Seeds. Sarah wants to plant a beautiful flower garden. But oh no! Her 12 flower seeds are all mixed up in a messy pile on the ground." },
  { key: 'story_2', text: "John Arrives. Her friend John the Fox arrives. 'Wait Sarah! If we just throw them anywhere, it will be hard to count them later. Let's organize them!' he says." },
  { key: 'story_3', text: "Making Rows. John helps Sarah put the seeds into equal groups. They make 3 rows, putting exactly 4 seeds in each row." },
  { key: 'story_4', text: "The Perfect Array. They planted the seeds in a neat, perfect rectangle! 'This grid shape is called an Array,' says John. 'It makes things super easy to count.'" },
  { key: 'story_5', text: "The Magic Shortcut. To find the total number of flowers, they use a magic shortcut called multiplication! 3 rows of 4 is the same as 3 times 4 equals 12." },

  // Simulate
  { key: 'sim_1', text: "Click the grid to make an array with 3 rows and 4 columns!" },
  { key: 'sim_2', text: "Rows go side-to-side. Columns go up-and-down. Click each to highlight it!" },
  { key: 'sim_3', text: "These 15 balloons are messy! Group them into a perfect array." },
  { key: 'sim_4', text: "Assemble a 4 by 3 array of robots! Add them row by row." },
  { key: 'sim_5', text: "Arrays can be rotated! Turn the 2 by 4 array to see what happens." },
  { key: 'sim_6', text: "A true array has no missing spots. Fill in the empty holes to complete the 3 by 3 grid!" },

  // Play
  { key: 'play_intro', text: "Play Phase. Select a World to Play." },
  { key: 'play_correct', text: "Correct." },
  { key: 'play_wrong', text: "Wrong." },

  // Reflect
  { key: 'reflect_intro', text: "Reflect Phase. You've mastered arrays! 3 rows of 4 apples equals 12 apples. Ready to become an Array Master? Claim your certificate! Master Array Builder. You finished all phases!" }
];

async function generateAudio(asset) {
  const filePath = path.join(OUTPUT_DIR, `${asset.key}.mp3`);
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${asset.key}.mp3 - already exists.`);
    return;
  }

  console.log(`Generating ${asset.key}.mp3...`);

  // Story phases use slower speaking rate (via SSML prosody or slightly less stability)
  // We'll use SSML for precise control if the voice supports it, or just plain text.
  // ElevenLabs generally prefers plain text with punctuation for pacing.
  const isStory = asset.key.startsWith('story_');
  
  const payload = JSON.stringify({
    text: asset.text,
    model_id: "eleven_turbo_v2_5", 
    voice_settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      style: 0.0,
      use_speaker_boost: false
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${VOICE_ID_ALICE}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', chunk => errData += chunk);
        res.on('end', () => reject(new Error(`API Error ${res.statusCode}: ${errData}`)));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved ${asset.key}.mp3`);
        resolve();
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function run() {
  // Force delete files to regenerate with new settings
  try { fs.rmSync(OUTPUT_DIR, { recursive: true, force: true }); } catch(e){}
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const asset of audioAssets) {
    try {
      await generateAudio(asset);
      // Wait a bit to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`Failed to generate ${asset.key}:`, e.message);
    }
  }
  console.log('Finished generating audio assets!');
}

run();
