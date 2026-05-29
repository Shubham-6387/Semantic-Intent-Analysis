import { useState } from 'react';
import { Send, Bot, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplaintBox({ onSubmit, isLoading }) {
  const [complaint, setComplaint] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (complaint.trim() && !isLoading) {
      onSubmit(complaint);
    }
  };

  const templates = [
    "Netflix is buffering constantly",
    "Video is lagging and dropping frames",
    "Internet feels very slow during streaming"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-600/10 dark:bg-red-600/20 rounded-lg">
          <Bot className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-wide transition-colors">AI Intent Engine</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors">Describe your network issue in plain English</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="e.g. 'My movie keeps buffering every 5 minutes...'"
          className="w-full bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-zinc-900 dark:text-white placeholder-zinc-450 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none h-32"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            type="submit"
            disabled={isLoading || !complaint.trim()}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-750 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            <span>{isLoading ? 'Analyzing...' : 'Optimize'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-xs font-semibold text-zinc-550 dark:text-zinc-500 mb-2 uppercase tracking-wider">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((text, i) => (
            <button
              key={i}
              onClick={() => setComplaint(text)}
              className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-zinc-200 dark:border-transparent"
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
