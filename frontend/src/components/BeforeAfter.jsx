import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BeforeAfter({ before, after }) {
  if (!before || !after) return null;

  const features = [
    { label: 'Quality', b: before.quality, a: after.quality },
    { label: 'Bandwidth', b: before.bandwidth, a: after.bandwidth },
    { label: 'Throughput', b: before.throughput, a: after.throughput },
    { label: 'Latency', b: before.latency, a: after.latency },
    { label: 'Packet Loss', b: before.packetLoss, a: after.packetLoss },
    { label: 'Jitter', b: before.jitter, a: after.jitter },
    { label: 'Priority', b: before.priority, a: after.priority },
    { label: 'Congestion', b: before.congestion, a: after.congestion },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex">
        <div className="flex-1 p-6 border-r border-zinc-200 dark:border-zinc-800 bg-red-500/5 dark:bg-red-950/10 transition-colors duration-300">
          <h3 className="text-red-500 font-bold mb-4 flex items-center space-x-2">
            <XCircle className="w-5 h-5" />
            <span>Before Optimization</span>
          </h3>
          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i}>
                <p className="text-xs text-zinc-500 mb-1">{f.label}</p>
                <p className="text-zinc-700 dark:text-zinc-300 font-medium transition-colors duration-300">{f.b}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 p-6 bg-green-500/5 dark:bg-green-950/10 transition-colors duration-300">
          <h3 className="text-green-500 font-bold mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>After Optimization</span>
          </h3>
          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i}>
                <p className="text-xs text-zinc-500 mb-1">{f.label}</p>
                <motion.p 
                  initial={{ scale: 0.9, color: '#a1a1aa' }}
                  animate={{ scale: 1, color: '#22c55e' }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="font-bold"
                >
                  {f.a}
                </motion.p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
