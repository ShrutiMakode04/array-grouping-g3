import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import { audioManager } from '../utils/audio';

const STORY_SCENES = [
  {
    image: '/assets/story/array_story_1.png',
    title: 'The Messy Seeds',
    text: "Sarah wants to plant a beautiful flower garden. But oh no! Her 12 flower seeds are all mixed up in a messy pile on the ground."
  },
  {
    image: '/assets/story/array_story_2.png',
    title: 'John Arrives',
    text: "Her friend John the Fox arrives. 'Wait Sarah! If we just throw them anywhere, it will be hard to count them later. Let's organize them!' he says."
  },
  {
    image: '/assets/story/array_story_3.png',
    title: 'Making Rows',
    text: "John helps Sarah put the seeds into equal groups. They make 3 rows, putting exactly 4 seeds in each row."
  },
  {
    image: '/assets/story/array_story_4.png',
    title: 'The Perfect Array',
    text: "They planted the seeds in a neat, perfect rectangle! 'This grid shape is called an Array,' says John. 'It makes things super easy to count.'"
  },
  {
    image: '/assets/story/array_story_5.png',
    title: 'The Magic Shortcut',
    text: "To find the total number of flowers, they use a magic shortcut called multiplication! 3 rows of 4 is the same as 3 × 4 = 12."
  }
];

export default function StoryPhase({ onNext }) {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    STORY_SCENES.forEach(scene => {
      if (scene.image) {
        const img = new Image();
        img.src = scene.image;
      }
    });
    return () => audioManager.stop();
  }, []);

  useEffect(() => {
    audioManager.play(`story_${sceneIndex + 1}`);
  }, [sceneIndex]);

  const handleNext = () => {
    if (sceneIndex < STORY_SCENES.length - 1) setSceneIndex(sceneIndex + 1);
    else onNext();
  };

  const handlePrev = () => {
    if (sceneIndex > 0) setSceneIndex(sceneIndex - 1);
  };

  const currentScene = STORY_SCENES[sceneIndex];

  return (
    <div className="story-phase" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '80vh', justifyContent: 'center' }}>
      
      {/* Phase Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Story Phase
        </h2>
      </div>

      {/* Main Split Card */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
        maxWidth: '1100px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 12px 50px rgba(0,0,0,0.6)',
        background: 'rgba(30, 40, 60, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: '450px'
      }}>
        
        {/* Left Side: Image (Only if exists) */}
        {currentScene.image && (
          <div style={{ flex: '0 0 45%', background: '#000', position: 'relative' }}>
            <img
              src={currentScene.image}
              alt={currentScene.title}
              key={currentScene.image}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                animation: 'fadeIn 0.5s ease'
              }}
              loading="eager"
            />
          </div>
        )}

        {/* Right Side: Text */}
        <div style={{ 
          flex: '1', 
          padding: currentScene.image ? '50px 40px' : '60px 80px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: currentScene.image ? 'flex-start' : 'center',
          textAlign: currentScene.image ? 'left' : 'center',
          position: 'relative' 
        }}>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: currentScene.image ? '2.4rem' : '3.2rem', 
            color: '#FFB74D', 
            margin: '0 0 24px 0',
            lineHeight: '1.2'
          }}>
            {currentScene.title}
          </h3>
          
          <p style={{ 
            fontSize: currentScene.image ? '1.3rem' : '1.8rem', 
            color: '#E0E0E0', 
            lineHeight: '1.7', 
            margin: 0,
            maxWidth: currentScene.image ? '100%' : '800px',
            animation: 'fadeIn 0.8s ease'
          }}>
            {currentScene.text}
          </p>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '40px', justifyContent: currentScene.image ? 'flex-start' : 'center', width: '100%' }}>
            {STORY_SCENES.map((_, i) => (
              <div key={i} style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i === sceneIndex ? '#FFB74D' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '95%', maxWidth: '1100px', marginTop: '25px' }}>
        <button 
          className="btn btn-outline" 
          onClick={handlePrev} 
          disabled={sceneIndex === 0} 
          style={{ opacity: sceneIndex === 0 ? 0 : 1, transition: 'opacity 0.3s', padding: '12px 24px', fontSize: '1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          style={{ padding: '12px 30px', fontSize: '1.3rem', background: '#FFB74D', color: '#000', border: 'none', fontWeight: 'bold' }}
        >
          {sceneIndex === STORY_SCENES.length - 1 ? <>To Simulator <Play size={20} /></> : <>Next <ArrowRight size={20} /></>}
        </button>
      </div>
    </div>
  );
}
