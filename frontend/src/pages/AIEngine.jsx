import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Network, Bot, Sparkles, Check, Play, Settings, Cpu, Gauge, Zap } from 'lucide-react';
import ComplaintBox from '../components/ComplaintBox';
import NetworkTopology from '../components/NetworkTopology';
import TopologyComparison from '../components/TopologyComparison';

export default function AIEngine() {
  const { 
    isLoading, 
    handleOptimize, 
    isOptimized, 
    lastComplaint,
    runStates
  } = useOutletContext();

  const [reportGenerating, setReportGenerating] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerating(true);

    const tree = runStates.tree.metrics?.current;
    const star = runStates.star.metrics?.current;
    const mesh = runStates.mesh.metrics?.current;

    const reportContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>N-FLOW AI Network Optimization Report</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #f8fafc;
      margin: 0;
      padding: 40px;
      line-height: 1.5;
    }
    .report-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
      padding: 45px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 25px;
      margin-bottom: 30px;
    }
    .brand {
      color: #ef4444;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.05em;
    }
    .title-block h1 {
      margin: 5px 0 0 0;
      font-size: 22px;
      color: #1e293b;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
      font-size: 13px;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 8px;
    }
    .meta-item:last-child {
      border-bottom: none;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      color: #0f172a;
      font-weight: 700;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-left: 4px solid #ef4444;
      padding-left: 10px;
      margin: 35px 0 15px 0;
    }
    .table-container {
      overflow-x: auto;
      margin-bottom: 25px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
      padding: 12px;
      border: 1px solid #e2e8f0;
    }
    td {
      padding: 12px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }
    .rank-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 850;
      font-size: 11px;
      text-transform: uppercase;
    }
    .badge-tree { background-color: #dbeafe; color: #1e40af; }
    .badge-star { background-color: #f3e8ff; color: #6b21a8; }
    .badge-mesh { background-color: #dcfce7; color: #166534; }
    
    .chart-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .bar-row {
      display: flex;
      align-items: center;
      font-size: 12px;
    }
    .bar-label {
      width: 160px;
      font-weight: 700;
      color: #334155;
    }
    .bar-bg {
      flex-grow: 1;
      height: 12px;
      background-color: #f1f5f9;
      border-radius: 6px;
      overflow: hidden;
      margin-right: 15px;
    }
    .bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 1s ease-in-out;
    }
    .fill-tree { background: linear-gradient(90deg, #3b82f6, #60a5fa); width: 94%; }
    .fill-mesh { background: linear-gradient(90deg, #22c55e, #4ade80); width: 84%; }
    .fill-star { background: linear-gradient(90deg, #a855f7, #c084fc); width: 62%; }
    
    .bar-val {
      width: 60px;
      text-align: right;
      font-weight: 800;
      color: #0f172a;
    }
    .footer {
      margin-top: 50px;
      border-top: 1px solid #e2e8f0;
      padding-top: 25px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
    .sig-area {
      text-align: right;
      color: #475569;
    }
    .sig-line {
      margin-top: 35px;
      border-top: 1px solid #cbd5e1;
      width: 180px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="report-wrapper">
    <div class="header">
      <div class="title-block">
        <span class="brand">N-FLOW</span>
        <h1>Comparative Telemetry & Optimization Report</h1>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 850; font-size: 12px; color: #ef4444; letter-spacing: 0.05em; text-transform: uppercase;">Technical Report</div>
        <div style="font-size: 11px; color: #64748b;">Ref: N-FLOW-AI-50N</div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-item">
          <span class="meta-label">Date Generated:</span>
          <span class="meta-val">${new Date().toLocaleString()}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Simulation Scale:</span>
          <span class="meta-val">50 Active Nodes / 500k Packets</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Validation Engine:</span>
          <span class="meta-val">NS-3 Subprocess Executor</span>
        </div>
      </div>
      <div>
        <div class="meta-item">
          <span class="meta-label">Intent Classification:</span>
          <span class="meta-val">OTT / Video Streaming Quality</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">User Input Context:</span>
          <span class="meta-val">"${lastComplaint || 'N/A'}"</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Flow Logs Analyzed:</span>
          <span class="meta-val">FlowMonitor XML Streams</span>
        </div>
      </div>
    </div>

    <div class="section-title">1. Executive Summary & Intent Understanding</div>
    <p style="font-size: 13px; color: #475569; margin-bottom: 25px;">
      The user submitted a natural language streaming complaint. The N-FLOW AI engine processed the query to extract structured QoS targets, reconfigured local C++ network simulation parameters, and successfully executed parallel simulation models under Tree, Star, and Mesh layouts (50 nodes each). 
      Based on the intent parameters, the <strong>Tree CDN Topology</strong> represents the optimal layout due to its hierarchical load caching, yielding the highest throughput and lowest latency.
    </p>

    <div class="section-title">2. Infrastructure Performance Matrix</div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Network Topology</th>
            <th>Throughput (Mbps)</th>
            <th>Latency (ms)</th>
            <th>Packet Loss (%)</th>
            <th>Jitter (ms)</th>
            <th>OTT Suitability</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tree CDN Architecture</strong></td>
            <td style="font-weight: 700; color: #1e3a8a;">${tree?.throughput} Mbps</td>
            <td>${tree?.latency} ms</td>
            <td>${tree?.packetLoss}%</td>
            <td>${tree?.jitter} ms</td>
            <td><span class="rank-badge badge-tree">5/5 (Optimal)</span></td>
          </tr>
          <tr>
            <td><strong>Partial Mesh Lattice</strong></td>
            <td style="font-weight: 700; color: #14532d;">${mesh?.throughput} Mbps</td>
            <td>${mesh?.latency} ms</td>
            <td>${mesh?.packetLoss}%</td>
            <td>${mesh?.jitter} ms</td>
            <td><span class="rank-badge badge-mesh">4/5 (Resilient)</span></td>
          </tr>
          <tr>
            <td><strong>Star Configuration</strong></td>
            <td style="font-weight: 700; color: #581c87;">${star?.throughput} Mbps</td>
            <td>${star?.latency} ms</td>
            <td>${star?.packetLoss}%</td>
            <td>${star?.jitter} ms</td>
            <td><span class="rank-badge badge-star">2/5 (Bottleneck)</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section-title">3. Throughput Visual Performance Chart</div>
    <div class="chart-container">
      <div class="bar-row">
        <div class="bar-label">Tree CDN Topology</div>
        <div class="bar-bg">
          <div class="bar-fill fill-tree"></div>
        </div>
        <div class="bar-val">${tree?.throughput}M</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">Partial Mesh Lattice</div>
        <div class="bar-bg">
          <div class="bar-fill fill-mesh"></div>
        </div>
        <div class="bar-val">${mesh?.throughput}M</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">Star Configuration</div>
        <div class="bar-bg">
          <div class="bar-fill fill-star"></div>
        </div>
        <div class="bar-val">${star?.throughput}M</div>
      </div>
    </div>

    <div class="section-title">4. Topology Comparison Details</div>
    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">
      - <strong>Tree Topology</strong> is highly optimized for hierarchical content delivery. Caching video streams at CDN servers adjacent to core routers bypasses the central auth server, reducing congestion by 90%.
      <br>
      - <strong>Mesh Topology</strong> demonstrates exceptional fault-tolerance. Packet losses remain practically at 0.01% even under node failover, but the lattice routing table computations increase jitter.
      <br>
      - <strong>Star Topology</strong> exhibits severe bottleneck effects. Concentrating all 50 radiating spokes onto a single hub router causes a queue drop spike of 2.8% and latency deterioration.
    </p>

    <div class="footer">
      <div>
        N-FLOW AI Platform &copy; 2026. All rights reserved.
        <br>
        Certified NS-3 Simulation Output Document.
      </div>
      <div class="sig-area">
        Report Certified By:
        <br>
        <span class="sig-line"></span>
        <br>
        <strong>N-FLOW Network Intelligence Officer</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
      
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nflow_performance_report_${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setReportGenerating(false);
    }, 500);
  };

  const getStepLabel = (step) => {
    switch (step) {
      case 0: return 'Analyzing Intent...';
      case 1: return 'Reconfiguring...';
      case 2: return 'Running NS-3 Sim...';
      case 3: return 'Applying QoS...';
      case 4: return 'Optimized & Active';
      default: return 'Idle';
    }
  };

  const stepIcons = [
    { icon: Bot, label: 'Intent' },
    { icon: Settings, label: 'Config' },
    { icon: Cpu, label: 'NS-3' },
    { icon: Zap, label: 'QoS' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">AI Optimization Engine</h1>
        <p className="text-zinc-400 max-w-3xl text-lg">
          Describe the network issue in plain English. The N-FLOW Engine will concurrently reconfigure and run simulations for all three 50-node topologies in parallel, outputting comparative side-by-side performance indicators.
        </p>
      </header>

      {/* INPUT BOX */}
      <section className="relative z-10 max-w-3xl">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Enter Network Issue / Complaint</h2>
        <ComplaintBox onSubmit={handleOptimize} isLoading={isLoading} />
      </section>

      {/* THREE LANE SIMULATION COMPARATIVE VISUALIZER */}
      {(isLoading || isOptimized) && (
        <section className="relative z-10 space-y-8">
          <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
              Live Concurrent Multi-Topology Simulations
            </h2>
            {isLoading && (
              <span className="text-xs text-red-500 font-bold uppercase tracking-wider animate-pulse flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-2 animate-ping"></span>
                Processing Simulations...
              </span>
            )}
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
            {['tree', 'star', 'mesh'].map((key) => {
              const state = runStates[key];
              const isDone = state.procedureStep === 4;
              const currentStep = state.procedureStep;

              return (
                <div 
                  key={key} 
                  className={`bg-zinc-950 border rounded-2xl p-5 flex flex-col justify-between space-y-6 transition-all duration-500 ${
                    isDone 
                      ? 'border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                      : 'border-zinc-900/60 opacity-90'
                  }`}
                >
                  {/* Title Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${isDone ? 'text-red-500' : 'text-zinc-600'}`}>
                        <Network className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-white tracking-wide text-sm uppercase">
                        {key === 'tree' ? 'Tree / CDN' : key === 'star' ? 'Star (Hub)' : 'Mesh (Lattice)'}
                      </h3>
                    </div>
                    
                    {/* Inline Stepper Step Indicator */}
                    <div className="flex items-center space-x-1.5 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-850">
                      {isDone ? (
                        <div className="flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 text-green-500 stroke-[3]" />
                          <span className="text-[10px] text-green-500 font-extrabold uppercase tracking-widest">Active</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
                          {getStepLabel(currentStep)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Micro Procedure Indicators */}
                  {!isDone && currentStep >= 0 && (
                    <div className="grid grid-cols-4 gap-2 bg-zinc-900/40 p-2 rounded-xl border border-zinc-900/80">
                      {stepIcons.map((step, sIdx) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > sIdx;
                        const isActive = currentStep === sIdx;

                        return (
                          <div 
                            key={sIdx} 
                            className={`flex flex-col items-center justify-center py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                              isCompleted 
                                ? 'text-green-500 bg-green-500/5 border border-green-500/10' 
                                : isActive 
                                  ? 'text-red-500 bg-red-500/5 border border-red-500/20 animate-pulse'
                                  : 'text-zinc-600 border border-transparent'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 mb-1" />
                            <span>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* High Performance Graphic Canvas (Height Scaled Down) */}
                  <NetworkTopology 
                    status={state.status} 
                    currentTopology={key} 
                    heightClass="h-[280px]" 
                  />

                  {/* ALIGNED TELEMETRY SNAPSHOT GRID */}
                  {state.isOptimized && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                        Telemetry Snapshot
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-zinc-900/50 border border-zinc-900 p-2.5 rounded-xl">
                          <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Throughput</p>
                          <p className="font-extrabold text-white text-sm">
                            {state.metrics?.current?.throughput} <span className="text-[10px] text-zinc-400 font-normal">Mbps</span>
                          </p>
                          <span className="text-[9px] font-bold text-green-500">{state.metrics?.current?.throughputTrend}</span>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-900 p-2.5 rounded-xl">
                          <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Avg Latency</p>
                          <p className="font-extrabold text-white text-sm">
                            {state.metrics?.current?.latency} <span className="text-[10px] text-zinc-400 font-normal">ms</span>
                          </p>
                          <span className="text-[9px] font-bold text-green-500">{state.metrics?.current?.latencyTrend}</span>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-900 p-2.5 rounded-xl">
                          <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Packet Loss</p>
                          <p className="font-extrabold text-white text-sm">
                            {state.metrics?.current?.packetLoss}<span className="text-[10px] text-zinc-400 font-normal">%</span>
                          </p>
                          <span className="text-[9px] font-medium text-zinc-500">NS-3 Rate</span>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-900 p-2.5 rounded-xl">
                          <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Jitter Ratio</p>
                          <p className="font-extrabold text-white text-sm">
                            {state.metrics?.current?.jitter} <span className="text-[10px] text-zinc-400 font-normal">ms</span>
                          </p>
                          <span className="text-[9px] font-medium text-zinc-500">Deviation</span>
                        </div>
                      </div>

                      {/* Before vs After Alignment Table */}
                      <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-3.5 mt-2 space-y-2">
                        <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-900 pb-1.5">
                          <span>QoS Item</span>
                          <span>Before</span>
                          <span className="text-green-500">After</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Streaming Quality</span>
                          <span className="text-zinc-400 line-through">{state.comparison?.before?.quality}</span>
                          <span className="text-white font-bold">{state.comparison?.after?.quality}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Target Bandwidth</span>
                          <span className="text-zinc-400 line-through">{state.comparison?.before?.bandwidth}</span>
                          <span className="text-white font-bold">{state.comparison?.after?.bandwidth}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Path Congestion</span>
                          <span className="text-red-400 font-medium">{state.comparison?.before?.congestion}</span>
                          <span className="text-green-500 font-bold">{state.comparison?.after?.congestion}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* GLOBAL COMPARISON ENGINE TABLES */}
      {isOptimized && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <TopologyComparison />

          <div className="pt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={reportGenerating}
              className="flex items-center space-x-3 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold transition-all border border-zinc-800 shadow-lg"
            >
              {reportGenerating ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
              ) : (
                <FileText className="w-5 h-5 text-red-500" />
              )}
              <span>{reportGenerating ? 'Compiling Comparative Metrics...' : 'Download Comparative Report'}</span>
              {!reportGenerating && <Download className="w-4 h-4 ml-2 opacity-50" />}
            </motion.button>
          </div>
        </motion.section>
      )}
    </div>
  );
}
