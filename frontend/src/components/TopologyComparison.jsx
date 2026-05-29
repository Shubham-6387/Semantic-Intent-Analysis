import { CheckCircle, ShieldAlert, Award, TrendingUp, Layers, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopologyComparison({ theme }) {
  const topologies = [
    {
      name: 'Tree Topology (Netflix CDN)',
      icon: Layers,
      color: 'blue',
      throughput: '23.5 Mbps',
      latency: '6.8 ms',
      loss: '0.05%',
      jitter: '1.4 ms',
      ratings: {
        streaming: 5,
        scalability: 5,
        faultTolerance: 3,
        management: 4
      },
      rank: 1,
      pros: ['Excellent OTT/CDN streaming', 'Clustered traffic distribution', 'Low network packet overhead'],
      cons: ['Auth server single point of failure', 'Complex intermediate routing levels']
    },
    {
      name: 'Partial Mesh Topology',
      icon: TrendingUp,
      color: 'green',
      throughput: '19.8 Mbps',
      latency: '8.1 ms',
      loss: '0.01%',
      jitter: '0.9 ms',
      ratings: {
        streaming: 4,
        scalability: 4,
        faultTolerance: 5,
        management: 3
      },
      rank: 2,
      pros: ['Exceptional fault tolerance', 'Multi-path redundant routing', 'Extremely resilient to link failures'],
      cons: ['Highly complex physical cabling', 'Increased routing overhead delays']
    },
    {
      name: 'Star Topology',
      icon: Award,
      color: 'purple',
      throughput: '15.2 Mbps',
      latency: '20.5 ms',
      loss: '2.8%',
      jitter: '4.5 ms',
      ratings: {
        streaming: 2,
        scalability: 2,
        faultTolerance: 1,
        management: 5
      },
      rank: 3,
      pros: ['Centralized traffic management', 'Simple single-hop configurations', 'Easy node additions'],
      cons: ['Central hub congestion bottleneck', 'Zero fault tolerance if router fails']
    }
  ];

  const renderStars = (score) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full ${
              i < score ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : (theme === 'light' ? 'bg-zinc-200' : 'bg-zinc-800')
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8 mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-12 transition-colors duration-300"
    >
      <header>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 transition-colors duration-300">Topology Comparative Analytics Engine</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-3xl transition-colors duration-300">
          Side-by-side performance assessment compiled from active NS-3 50-node simulation iterations.
        </p>
      </header>

      {/* Grid Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {topologies.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm flex flex-col justify-between shadow-sm dark:shadow-none transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600/60 to-red-900/60"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white tracking-wide text-sm transition-colors duration-300">{t.name}</h3>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/10 border border-red-500/20 text-xs font-bold text-red-500">
                    #{t.rank}
                  </div>
                </div>

                {/* Ratings Progress */}
                <div className="space-y-3 border-b border-zinc-150 dark:border-zinc-800/80 pb-6 mb-6 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">CDN Streaming</span>
                    {renderStars(t.ratings.streaming)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Scalability</span>
                    {renderStars(t.ratings.scalability)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Fault Tolerance</span>
                    {renderStars(t.ratings.faultTolerance)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Traffic Control</span>
                    {renderStars(t.ratings.management)}
                  </div>
                </div>

                {/* Telemetry Snapshot */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl text-center transition-colors duration-300">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Throughput</p>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm transition-colors duration-300">{t.throughput}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl text-center transition-colors duration-300">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Avg Latency</p>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm transition-colors duration-300">{t.latency}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl text-center transition-colors duration-300">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Packet Loss</p>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm transition-colors duration-300">{t.loss}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-850 p-3 rounded-xl text-center transition-colors duration-300">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Jitter</p>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm transition-colors duration-300">{t.jitter}</p>
                  </div>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-4 border-t border-zinc-150 dark:border-zinc-800 pt-6 transition-colors duration-300">
                <div>
                  <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">Advantages</h4>
                  <ul className="space-y-1.5">
                    {t.pros.map((p, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Limitations</h4>
                  <ul className="space-y-1.5">
                    {t.cons.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
