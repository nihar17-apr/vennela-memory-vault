import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const ROMANTIC_QUOTES = [
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "You are my today and all of my tomorrows.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "To the world you may be one person, but to one person you are the world.",
  "In case you ever foolishly forget: I am never not thinking of you.",
  "If I had a flower for every time I thought of you... I could walk through my garden forever.",
  "You are the poem I never knew how to write, and this life is the story I always wanted to tell."
];

export default function QuotesDivider() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote on mount
    const randomIndex = Math.floor(Math.random() * ROMANTIC_QUOTES.length);
    setQuote(ROMANTIC_QUOTES[randomIndex]);
  }, []);

  return (
    <div className="relative py-24 my-12 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-gradient-to-r from-pink-100/20 to-purple-100/20 dark:from-pink-900/5 dark:to-purple-900/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl flex flex-col items-center gap-4"
      >
        <Heart size={20} className="text-pink-400 fill-pink-200/50 dark:fill-pink-900/30 animate-pulse" />
        
        <p className="text-xl md:text-2xl font-serif italic text-zinc-700 dark:text-zinc-300 font-light leading-relaxed select-none">
          "{quote}"
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-pink-300 dark:to-pink-700"></span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-pink-400 font-medium">Always & Forever</span>
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-pink-300 dark:to-pink-700"></span>
        </div>
      </motion.div>
    </div>
  );
}
