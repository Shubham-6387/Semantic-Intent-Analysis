import { Server, Router, MonitorSmartphone, Database, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkTopology({ status, currentTopology = 'tree', heightClass = 'h-[450px]', theme }) {
  const isTrafficActive = status?.isOptimizing || false;
  const nodeStatus = status?.nodes || {};
  const linkStatus = status?.links || {};

  // 1. Generate Coordinates based on Selected Topology
  const getNodesAndLinks = () => {
    let nodes = [];
    let links = [];

    if (currentTopology === 'tree') {
      // Auth Server
      nodes.push({ id: 'auth', label: 'Auth Server', icon: Database, x: 12, y: 50, type: 'core' });
      // Load Balancer
      nodes.push({ id: 'lb', label: 'Load Balancer', icon: Server, x: 26, y: 50, type: 'core' });
      // CDN Servers
      nodes.push({ id: 'cdn1', label: 'CDN 1', icon: Server, x: 42, y: 30, type: 'cdn' });
      nodes.push({ id: 'cdn2', label: 'CDN 2', icon: Server, x: 42, y: 70, type: 'cdn' });
      // Routers
      nodes.push({ id: 'router1', label: 'Router 1', icon: Router, x: 58, y: 30, type: 'router' });
      nodes.push({ id: 'router2', label: 'Router 2', icon: Router, x: 58, y: 70, type: 'router' });

      // Core Links
      links.push({ id: 'auth-lb', from: 'auth', to: 'lb', status: linkStatus['auth-lb'] || 'normal' });
      links.push({ id: 'lb-cdn1', from: 'lb', to: 'cdn1', status: linkStatus['lb-cdn1'] || 'normal' });
      links.push({ id: 'lb-cdn2', from: 'lb', to: 'cdn2', status: linkStatus['lb-cdn2'] || 'normal' });
      links.push({ id: 'cdn1-router1', from: 'cdn1', to: 'router1', status: 'normal' });
      links.push({ id: 'cdn2-router2', from: 'cdn2', to: 'router2', status: 'normal' });

      // 50 Clustered Users on Tree
      for (let i = 0; i < 50; i++) {
        const isGroup1 = i < 25;
        const targetRouter = isGroup1 ? 'router1' : 'router2';
        const indexInGroup = isGroup1 ? i : i - 25;
        
        // Arrange users in two vertical arcs on the right
        const angle = -0.5 * Math.PI + (Math.PI * indexInGroup) / 24;
        const x = 76 + 14 * Math.cos(angle * 0.7);
        const y = isGroup1 ? 26 + 18 * Math.sin(angle * 0.7) : 74 + 18 * Math.sin(angle * 0.7);
        
        const userId = `user${i + 1}`;
        nodes.push({ 
          id: userId, 
          label: `User ${i + 1}`, 
          icon: MonitorSmartphone, 
          x: x, 
          y: y, 
          type: 'user', 
          size: 6 
        });

        links.push({
          id: `${targetRouter}-${userId}`,
          from: targetRouter,
          to: userId,
          status: linkStatus[`${targetRouter}-${userId}`] || 'normal'
        });
      }

    } else if (currentTopology === 'star') {
      // Star Topology: Central Hub Router
      nodes.push({ id: 'hub', label: 'Central Hub', icon: Router, x: 50, y: 50, type: 'hub' });

      // 50 users in a radiating concentric ring
      for (let i = 0; i < 50; i++) {
        const angle = (2 * Math.PI * i) / 50;
        const x = 50 + 36 * Math.cos(angle);
        const y = 50 + 36 * Math.sin(angle);
        const userId = `user${i + 1}`;

        nodes.push({ 
          id: userId, 
          label: `User ${i + 1}`, 
          icon: MonitorSmartphone, 
          x: x, 
          y: y, 
          type: 'user', 
          size: 6 
        });

        links.push({
          id: `hub-${userId}`,
          from: 'hub',
          to: userId,
          status: isTrafficActive ? (i % 6 === 0 ? 'congested' : 'normal') : 'normal'
        });
      }

    } else if (currentTopology === 'mesh') {
      // Mesh Topology: 50 nodes in a circle connected to neighbors
      for (let i = 0; i < 50; i++) {
        const angle = (2 * Math.PI * i) / 50;
        const x = 50 + 36 * Math.cos(angle);
        const y = 50 + 36 * Math.sin(angle);
        const nodeId = `node${i + 1}`;

        // Select a core, router or user label purely for visual variation
        let type = 'user';
        let icon = MonitorSmartphone;
        if (i % 8 === 0) {
          type = 'core';
          icon = Server;
        } else if (i % 8 === 4) {
          type = 'router';
          icon = Router;
        }

        nodes.push({ 
          id: nodeId, 
          label: `Node ${i + 1}`, 
          icon: icon, 
          x: x, 
          y: y, 
          type: type, 
          size: 7 
        });
      }

      // Create partial mesh interconnect links (i connected to next 3 nodes)
      for (let i = 0; i < 50; i++) {
        const nodeId = `node${i + 1}`;
        for (let j = 1; j <= 3; j++) {
          const neighborIndex = (i + j) % 50;
          const neighborId = `node${neighborIndex + 1}`;
          
          links.push({
            id: `link-${i}-${neighborIndex}`,
            from: nodeId,
            to: neighborId,
            status: isTrafficActive ? (j === 3 ? 'rerouted' : 'normal') : 'normal'
          });
        }
      }
    }

    return { nodes, links };
  };

  const { nodes, links } = getNodesAndLinks();

  // 2. Node styling lookups
  const getNodeColor = (node) => {
    // Check dynamic state mappings
    const statusVal = nodeStatus[node.id] || (isTrafficActive ? 'active' : 'idle');
    if (statusVal === 'critical') return '#ef4444'; // Red
    if (statusVal === 'warning') return '#eab308'; // Yellow
    if (statusVal === 'active') return '#22c55e'; // Green
    if (node.type === 'core') return '#a855f7'; // Purple
    if (node.type === 'cdn') return '#3b82f6'; // Blue
    if (node.type === 'hub') return '#ec4899'; // Pink
    return theme === 'light' ? '#a1a1aa' : '#71717a'; // Zinc
  };

  // 3. Link styling and dynamic dashed animation flows
  const getLinkStyle = (link) => {
    switch (link.status) {
      case 'failed':
        return { stroke: '#ef4444', strokeWidth: 1.5, opacity: 0.25, strokeDasharray: '4,4', flowColor: '#ef4444', flowSpeed: '0s' };
      case 'rerouted':
        return { stroke: '#22c55e', strokeWidth: 2, opacity: 0.8, strokeDasharray: '6,4', flowColor: '#22c55e', flowSpeed: '0.8s' };
      case 'congested':
        return { stroke: '#eab308', strokeWidth: 1.8, opacity: 0.6, strokeDasharray: '10,12', flowColor: '#eab308', flowSpeed: '4s' };
      default:
        return { stroke: theme === 'light' ? '#d4d4d8' : '#27272a', strokeWidth: 1.2, opacity: 0.5, strokeDasharray: '5,5', flowColor: '#6366f1', flowSpeed: '2s' };
    }
  };

  return (
    <div className={`bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 relative overflow-hidden ${heightClass} w-full select-none transition-colors duration-300`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-50/50 dark:from-zinc-900/40 via-white dark:via-zinc-950 to-white dark:to-zinc-955 z-0 transition-colors duration-300"></div>
      
      {/* Dynamic Scanline Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:25px_25px] z-0 transition-colors duration-300"></div>

      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
        <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-300">
          NS-3 Active Visualizer: <span className="text-zinc-900 dark:text-white ml-1 transition-colors duration-300">{currentTopology.toUpperCase()} (50 NODES)</span>
        </h3>
      </div>

      <div className="absolute top-4 right-4 flex items-center space-x-4 text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider z-10 bg-zinc-50/90 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full transition-colors duration-300">
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 inline-block mr-1"></span>Normal</div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block mr-1"></span>Optimized</div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block mr-1"></span>Congested</div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block mr-1"></span>Failed</div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowDash {
          to {
            stroke-dashoffset: -30;
          }
        }
        .optical-link {
          transition: stroke 0.5s ease, stroke-width 0.5s ease;
        }
        .optical-link-active {
          animation: flowDash var(--flow-speed) linear infinite;
        }
      `}} />

      <div className="w-full h-full relative z-0 mt-2">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Render Connections / Fiber Links */}
          {links.map((link) => {
            const fromNode = nodes.find(n => n.id === link.from);
            const toNode = nodes.find(n => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const style = getLinkStyle(link);

            return (
              <g key={link.id}>
                {/* Background Solid Support Line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={theme === 'light' ? '#f4f4f5' : '#1c1c1e'}
                  strokeWidth={style.strokeWidth * 0.8}
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />
                {/* Active Dash Fiber Flows */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={`optical-link ${isTrafficActive && link.status !== 'failed' ? 'optical-link-active' : ''}`}
                  stroke={style.flowColor}
                  strokeWidth={style.strokeWidth}
                  strokeLinecap="round"
                  opacity={style.opacity}
                  style={{
                    strokeDasharray: isTrafficActive ? style.strokeDasharray : 'none',
                    '--flow-speed': style.flowSpeed
                  }}
                />
              </g>
            );
          })}

          {/* Render Topology Nodes */}
          {nodes.map((node) => {
            const isUser = node.type === 'user';
            const size = node.size || (isUser ? 5 : 8);
            const color = getNodeColor(node);
            const isCritical = nodeStatus[node.id] === 'critical';

            return (
              <g key={node.id} className="cursor-pointer">
                {/* Glow ring for heavy components */}
                {!isUser && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size * 0.8}
                    fill="none"
                    stroke={color}
                    strokeWidth={0.5}
                    className={isCritical || isTrafficActive ? 'animate-ping' : ''}
                    style={{ animationDuration: isCritical ? '1s' : '3s' }}
                    opacity={0.35}
                  />
                )}

                {/* Core Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={size / 2}
                  fill={theme === 'light' ? '#ffffff' : '#09090b'}
                  stroke={color}
                  strokeWidth={isUser ? 0.6 : 1.2}
                  className="transition-all duration-300"
                />

                {/* Hover Label helper in raw SVG */}
                {!isUser && (
                  <text
                    x={node.x}
                    y={node.y - (size * 0.8)}
                    textAnchor="middle"
                    fill={theme === 'light' ? '#52525b' : '#a1a1aa'}
                    fontSize={2.5}
                    fontWeight="bold"
                    className="pointer-events-none select-none transition-colors duration-300"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
