import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ position: 'relative' });
  const [phrase, setPhrase] = useState("I'm really sorry... Can we make up?");
  const [emoji, setEmoji] = useState("🥺");

  // For 3D Tilt effect
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const phrases = [
    "Wait, what?",
    "Are you sure?",
    "Think again! 🥺",
    "I'll be extra good! ✨",
    "Don't do this... 💔",
    "I'll give you cookies! 🍪",
    "Really? 😿",
    "I'll never do it again!",
    "Pllleeeeaaasssseeee??",
    "Is that your final answer?",
  ];

  const emojis = ["🥺", "😢", "😭", "😿", "💔", "🙏", "🧸"];

  const handleMouseMove = (e) => {
    if (!cardRef.current || accepted) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleNoDodge = () => {
    setNoCount(prev => prev + 1);
    
    // Jump to random position
    const padding = 100;
    const newX = Math.random() * (window.innerWidth - 150);
    const newY = Math.random() * (window.innerHeight - 100);
    
    setNoButtonPos({
      position: 'absolute',
      left: `${newX}px`,
      top: `${newY}px`,
    });

    // Update pleading state
    setPhrase(phrases[Math.min(noCount, phrases.length - 1)]);
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  };

  const handleYes = () => {
    setAccepted(true);
    
    // Confetti Fireworks
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Growing multiplier for Yes button
  const yesButtonScale = 1 + noCount * 0.15;

  return (
    <>
      <div className="bg-bubbles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="bubble" 
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}
      </div>

      <div className="container">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="apology-wrapper"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="card-wrapper"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div 
                ref={cardRef}
                className="card"
                style={{ 
                  rotateX, 
                  rotateY,
                  transformStyle: "preserve-3d" 
                }}
              >
                <div className="content-wrapper" style={{ transform: "translateZ(50px)" }}>
                  <motion.div 
                    className="emoji-container"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {emoji}
                  </motion.div>
                  <h1>{phrase}</h1>
                  <p>I promise to make it up to you! ❤️</p>
                  
                  <div className="button-group">
                    <motion.button 
                      className="btn primary"
                      onClick={handleYes}
                      style={{ scale: yesButtonScale }}
                      whileHover={{ scale: yesButtonScale + 0.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Yes
                    </motion.button>
                    <motion.button 
                      className="btn secondary btn-no"
                      style={noButtonPos}
                      onMouseOver={handleNoDodge}
                      onTouchStart={handleNoDodge}
                      initial={false}
                      animate={noButtonPos}
                    >
                      No
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              className="card success-card"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="content-wrapper">
                <div className="emoji-container">💖</div>
                <h1>Yay! I love you!</h1>
                <p>I knew you would forgive me. Let's get ice cream! 🍦</p>
                <motion.div 
                  className="hearts-decor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ✨ Just for you, my favorite human! ✨
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
