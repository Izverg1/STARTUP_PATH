// BACKUP: Original Complex Smart Budget Allocation Slide
// This is the full before/after comparison with multiple elements

export const ComplexSmartBudgetSlide = () => (
  <div className="min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center px-16 relative overflow-hidden py-20">
    
    {/* Big Title Spanning Across */}
    <div className="w-full text-center mb-8">
      <h2 className="text-5xl font-bold font-mono tracking-wider leading-tight">
        <span className="text-white">SMART</span> 
        <span className="text-red-500 neon-glow cyber-flicker">BUDGET</span> 
        <span className="text-cyan-400">ALLOCATION</span>
      </h2>
      <div className="space-y-3 mt-4">
        <p className="text-2xl text-white leading-relaxed">
          Instead of managing channels separately → 
          <span className="text-cyan-400 font-bold"> One AI system optimizes everything</span>
        </p>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto">
          Our platform connects all your marketing channels and automatically reallocates budget 
          to the highest-performing ones in real-time
        </p>
      </div>
    </div>

    {/* Clear Before/After Demonstration */}
    <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
      
      {/* BEFORE: Scattered Channels */}
      <div className="flex-1 text-center">
        <h3 className="text-4xl font-bold text-red-500 font-mono mb-8 neon-glow">BEFORE: CHAOS</h3>
        <div className="relative h-[400px] bg-red-900/10 rounded-lg border border-red-500/30 p-6">
          
          {/* Scattered, disconnected channels */}
          <div className="absolute top-8 left-8">
            <div className="bg-black/80 border border-red-500/50 rounded p-3 w-24">
              <div className="text-blue-400 font-mono text-xs">GOOGLE</div>
              <div className="text-red-400 text-xs">ALONE</div>
            </div>
          </div>
          
          <div className="absolute top-8 right-8">
            <div className="bg-black/80 border border-red-500/50 rounded p-3 w-24">
              <div className="text-blue-300 font-mono text-xs">LINKEDIN</div>
              <div className="text-red-400 text-xs">ALONE</div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8">
            <div className="bg-black/80 border border-red-500/50 rounded p-3 w-24">
              <div className="text-purple-400 font-mono text-xs">WEBINAR</div>
              <div className="text-red-400 text-xs">ALONE</div>
            </div>
          </div>
          
          <div className="absolute bottom-8 right-8">
            <div className="bg-black/80 border border-red-500/50 rounded p-3 w-24">
              <div className="text-green-400 font-mono text-xs">CONTENT</div>
              <div className="text-red-400 text-xs">ALONE</div>
            </div>
          </div>
          
          {/* Chaos indicators */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-red-500 text-5xl animate-spin">⚠</div>
            <div className="text-red-400 font-mono text-sm text-center mt-2">NO CONNECTION</div>
          </div>
          
          {/* Chaotic lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <line x1="50" y1="50" x2="150" y2="200" stroke="red" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse"/>
            <line x1="250" y1="50" x2="100" y2="300" stroke="red" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse"/>
            <line x1="50" y1="300" x2="250" y2="100" stroke="red" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse"/>
          </svg>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="text-red-400 font-mono text-lg">❌ WASTED BUDGET</div>
          <div className="text-red-400 font-mono text-lg">❌ NO OPTIMIZATION</div>
          <div className="text-red-400 font-mono text-lg">❌ BLIND DECISIONS</div>
        </div>
      </div>

      {/* Arrow */}
      <div className="mx-12 flex flex-col items-center">
        <ArrowRight className="w-16 h-16 text-cyan-400 neon-glow animate-pulse" />
        <div className="text-cyan-400 font-mono text-lg mt-2">AI OPTIMIZATION</div>
      </div>
      
      {/* AFTER: Connected Hub */}
      <div className="flex-1 text-center">
        <h3 className="text-4xl font-bold text-cyan-400 font-mono mb-8 neon-glow">AFTER: HARMONY</h3>
        <div className="relative h-[400px] bg-cyan-900/10 rounded-lg border border-cyan-500/30 p-6">
          
          {/* Central Optimization Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full animate-pulse" />
            <div className="absolute inset-1 neon-border bg-black/90 rounded-full flex items-center justify-center">
              <span className="text-white font-mono text-xs font-bold neon-glow">SMART<br/>HUB</span>
            </div>
          </div>
          
          {/* Connected Channels with paths */}
          {/* ... Rest of the complex visualization ... */}
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="text-green-400 text-lg">✅ <strong>Smart Budget Allocation:</strong> AI moves money to winning channels</div>
          <div className="text-green-400 text-lg">✅ <strong>Real-time Optimization:</strong> Adjustments happen automatically 24/7</div>
          <div className="text-green-400 text-lg">✅ <strong>Cross-channel Insights:</strong> See how channels work together</div>
          <div className="text-green-400 text-lg">✅ <strong>Predictive Analytics:</strong> Know which channels will perform best</div>
        </div>
      </div>
    </div>
    
    {/* Key Result */}
    <div className="mt-12 text-center">
      <div className="text-5xl font-bold text-green-400 font-mono neon-glow">
        RESULT: <span className="text-white">$9.4M ARR</span> COORDINATED
      </div>
      <div className="text-2xl text-cyan-400 font-mono mt-4">
        ALL CHANNELS WORKING TOGETHER AS ONE INTELLIGENT SYSTEM
      </div>
    </div>
  </div>
)