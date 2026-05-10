import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Wifi, AlertCircle, Zap, ShieldAlert, MonitorPlay, ArrowUpRight, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
    <div>
      <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline space-x-1">
        <h3 className="text-xl font-bold text-white">{value}</h3>
        <span className="text-zinc-500 text-xs">{unit}</span>
      </div>
      {trend && (
        <p className={`text-xs mt-1 ${trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </p>
      )}
    </div>
    <div className={`p-2.5 rounded-full bg-${color}-500/10`}>
      <Icon className={`w-5 h-5 text-${color}-500`} />
    </div>
  </div>
);

export default function MetricsDashboard({ metrics }) {
  const data = metrics.history || [];
  const current = metrics.current || {};
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard title="Throughput" value={current.throughput || '0.0'} unit="Mbps" icon={Activity} color="green" trend={current.throughputTrend} />
        <MetricCard title="Latency" value={current.latency || '0.0'} unit="ms" icon={Zap} color="blue" trend={current.latencyTrend} />
        <MetricCard title="Packet Loss" value={current.packetLoss || '0.0'} unit="%" icon={AlertCircle} color="red" />
        <MetricCard title="Jitter" value={current.jitter || '0.0'} unit="ms" icon={Wifi} color="yellow" />
        
        <MetricCard title="Congestion" value={current.congestion || 'Low'} unit="" icon={ShieldAlert} color="orange" />
        <MetricCard title="Traffic Priority" value={current.priority || 'Normal'} unit="" icon={ArrowUpRight} color="purple" />
        <MetricCard title="Bandwidth Cap" value={current.bandwidth || '10'} unit="Mbps" icon={Gauge} color="cyan" />
        <MetricCard title="Quality" value={current.quality || 'Auto'} unit="" icon={MonitorPlay} color="indigo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-64">
          <h3 className="text-zinc-300 text-sm font-semibold mb-4">Throughput Trend (Mbps)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
              <Area type="monotone" dataKey="throughput" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-64">
          <h3 className="text-zinc-300 text-sm font-semibold mb-4">Latency & Jitter (ms)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
              <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="jitter" stroke="#eab308" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
