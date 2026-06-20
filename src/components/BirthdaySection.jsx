import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdaySection() {
  const [candlesLit, setCandlesLit] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wishesBlown, setWishesBlown] = useState(false);

  const handleBlowCandles = () => {
    setCandlesLit(false);
    setShowCelebration(true);
    setWishesBlown(true);

    // Launch spectacular confetti burst!
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 40, spread: 360, ticks: 80, zIndex: 100 };

    // Stop the celebration overlay after the animation finishes
    setTimeout(() => {
      setShowCelebration(false);
    }, duration);

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 100 * (timeLeft / duration) + 40;

      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() * 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() * 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount: particleCount * 0.6, origin: { x: randomInRange(0.4, 0.6), y: 0 } }));
    }, 200);
  };

  const handleResetCake = () => {
    setCandlesLit(true);
    setShowCakeConfetti(false);
  };

  // Scrapbook milestones
  const milestones = [
    {
      title: 'When Our Paths Crossed',
      desc: 'The day the universe made a perfect plan and brought you into my life. The world has felt warmer ever since.',
      date: 'June 2024'
    },
    {
      title: 'Our First Deep Laughs',
      desc: 'Discovering how perfectly our senses of humor match. Sharing jokes that only the two of us would ever understand.',
      date: 'October 2024'
    },
    {
      title: 'Supporting Each Other',
      desc: 'Through busy schedules, late night study sessions, and stressful days. You became my comfort and strength.',
      date: 'February 2025'
    },
    {
      title: 'To a Million More Memories',
      desc: 'Looking forward to building, laughing, dreaming, and celebrating every milestone by your side.',
      date: 'Today & Beyond'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
      
      {/* 1. Interactive Birthday Cake Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl border border-white/60 dark:border-zinc-850/40 p-8 rounded-3xl shadow-sm text-center mb-16 flex flex-col items-center"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-pink-500 bg-pink-100/50 dark:bg-pink-950/40 px-3 py-1 rounded-full border border-pink-200/20 mb-6 flex items-center gap-1.5 animate-pulse">
          <Gift size={12} /> Make a Wish!
        </span>

        <h2 className="text-3xl font-serif font-black text-zinc-800 dark:text-white mb-2">
          Vennela's Birthday Cake
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs leading-relaxed">
          {candlesLit 
            ? "Close your eyes, make a silent wish, and click the button to blow out the candles!"
            : "Your wishes have been sent to the stars! ✨"}
        </p>

        {/* SVG Cake Container */}
        <div className="relative w-64 h-64 mb-8">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Cake Plate */}
            <ellipse cx="100" cy="165" rx="75" ry="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <ellipse cx="100" cy="167" rx="73" ry="13" fill="#e2e8f0" />

            {/* Bottom Layer */}
            <path d="M 35,125 A 65,12 0 0,0 165,125 L 165,160 A 65,12 0 0,1 35,160 Z" fill="#fbcfe8" />
            <path d="M 35,125 A 65,12 0 0,0 165,125" fill="none" stroke="#f472b6" strokeWidth="1" />
            
            {/* Middle Layer (Frosting Drips) */}
            <path d="M 35,125 Q 45,133 55,125 Q 65,135 75,125 Q 85,135 95,125 Q 105,133 115,125 Q 125,135 135,125 Q 145,135 155,125 Q 160,128 165,125 L 165,135 A 65,12 0 0,1 35,135 Z" fill="#f472b6" />

            {/* Top Layer */}
            <path d="M 45,95 A 55,10 0 0,0 155,95 L 155,125 A 55,10 0 0,1 45,125 Z" fill="#fdf2f8" />
            
            {/* Top Frosting Drips */}
            <path d="M 45,95 Q 55,102 65,95 Q 75,104 85,95 Q 95,104 105,95 Q 115,102 125,95 Q 135,104 145,95 L 155,95 L 155,103 A 55,10 0 0,1 45,103 Z" fill="#fbcfe8" />
            
            {/* Fruits/Toppings */}
            <circle cx="60" cy="94" r="5" fill="#f43f5e" />
            <circle cx="80" cy="96" r="5" fill="#ec4899" />
            <circle cx="100" cy="97" r="5" fill="#f43f5e" />
            <circle cx="120" cy="96" r="5" fill="#ec4899" />
            <circle cx="140" cy="94" r="5" fill="#f43f5e" />

            {/* Candles & Flames */}
            {[
              { x: 70, y: 70 },
              { x: 100, y: 67 },
              { x: 130, y: 70 }
            ].map((cand, idx) => (
              <g key={idx}>
                {/* Candle body */}
                <rect x={cand.x - 2} y={cand.y} width="4" height="25" fill="#a78bfa" rx="1" />
                <path d={`M ${cand.x - 2},${cand.y + 6} L ${cand.x + 2},${cand.y + 10}`} stroke="#ffffff" strokeWidth="1.5" />
                <path d={`M ${cand.x - 2},${cand.y + 14} L ${cand.x + 2},${cand.y + 18}`} stroke="#ffffff" strokeWidth="1.5" />
                
                {/* Wick */}
                <line x1={cand.x} y1={cand.y} x2={cand.x} y2={cand.y - 4} stroke="#475569" strokeWidth="1" />
                
                {/* Flame */}
                {candlesLit && (
                  <motion.g
                    animate={{ 
                      scale: [1, 1.15, 0.95, 1.1, 1],
                      y: [0, -1, 1, -0.5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.6 + idx * 0.1, 
                      ease: "easeInOut" 
                    }}
                  >
                    {/* Flame Outer Glow */}
                    <path 
                      d={`M ${cand.x},${cand.y - 4} Q ${cand.x - 5},${cand.y - 12} ${cand.x},${cand.y - 18} Q ${cand.x + 5},${cand.y - 12} ${cand.x},${cand.y - 4} Z`} 
                      fill="#f97316" 
                      opacity="0.6" 
                    />
                    {/* Inner Flame */}
                    <path 
                      d={`M ${cand.x},${cand.y - 4} Q ${cand.x - 3},${cand.y - 9} ${cand.x},${cand.y - 14} Q ${cand.x + 3},${cand.y - 9} ${cand.x},${cand.y - 4} Z`} 
                      fill="#eab308" 
                    />
                    {/* Core Light */}
                    <circle cx={cand.x} cy={cand.y - 6} r="1.5" fill="#ffffff" />
                  </motion.g>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Blow Action */}
        <AnimatePresence mode="wait">
          {candlesLit ? (
            <motion.button
              key="blow-btn"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={handleBlowCandles}
              className="px-8 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs"
            >
              Blow Out Candles! 🎂💨
            </motion.button>
          ) : (
            <motion.button
              key="reset-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleResetCake}
              className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-full transition-all"
            >
              Light Candles Again 🕯️
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-xl w-full rounded-3xl border border-white/30 bg-white/95 dark:bg-zinc-950/95 p-8 shadow-2xl shadow-pink-500/20 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4 text-pink-500">
                <Sparkles size={28} className="animate-pulse" />
                <Sparkles size={28} className="animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-serif font-black text-zinc-950 dark:text-white mb-3">
                Celebrate! 🎉
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                You blew out the candles and unlocked a joyful celebration. Let the happiness shine across the whole screen!
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-pink-500/30 hover:bg-pink-400 transition-all"
              >
                Close Celebration
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
