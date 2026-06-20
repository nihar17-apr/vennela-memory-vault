import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Image as ImageIcon, Sparkles, Flame } from 'lucide-react';

const TYPING_MESSAGES = [
  "You make the world a infinitely brighter and softer place.",
  "Here is to all the laughter, the quiet sunsets, and the beautiful memories we share.",
  "You are my favorite thought, my safest place, and my greatest adventure.",
  "Welcome to your personal memory box. Tap anywhere to begin exploring..."
];

export default function Dashboard({ memories, onNavigate }) {
  const [typedText, setTypedText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    let timer;
    const currentMessage = TYPING_MESSAGES[messageIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 30);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 70);
    }

    if (!isDeleting && charIndex === currentMessage.length) {
      // Pause at full message
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setMessageIndex((prev) => (prev + 1) % TYPING_MESSAGES.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, messageIndex]);

  // Calculations for stats
  const totalMemories = memories.length;
  const totalHearts = memories.reduce((acc, curr) => acc + (curr.hearts || 0), 0);
  
  // Calculate days since birth date: June 28, 2006
  const getDaysOfHappiness = () => {
    const startDate = new Date('2006-06-28T00:00:00');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Curate 4 collage photos (prefer type === 'image')
  const collagePhotos = memories
    .filter((m) => m.type === 'image' && m.url)
    .slice(0, 4);

  // Fallbacks if user deleted all seeds
  const defaultCollage = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
      
      {/* Hero Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative inline-block mb-4"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 dark:from-pink-600 dark:via-purple-600 dark:to-rose-600 rounded-full blur opacity-40 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif font-black text-zinc-800 dark:text-white tracking-tight mb-4"
        >
          Happy Birthday Vennela ❤️
        </motion.h1>

        {/* Typing message */}
        <div className="h-12 flex items-center justify-center max-w-xl">
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light italic leading-relaxed">
            {typedText}
            <span className="inline-block w-[2px] h-4 bg-pink-500 ml-0.5 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
        {[
          {
            title: 'Days of Happiness',
            val: getDaysOfHappiness(),
            icon: <Flame size={20} className="text-amber-500" />,
            color: 'from-amber-100/50 to-orange-100/50 dark:from-amber-950/20 dark:to-orange-950/20'
          },
          {
            title: 'Memory Vaults Saved',
            val: 15,
            icon: <ImageIcon size={20} className="text-pink-500" />,
            color: 'from-pink-100/50 to-rose-100/50 dark:from-pink-950/20 dark:to-rose-950/20'
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * idx }}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/60 dark:border-zinc-800/40 p-6 rounded-3xl shadow-md flex items-center justify-between hover:scale-[1.02] transition-transform`}
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-mono font-black text-zinc-800 dark:text-white">
                {stat.val}
              </h3>
            </div>
            <div className="bg-white/95 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-3.5 rounded-2xl shadow-inner">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-r from-pink-100/40 via-purple-100/40 to-pink-100/40 dark:from-zinc-900/40 dark:via-purple-950/20 dark:to-zinc-900/40 backdrop-blur-xl border border-white/60 dark:border-zinc-800/40 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center max-w-3xl mx-auto"
      >
        <h3 className="text-xl font-serif font-bold text-zinc-800 dark:text-zinc-200 mb-2">
          Ready to dive into your memories?
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
          Open the memory galleries, download files, view documents, or blow out your birthday candles.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('gallery')}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-500 dark:to-rose-500 text-white text-xs font-semibold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ImageIcon size={14} /> View Memory Gallery
          </button>
          <button
            onClick={() => onNavigate('birthday')}
            className="px-6 py-2.5 bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-800 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-full hover:bg-pink-50/50 dark:hover:bg-zinc-800/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="animate-spin-slow" /> Birthday Special
          </button>
        </div>
      </motion.div>
      
    </div>
  );
}
