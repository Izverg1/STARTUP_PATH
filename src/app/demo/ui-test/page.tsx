'use client'

import { InteractiveUITest } from '@/components/testing/InteractiveUITest'
// Standalone page to avoid onboarding gates; includes its own demo footer
import { useState } from 'react'

export default function UITestPage() {
  const [showFooterDemo, setShowFooterDemo] = useState(false)
  return (
      <div className="relative min-h-[80vh] p-6 bg-black">
        <header data-testid="app-header" className="mb-4 flex items-center justify-between border-b border-slate-700/40 pb-3">
          <div className="text-white font-semibold">STARTUP_PATH Demo</div>
          <div className="text-xs text-slate-400">UI Interactive Test</div>
        </header>
        <h1 className="text-2xl font-bold text-white mb-2">Interactive UI Test</h1>
        <p className="text-gray-300 mb-6">
          Follow the popup to run checks. Hover the bottom status bar to expand the lower panel when prompted.
        </p>

      {/* Demo scroll container to verify red scrollbar styling */}
        <div className="ui-test-scroll dashboard-scrollbar h-64 overflow-y-auto bg-black/40 border border-red-500/30 rounded-md p-4 text-gray-200">
          {[...Array(20)].map((_, i) => (
            <p key={i} className="mb-2">Scrollable content line {i + 1} — this container forces a custom red scrollbar for the test.</p>
          ))}
        </div>

        {/* Manual toggle for automated tests */}
        <button
          data-testid="demo-footer-toggle"
          className="mt-4 text-xs text-cyan-300 underline"
          onClick={() => setShowFooterDemo((v) => !v)}
        >
          Toggle demo footer overlay
        </button>

        {/* Demo footer bar to simulate expansion/blur in this route */}
        <div
          className="fixed bottom-0 left-0 right-0 z-20 shrink-0 bg-slate-950/80 border-t border-slate-700/40 px-6 py-2 cursor-pointer hover:bg-slate-800/30 transition-all duration-200 backdrop-blur-md"
          onMouseEnter={() => setShowFooterDemo(true)}
          onMouseLeave={() => setShowFooterDemo(false)}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-white font-medium">
              Demo: Hover to expand lower panel and blur content
            </div>
            <div className="text-xs text-slate-400">Hover me</div>
          </div>
        </div>

        {/* Blur overlay for demo */}
        {showFooterDemo && (
          <div
            data-testid="footer-blur-overlay"
            className="absolute inset-0 z-20 bg-black/5 backdrop-blur-[1px] transition-opacity duration-300"
          />
        )}

        {/* Overlay runner */}
        <InteractiveUITest />
      </div>
  )
}
