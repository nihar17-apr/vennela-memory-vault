import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Heart, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown logic for June 28
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(`June 28, ${currentYear} 00:00:00`);

      // If June 28 has passed this year, count down to next year
      if (now > targetDate) {
        targetDate = new Date(`June 28, ${currentYear + 1} 00:00:00`);
      }

      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const isVennela = normalizedUsername === 'Vennela' && normalizedPassword === '28062006';
    const isNihar = normalizedUsername === 'nihar' && normalizedPassword === '17042006';

    if (isVennela || isNihar) {
      const userLabel = isVennela ? 'Vennela' : 'Nihar';

      // Fire confetti burst!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff85a1', '#ffb3c1', '#f7aef8', '#b388ff', '#fff']
      });

      // Stagger callback to allow confetti to start
      setTimeout(() => {
        onLoginSuccess(userLabel);
      }, 800);
    } else {
      setError('Incorrect username or passcode.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden bg-gradient-to-tr from-pink-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-900 z-10">
      
      {/* Decorative blurred background lights */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title / Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent mb-2">
          Vennela's Memory Vault
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base font-light tracking-wide max-w-sm mx-auto">
          A premium archive of our sweet moments, letters, and memories.
        </p>
      </motion.div>

      {/* Countdown Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/50 dark:border-zinc-800/40 p-5 rounded-2xl shadow-lg mb-6 text-center z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-3 text-pink-500 dark:text-pink-400">
          <Calendar size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest font-mono">Countdown to June 28</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Mins', val: timeLeft.minutes },
            { label: 'Secs', val: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="bg-pink-100/40 dark:bg-zinc-850/40 rounded-xl p-2 border border-pink-200/20 dark:border-zinc-800/40">
              <span className="block text-2xl md:text-3xl font-mono font-bold text-zinc-800 dark:text-pink-300">
                {padZero(item.val)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/45 dark:bg-zinc-900/45 backdrop-blur-xl border border-white/60 dark:border-zinc-850/60 p-8 rounded-3xl shadow-xl shadow-pink-100/20 dark:shadow-none z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 dark:text-pink-400 mb-3 shadow-inner">
            <Heart size={30} className="fill-pink-400/30 animate-pulse" />
          </div>
          <h2 className="text-xl font-serif text-zinc-800 dark:text-zinc-200 font-medium">Unlock the Vault</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter Vennela's secret credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 pl-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                required
                className="w-full pl-10 pr-4 py-3 bg-white text-black border border-pink-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 pl-1">
              Secret Passcode
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl text-zinc-800 dark:text-zinc-250 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-900/50 focus:border-pink-400 transition-all text-sm"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-rose-500 font-medium pl-1 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 dark:from-pink-500 dark:via-rose-500 dark:to-purple-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:shadow-pink-400/20 dark:hover:shadow-none hover:scale-[1.01] active:scale-[0.99] transition-all text-sm mt-2 flex items-center justify-center gap-2"
          >
            <span>Unlock Vault</span>
            <Heart size={16} fill="white" className="animate-bounce" />
          </button>
        </form>
      </motion.div>

      {/* Small footer */}
      <div className="mt-8 text-[11px] text-zinc-400/80 dark:text-zinc-500 font-mono tracking-wider z-10 flex flex-col items-center">
        <span>Made with love for a very special person</span>
      </div>
    </div>
  );
}
