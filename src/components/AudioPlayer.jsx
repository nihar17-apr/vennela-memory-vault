import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, ChevronUp } from 'lucide-react';

const TRACKS = [
  {
    name: 'Tender Love (Piano)',
    url: '/audio/track-1.wav'
  },
  {
    name: 'Beautiful Dream (Piano)',
    url: '/audio/track-2.wav'
  },
  {
    name: 'Sweet Love (Guitar)',
    url: '/audio/track-3.wav'
  }
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check local storage for initial settings
    const storedPlayState = localStorage.getItem('music_playing');
    const storedVolume = localStorage.getItem('music_volume');
    const storedTrackIndex = localStorage.getItem('music_track_index');

    if (storedVolume) setVolume(parseFloat(storedVolume));
    if (storedTrackIndex) setCurrentTrackIndex(parseInt(storedTrackIndex, 10));

    // Audio element setup
    audioRef.current = new Audio(TRACKS[currentTrackIndex].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    if (storedPlayState === 'true') {
      // Browsers restrict auto-play, so we wait for user interaction
      const startPlay = () => {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => console.log('Autoplay blocked. Waiting for user input.', err));
        window.removeEventListener('click', startPlay);
      };
      window.addEventListener('click', startPlay);
      return () => window.removeEventListener('click', startPlay);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update track source
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;
    audioRef.current.pause();
    
    audioRef.current = new Audio(TRACKS[currentTrackIndex].url);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    if (wasPlaying) {
      audioRef.current.play().catch(err => console.log(err));
    }
    localStorage.setItem('music_track_index', currentTrackIndex);
  }, [currentTrackIndex]);

  // Adjust volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    localStorage.setItem('music_volume', volume);
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('music_playing', 'false');
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem('music_playing', 'true');
      }).catch(err => console.log(err));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {showTracks && (
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-pink-200/50 dark:border-zinc-800/50 p-2.5 rounded-2xl shadow-xl w-56 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 px-2 flex items-center gap-1.5">
            <Music size={12} className="animate-spin-slow" /> Select Theme Music
          </p>
          <div className="h-[1px] bg-pink-100 dark:bg-zinc-800/80 my-1"></div>
          {TRACKS.map((track, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setShowTracks(false);
              }}
              className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-all ${
                currentTrackIndex === idx
                  ? 'bg-pink-100/80 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium'
                  : 'hover:bg-pink-50/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-white/40 dark:border-zinc-800/40 px-4 py-2.5 rounded-full shadow-lg shadow-pink-200/10 dark:shadow-none transition-all hover:scale-105 hover:bg-white/60 dark:hover:bg-zinc-950/60">
        <button
          onClick={() => setShowTracks(!showTracks)}
          className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
          title="Choose track"
        >
          <ChevronUp size={16} className={`transition-transform duration-300 ${showTracks ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={togglePlay}
          className="bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-500 dark:to-rose-500 text-white p-2 rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="translate-x-[0.5px]" />}
        </button>

        <div className="flex items-center gap-1.5 border-l border-zinc-300/30 pl-2">
          <button
            onClick={toggleMute}
            className="text-zinc-600 dark:text-zinc-400 hover:text-pink-500 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-400 dark:accent-pink-500"
          />
        </div>

        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3.5 w-4 pl-1">
            <span className="w-[2px] bg-pink-500 rounded-full animate-audio-bar-1"></span>
            <span className="w-[2px] bg-pink-500 rounded-full animate-audio-bar-2"></span>
            <span className="w-[2px] bg-pink-500 rounded-full animate-audio-bar-3"></span>
          </div>
        )}
      </div>
    </div>
  );
}
