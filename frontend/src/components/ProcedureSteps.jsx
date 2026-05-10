import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProcedureSteps({ isVisible, currentStep }) {
  const steps = [
    { id: 0, title: "Analyzing Natural Language Intent", desc: "Extracting QoS parameters from complaint" },
    { id: 1, title: "Reconfiguring Network Topology", desc: "Rerouting traffic away from congested paths" },
    { id: 2, title: "Executing NS-3 Simulation", desc: "Running deep-packet simulation on new topology" },
    { id: 3, title: "Applying Optimizations", desc: "Finalizing configurations and generating metrics" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg relative mt-4 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-pulse"></div>
          
          <h3 className="text-white font-bold mb-5 flex items-center space-x-2">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            <span>AI Optimization in Progress...</span>
          </h3>

          <div className="space-y-5 relative">
            {/* Connecting line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-zinc-800 z-0"></div>

            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <div key={step.id} className="relative z-10 flex items-start space-x-4 bg-zinc-900">
                  <div className="py-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 bg-zinc-900 rounded-full" />
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin flex-shrink-0 bg-zinc-900" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-700 bg-zinc-900 rounded-full" />
                    )}
                  </div>
                  <div className={`flex-1 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-zinc-300' : isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
