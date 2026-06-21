import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Moon, Sun, LogOut, LayoutDashboard, Image as ImageIcon, 
  Gift, Settings, Database, RefreshCw, Trash2 
} from 'lucide-react';
import { Mail } from "lucide-react";

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';
import BirthdaySection from './components/BirthdaySection';
import FloatingParticles from './components/FloatingParticles';

import Letter from "./components/Letter";
import SpecialMessage from "./components/SpecialMessage";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'gallery' | 'birthday' | 'settings'
  const [darkMode, setDarkMode] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase configurations in settings
  const [fbApiKey, setFbApiKey] = useState(localStorage.getItem('fb_apiKey') || '');
  const [fbProjectId, setFbProjectId] = useState(localStorage.getItem('fb_projectId') || '');
  const [fbBucket, setFbBucket] = useState(localStorage.getItem('fb_storageBucket') || '');

  // Check login session & theme on mount
  useEffect(() => {
    const session = sessionStorage.getItem('vennela_session');
    const storedUser = sessionStorage.getItem('vennela_user');
    if (session === 'active' && storedUser) {
      setIsLoggedIn(true);
      setCurrentUser(storedUser);
    }

    // Theme logic
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch memories when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchMemories();
    }
  }, [isLoggedIn]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const data = await getMemories(currentUser);
      setMemories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username) => {
    const normalizedUser = username.trim().toLowerCase();
    setIsLoggedIn(true);
    setCurrentUser(normalizedUser);
    sessionStorage.setItem('vennela_session', 'active');
    sessionStorage.setItem('vennela_user', normalizedUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    sessionStorage.removeItem('vennela_session');
    sessionStorage.removeItem('vennela_user');
  };

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const saveFirebaseSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('fb_apiKey', fbApiKey.trim());
    localStorage.setItem('fb_projectId', fbProjectId.trim());
    localStorage.setItem('fb_storageBucket', fbBucket.trim());
    alert('Firebase credentials saved! Reloading application to apply connection...');
    window.location.reload();
  };

  const clearFirebaseSettings = () => {
    if (confirm('Clear Firebase config and return to local browser storage?')) {
      localStorage.removeItem('fb_apiKey');
      localStorage.removeItem('fb_projectId');
      localStorage.removeItem('fb_storageBucket');
      localStorage.removeItem('fb_authDomain');
      localStorage.removeItem('fb_messagingSenderId');
      localStorage.removeItem('fb_appId');
      window.location.reload();
    }
  };

  const resetLocalSeeding = async () => {
    if (confirm('Reset memory database to default seeded wishes and polaroids? (This deletes manual uploads)')) {
      await resetLocalDatabase();
      fetchMemories();
    }
  };

  const showSettings = currentUser.toLowerCase() === 'nihar';

  useEffect(() => {
    if (!showSettings && activeTab === 'settings') {
      setActiveTab('dashboard');
    }
  }, [showSettings, activeTab]);

  return (
    <div className="min-h-screen text-zinc-800 dark:text-zinc-200 bg-gradient-to-tr from-pink-50/30 via-purple-50/30 to-pink-50/20 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 transition-colors duration-300">
      
      {/* Background canvas effects */}
      <FloatingParticles />

      <button
        onClick={toggleTheme}
        title={darkMode ? 'Light Mode' : 'Dark Mode'}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/85 dark:bg-zinc-950/85 border border-zinc-200/70 dark:border-zinc-800/70 text-zinc-700 dark:text-zinc-200 shadow-lg shadow-zinc-200/20 dark:shadow-black/20 transition-transform hover:-translate-y-0.5"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLoginSuccess={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col relative z-10"
          >
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-white/60 dark:border-zinc-900/40 px-6 py-4 shadow-sm shadow-pink-100/5 dark:shadow-none">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full text-pink-500 dark:text-pink-400">
                    <Heart size={16} fill="currentColor" className="animate-pulse" />
                  </div>
                  <span className="font-serif font-bold text-sm md:text-base tracking-tight text-zinc-850 dark:text-white">
                    Vennela's Memory Vault
                  </span>
                </div>

                {/* Tabs */}
                <nav className="hidden md:flex items-center bg-white/40 dark:bg-zinc-900/30 border border-zinc-250/20 dark:border-zinc-800/80 px-2 py-1 rounded-full text-xs font-semibold">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
                    { id: 'gallery', label: 'Memory Gallery', icon: <ImageIcon size={14} /> },
                    { id: 'birthday', label: 'Birthday Special', icon: <Gift size={14} /> },
                    { id: "letter", label: "Letters 📜" },
                    { id: "specialmessage", label: "Special Message 💌"},
                    showSettings && { id: 'settings', label: 'Vault Settings', icon: <Settings size={14} /> }
                  ].filter(Boolean).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors ${
                        activeTab === tab.id
                          ? 'bg-pink-400 dark:bg-pink-600 text-white shadow-sm'
                          : 'text-zinc-650 dark:text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>

                {/* User actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-full hover:bg-pink-50/50 dark:hover:bg-zinc-850/50 text-zinc-650 hover:text-rose-500 dark:text-zinc-450 dark:hover:text-rose-400 transition-all border border-transparent hover:border-pink-200/20"
                    title="Lock Vault"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </header>

            {/* Mobile Navigation bar */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-white/60 dark:border-zinc-850/40 rounded-full py-2 px-4 shadow-lg flex justify-around">
              {[
                { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
                { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Vault' },
                { id: 'birthday', icon: <Gift size={20} />, label: 'Cake' },
                { id: "letter", label: "Letter 📜" },
                showSettings && { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
              ].filter(Boolean).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-full transition-colors ${
                    activeTab === tab.id
                      ? 'text-pink-500 dark:text-pink-400 font-semibold'
                      : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[9px] uppercase tracking-wider scale-90">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Application Body */}
            <main className="flex-grow pb-24 md:pb-12">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                  <RefreshCw size={24} className="text-pink-500 animate-spin" />
                  <span className="text-xs text-zinc-500 font-medium">Unlocking memory vault...</span>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'dashboard' && (
                      <Dashboard memories={memories} onNavigate={setActiveTab} />
                    )}
                    
                    {activeTab === 'gallery' && (
                      <Gallery memories={memories} onRefresh={fetchMemories} currentUser={currentUser} />
                    )}
                    
                    {activeTab === 'birthday' && (
                      <BirthdaySection />
                    )}
                    {activeTab === "letter" && <Letter />}
                    {activeTab === 'specialmessage' && (
  <SpecialMessage />
)}

                    {activeTab === 'settings' && (
                      <div className="w-full max-w-2xl mx-auto px-4 py-8">
                        <div className="bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl border border-white/60 dark:border-zinc-850/40 p-8 rounded-3xl shadow-sm text-left">
                          
                          <h2 className="text-2xl font-serif font-black text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                            <Settings size={22} className="text-pink-500" /> Vault Controls & Settings
                          </h2>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                            Configure Firebase storage connections to enable global photo sharing, or reset the local database seeds.
                          </p>

                          {/* Database Status indicator */}
                          <div className="flex items-center gap-3 bg-pink-100/30 dark:bg-zinc-900/40 border border-pink-200/20 dark:border-zinc-800 p-4 rounded-2xl mb-8">
                            <Database size={24} className="text-pink-500 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Current Database Mode:
                              </span>
                              <span className="ml-1.5 text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                                {isFirebaseConfigured ? 'Firebase Global Storage' : 'Local Browser Fallback (Mock DB)'}
                              </span>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                                {isFirebaseConfigured 
                                  ? 'All photos, videos, and hearts are actively synced across devices.' 
                                  : 'Data is stored securely on this browser only. Upload base64 strings or connect to Firebase below.'}
                              </p>
                            </div>
                          </div>

                          {/* Firebase config Form */}
                          <form onSubmit={saveFirebaseSettings} className="space-y-4 mb-8 border-b border-zinc-200/50 dark:border-zinc-800/80 pb-8">
                            <h3 className="text-sm font-bold text-zinc-750 dark:text-zinc-250">
                              Connect to Custom Firebase Storage
                            </h3>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                  Firebase API Key
                                </label>
                                <input
                                  type="password"
                                  placeholder="AIzaSy..."
                                  value={fbApiKey}
                                  onChange={(e) => setFbApiKey(e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-900"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                    Project ID
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="my-memory-vault"
                                    value={fbProjectId}
                                    onChange={(e) => setFbProjectId(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-900"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                    Storage Bucket URL
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="my-memory-vault.appspot.com"
                                    value={fbBucket}
                                    onChange={(e) => setFbBucket(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-900"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-semibold rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform"
                              >
                                Save Configuration
                              </button>
                              { (fbApiKey || fbProjectId || fbBucket) && (
                                <button
                                  type="button"
                                  onClick={clearFirebaseSettings}
                                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold rounded-full border border-zinc-255/10 transition-colors"
                                >
                                  Disconnect Firebase
                                </button>
                              )}
                            </div>
                          </form>

                          {/* Database Reset Action */}
                          <div>
                            <h3 className="text-sm font-bold text-zinc-750 dark:text-zinc-250 mb-3">
                              Reset & Database Restores
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4">
                              Use these settings to restore the default polaroid slides or delete all cache elements.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={resetLocalSeeding}
                                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-800 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-full hover:bg-pink-50/50 dark:hover:bg-zinc-800/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                <RefreshCw size={12} /> Reset to Defaults
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Audio Controls */}
    </div>
  );
}
