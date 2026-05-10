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
      className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-600/20 rounded-lg">
          <Bot className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">AI Intent Engine</h2>
          <p className="text-sm text-zinc-400">Describe your network issue in plain English</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="e.g. 'My movie keeps buffering every 5 minutes...'"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none h-32"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            type="submit"
            disabled={isLoading || !complaint.trim()}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <span>{isLoading ? 'Analyzing...' : 'Optimize'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((text, i) => (
            <button
              key={i}
              onClick={() => setComplaint(text)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition-colors"
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
