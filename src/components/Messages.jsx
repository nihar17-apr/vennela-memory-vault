import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Trash2, Heart } from 'lucide-react';
import { getMessages, addMessage, deleteMessage, toggleMessageHeart } from '../services/db';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      alert('Please write a message!');
      return;
    }

    setIsSubmitting(true);
    try {
      const message = {
        text: newMessage.trim(),
        senderName: senderName.trim() || 'Anonymous Friend',
        date: new Date().toISOString(),
        hearts: 0
      };

      await addMessage(message);
      await fetchMessages();
      setNewMessage('');
      setSenderName('');
    } catch (err) {
      console.error('Error adding message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      await fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleHeart = async (id) => {
    try {
      await toggleMessageHeart(id);
      await fetchMessages();
    } catch (err) {
      console.error('Error liking message:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <MessageCircle size={28} className="text-pink-500" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-800 dark:text-white">
            Messages for Vennela
          </h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Write your warmest wishes, funny memories, or heartfelt thoughts. Every message is special!
        </p>
      </motion.div>

      {/* Message Composer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-zinc-900/60 border border-pink-100 dark:border-zinc-800/50 rounded-2xl p-6 mb-8 shadow-lg shadow-pink-100/20 dark:shadow-black/20"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., Mom, Best Friend, Your Name..."
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/40 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              Your Message
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your warmest wishes, favorite memories, or anything you want Vennela to know... ✨"
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/40 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-600 dark:to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-300/40 dark:hover:shadow-pink-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </motion.div>

      {/* Messages Display */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-pink-200 dark:border-zinc-700/50"
          >
            <MessageCircle size={32} className="mx-auto text-pink-300 dark:text-pink-900 mb-3 opacity-50" />
            <p className="text-zinc-600 dark:text-zinc-400">
              No messages yet. Be the first to send one! 💌
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-zinc-900/60 border border-pink-100 dark:border-zinc-800/50 rounded-xl p-5 shadow-sm hover:shadow-lg hover:shadow-pink-100/20 dark:hover:shadow-black/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-white text-sm md:text-base">
                      {message.senderName}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {formatDate(message.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleHeart(message.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-xs font-medium"
                  >
                    <Heart size={14} fill={message.hearts > 0 ? 'currentColor' : 'none'} />
                    {message.hearts}
                  </button>
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {message.text}
                </p>

                <button
                  onClick={() => handleDelete(message.id)}
                  className="mt-4 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Stats Footer */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-white">{messages.length}</span> message{messages.length !== 1 ? 's' : ''} of love
            {messages.reduce((acc, m) => acc + (m.hearts || 0), 0) > 0 && (
              <> • <span className="font-semibold text-pink-500">{messages.reduce((acc, m) => acc + (m.hearts || 0), 0)}</span> hearts</>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
