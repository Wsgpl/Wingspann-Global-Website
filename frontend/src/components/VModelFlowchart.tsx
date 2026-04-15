import { motion } from 'framer-motion';

const leftSteps = [
  { label: 'Mission Requirements', desc: 'Client meeting, mission request, feasibility' },
  { label: 'System Design', desc: 'Payload & platform selection, MRI analysis' },
  { label: 'Subsystem Design', desc: 'Detailed component-level planning' },
  { label: 'Implementation', desc: 'System manufacturing & integration' },
];

const rightSteps = [
  { label: 'Post-Mission Analysis', desc: 'Kaizen feedback, lessons learned' },
  { label: 'Mission Operations', desc: 'Cross-stakeholder ops, data delivery' },
  { label: 'Integration Testing', desc: 'Ground control setup, deployment checks' },
  { label: 'Unit Testing', desc: 'Component-level verification' },
];

function FlowConnectorArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 64"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect x="15" y="0" width="18" height="30" rx="5" fill="currentColor" />
      <path d="M24 62L2 28h44L24 62Z" fill="currentColor" />
    </svg>
  );
}

export function VModelFlowchart() {
  const d = 0.12;

  return (
    <div className="relative w-full overflow-x-auto bg-black border-2 border-dashed border-red-600/40 rounded-3xl p-4 md:p-8 mt-12 font-rajdhani">
      <div className="min-w-[900px] py-8 px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="text-xl md:text-2xl text-red-600 font-orbitron font-bold tracking-[6px] uppercase mb-6 opacity-90 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">Kaizen Continuous Improvement Loop</div>
          <div className="text-3xl md:text-5xl text-white font-orbitron font-bold tracking-wider uppercase mb-3">V-Model Systems Engineering Approach</div>
          <div className="text-sm md:text-md text-red-600 font-bold tracking-[3px] uppercase">Enabling accurate & reliable end-to-end MaaS consultancy</div>
        </motion.div>

        <div className="relative min-h-[500px]">
          {/* Centered Video - Stays in the gap of the V */}
          <div className="absolute left-[50.7%] -translate-x-1/2 top-0 bottom-32 w-[260px] flex flex-col items-center justify-center z-0 pointer-events-none opacity-90">
            <div className="text-[24px] font-orbitron font-extrabold text-red-600 tracking-[6px] mb-6 drop-shadow-[0_0_12px_rgba(220,38,38,0.7)] uppercase">
              TRL Level
            </div>
            <video 
              key="/modelV.mp4"
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain mix-blend-screen contrast-150 brightness-110"
              src="/modelV.mp4"
            />
          </div>

          {/* V Shape using grid */}
          <div className="grid grid-cols-[1fr_120px_1fr] gap-y-8 items-center relative z-10">
            {leftSteps.map((step, i) => (
              <VRow key={i} index={i} left={step} right={rightSteps[i]} d={d} />
            ))}
          </div>

          {/* Bottom point - coding/manufacturing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d * 12 }}
            className="flex justify-center mt-8 relative z-10"
          >
            <div className="w-full max-w-[550px] bg-gradient-to-br from-red-700 to-red-900 text-white border-2 border-red-600 rounded-2xl px-10 py-6 text-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              <div className="text-xs tracking-[4px] font-orbitron font-bold opacity-80 uppercase mb-2">System Core</div>
              <div className="text-lg font-orbitron font-bold uppercase mb-1">Mission Readiness Review</div>
              <div className="text-xs opacity-80 font-medium tracking-tight">Manufacturing complete, ready for deployment</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function VRow({ index, left, right, d }: { index: number; left: { label: string; desc: string }; right: { label: string; desc: string }; d: number }) {
  const indent = index * 50;
  const commonBoxStyles = "bg-red-800/20 border border-red-600/40 rounded-2xl p-6 w-[320px] min-h-[110px] shadow-lg shadow-red-900/10 hover:border-red-600 transition-all flex flex-col justify-center";

  return (
    <>
      {/* Left - descending */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: d * (index * 2), duration: 0.4 }}
        style={{ marginLeft: indent }}
        className="relative"
      >
        <div className={commonBoxStyles}>
          <div className="mb-2">
            <span className="text-[16px] text-white font-orbitron font-bold uppercase tracking-wider">{left.label}</span>
          </div>
          <div className="text-[12px] text-gray-400 font-medium leading-relaxed">{left.desc}</div>
        </div>
        {/* Connecting Arrow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-red-600 z-0 animate-pulse">
          <FlowConnectorArrow className="h-12 w-12" />
        </div>
      </motion.div>

      {/* Center - Empty spacer for video */}
      <div className="w-[120px]" />

      {/* Right - ascending */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: d * (index * 2 + 1), duration: 0.4 }}
        className="flex justify-end relative"
        style={{ marginRight: indent }}
      >
        <div className={commonBoxStyles}>
          <div className="mb-2 text-right">
            <span className="text-[16px] text-white font-orbitron font-bold uppercase tracking-wider">{right.label}</span>
          </div>
          <div className="text-[12px] text-gray-400 text-right font-medium leading-relaxed">{right.desc}</div>
        </div>
        {/* Connecting Arrow */}
        <div className="absolute -bottom-10 right-1/2 translate-x-1/2 text-red-600 z-0 animate-pulse">
          <FlowConnectorArrow className="h-12 w-12" />
        </div>
      </motion.div>
    </>
  );
}
