import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import ComplaintBox from '../components/ComplaintBox';
import ProcedureSteps from '../components/ProcedureSteps';
import NetworkTopology from '../components/NetworkTopology';
import BeforeAfter from '../components/BeforeAfter';
import MetricsDashboard from '../components/MetricsDashboard';

export default function AIEngine() {
  const { 
    isLoading, 
    handleOptimize, 
    procedureStep, 
    isOptimized, 
    comparison,
    metrics,
    topologyStatus,
    lastComplaint
  } = useOutletContext();

  const [reportGenerating, setReportGenerating] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerating(true);

    const activeNodes = Object.keys(topologyStatus?.nodes || {}).filter(k => topologyStatus.nodes[k] === 'active').join(', ');
    const warningNodes = Object.keys(topologyStatus?.nodes || {}).filter(k => topologyStatus.nodes[k] === 'warning').join(', ');
    const reroutedLinks = Object.keys(topologyStatus?.links || {}).filter(k => topologyStatus.links[k] === 'rerouted').join(', ');

    const reportContent = 
`=============================================================
             N-FLOW AI OPTIMIZATION REPORT
=============================================================
Date/Time: ${new Date().toLocaleString()}
-------------------------------------------------------------

1. PROBLEM IDENTIFICATION
-------------------------
Original User Complaint:
"${lastComplaint || 'N/A'}"

2. AI INTENT RESOLUTION & ACTIONS TAKEN
---------------------------------------
- Natural Language mapped to QoS Intent rules.
- Triggered automated topology reconfiguration to avoid congestion.
- Executed NS-3 Network Simulation validation.
- Applied new Quality of Service parameters dynamically.

3. NETWORK ARCHITECTURE & TOPOLOGY CHANGES
------------------------------------------
Active Nodes: ${activeNodes || 'None'}
Nodes with Warnings (Avoided): ${warningNodes || 'None'}
Rerouted Paths (Traffic Steered): ${reroutedLinks || 'None'}

The system successfully shifted traffic away from congested/warning 
nodes and rerouted active streams through optimal CDN nodes.

4. PERFORMANCE METRICS (BEFORE vs AFTER)
----------------------------------------
Metric         | Before Optimization  | After Optimization
---------------|----------------------|----------------------
Quality        | ${comparison?.before?.quality?.padEnd(20) || 'N/A'} | ${comparison?.after?.quality || 'N/A'}
Bandwidth      | ${comparison?.before?.bandwidth?.padEnd(20) || 'N/A'} | ${comparison?.after?.bandwidth || 'N/A'}
Throughput     | ${comparison?.before?.throughput?.padEnd(20) || 'N/A'} | ${comparison?.after?.throughput || 'N/A'}
Latency        | ${comparison?.before?.latency?.padEnd(20) || 'N/A'} | ${comparison?.after?.latency || 'N/A'}
Packet Loss    | ${comparison?.before?.packetLoss?.padEnd(20) || 'N/A'} | ${comparison?.after?.packetLoss || 'N/A'}
Jitter         | ${comparison?.before?.jitter?.padEnd(20) || 'N/A'} | ${comparison?.after?.jitter || 'N/A'}
Priority       | ${comparison?.before?.priority?.padEnd(20) || 'N/A'} | ${comparison?.after?.priority || 'N/A'}
Congestion     | ${comparison?.before?.congestion?.padEnd(20) || 'N/A'} | ${comparison?.after?.congestion || 'N/A'}

=============================================================
             End of Report
=============================================================`;
      
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nflow_optimization_report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setReportGenerating(false);
    }, 500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="mb-8 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">AI Optimization Engine</h1>
        <p className="text-zinc-400 max-w-3xl text-lg">
          Describe the network issue, and watch the N-FLOW Engine orchestrate topology changes, apply QoS rules, and validate performance in real-time.
        </p>
      </header>

      {/* STEP 1: Prompt Input */}
      <section className="relative z-10">
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Step 1: Define Intent</h2>
        <div className="max-w-3xl">
          <ComplaintBox onSubmit={handleOptimize} isLoading={isLoading} />
        </div>
      </section>

      {/* STEP 2: Processing & Architecture Changes */}
      {(isLoading || procedureStep >= 0) && (
        <section className="relative z-10">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 mt-12">Step 2: Architecture Adaptation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProcedureSteps isVisible={isLoading || procedureStep === 4} currentStep={procedureStep} />
            </div>
            <div className="lg:col-span-2">
              <NetworkTopology status={topologyStatus} />
            </div>
          </div>
        </section>
      )}

      {/* STEP 3: Results & Graphs */}
      {isOptimized && (
        <section className="relative z-10">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 mt-12">Step 3: Optimization Results</h2>
          
          <div className="space-y-6">
            <BeforeAfter before={comparison?.before} after={comparison?.after} />
            
            <MetricsDashboard metrics={metrics} />

            <div className="pt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateReport}
                disabled={reportGenerating}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-zinc-700 shadow-lg"
              >
                {reportGenerating ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <span>{reportGenerating ? 'Generating Report...' : 'Generate Full Report'}</span>
                {!reportGenerating && <Download className="w-4 h-4 ml-2 opacity-50" />}
              </motion.button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
