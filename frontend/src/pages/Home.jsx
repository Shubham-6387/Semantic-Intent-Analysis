import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: Network, title: 'Dynamic Topology', desc: 'Real-time structural adaptation of CDN networks using NS-3 simulation.' },
    { icon: Zap, title: 'Zero-touch Operation', desc: 'Instantly execute QoS changes without manual configuration.' },
    { icon: Shield, title: 'Fail-safe Routing', desc: 'Automatically reroute traffic around congested or failed nodes.' },
    { icon: Cpu, title: 'Intent-driven AI', desc: 'NLP processing translates plain English into complex network parameters.' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden -mt-8 py-16">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 dark:bg-red-900/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900/10 dark:bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-zinc-150 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 mb-8 transition-colors duration-300">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-widest text-zinc-600 dark:text-zinc-300 uppercase">N-FLOW Platform v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            Intent-Based <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-indigo-500 to-purple-500">
              Network Optimization
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-650 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
            Translate natural language complaints into instant, intelligent network configurations. 
            N-FLOW automatically analyzes your intent, simulates changes in NS-3, and adapts your topology in real-time.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/engine')}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 focus:ring-offset-white dark:focus:ring-offset-zinc-950 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20" />
            <span className="relative flex items-center space-x-2">
              <span>Launch AI Engine</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-md">
              <feature.icon className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-zinc-900 dark:text-white font-bold mb-2 transition-colors duration-300">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-300">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
