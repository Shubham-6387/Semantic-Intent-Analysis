import { Server, Router, MonitorSmartphone, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Node = ({ icon: Icon, label, status, x, y, delay = 0 }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'active': return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
      case 'warning': return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]';
      case 'critical': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      default: return 'bg-zinc-600';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-zinc-800 border-2 border-zinc-700 z-10 relative`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${getStatusColor()} z-20`}></div>
      </div>
      <span className="mt-2 text-xs font-semibold text-zinc-300 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800 whitespace-nowrap">{label}</span>
    </motion.div>
  );
};

const Link = ({ x1, y1, x2, y2, active, status = 'normal' }) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  const getLineColor = () => {
    switch(status) {
      case 'failed': return 'bg-red-900/50';
      case 'rerouted': return 'bg-green-500/50';
      default: return 'bg-zinc-800';
    }
  };

  const getDotColor = () => {
    switch(status) {
      case 'failed': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
      case 'rerouted': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]';
      default: return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]';
    }
  };

  return (
    <div 
      className={`absolute origin-left z-0 ${getLineColor()}`}
      style={{
        left: `${x1}%`,
        top: `${y1}%`,
        width: `${length}%`,
        height: '2px',
        transform: `rotate(${angle}deg)`
      }}
    >
      {active && status !== 'failed' && (
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: status === 'rerouted' ? 1.0 : 1.5, repeat: Infinity, ease: "linear" }}
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${getDotColor()}`}
        />
      )}
    </div>
  );
};

export default function NetworkTopology({ status }) {
  // Mock status maps
  const getStatus = (node) => status?.nodes?.[node] || 'active';
  const getLinkStatus = (linkId) => status?.links?.[linkId] || 'normal';
  const isTrafficActive = status?.isOptimizing || false;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden h-[400px] w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950"></div>
      
      {/* Topology Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      <h3 className="absolute top-4 left-4 text-sm font-bold text-zinc-400 uppercase tracking-widest z-30">CDN Architecture</h3>

      {/* Links */}
      <Link x1={50} y1={20} x2={50} y2={45} active={isTrafficActive} status={getLinkStatus('auth-lb')} />
      <Link x1={50} y1={45} x2={30} y2={65} active={isTrafficActive} status={getLinkStatus('lb-cdn1')} />
      <Link x1={50} y1={45} x2={70} y2={65} active={isTrafficActive} status={getLinkStatus('lb-cdn2')} />
      <Link x1={30} y1={65} x2={20} y2={85} active={isTrafficActive} status={getLinkStatus('cdn1-user1')} />
      <Link x1={30} y1={65} x2={40} y2={85} active={isTrafficActive} status={getLinkStatus('cdn1-user2')} />
      <Link x1={70} y1={65} x2={60} y2={85} active={isTrafficActive} status={getLinkStatus('cdn2-user3')} />
      <Link x1={70} y1={65} x2={80} y2={85} active={isTrafficActive} status={getLinkStatus('cdn2-user4')} />

      {/* Nodes */}
      <Node icon={Database} label="Auth Server" x={50} y={20} delay={0.1} status={getStatus('auth')} />
      <Node icon={Server} label="Load Balancer" x={50} y={45} delay={0.2} status={getStatus('lb')} />
      
      <Node icon={Server} label="CDN Node 1" x={30} y={65} delay={0.3} status={getStatus('cdn1')} />
      <Node icon={Server} label="CDN Node 2" x={70} y={65} delay={0.4} status={getStatus('cdn2')} />
      
      <Node icon={MonitorSmartphone} label="User A" x={20} y={85} delay={0.5} status={getStatus('user1')} />
      <Node icon={MonitorSmartphone} label="User B" x={40} y={85} delay={0.5} status={getStatus('user2')} />
      <Node icon={MonitorSmartphone} label="User C" x={60} y={85} delay={0.5} status={getStatus('user3')} />
      <Node icon={MonitorSmartphone} label="User D" x={80} y={85} delay={0.5} status={getStatus('user4')} />
    </div>
  );
}
