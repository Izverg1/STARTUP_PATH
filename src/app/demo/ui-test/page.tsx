'use client'

import { InteractiveUITest } from '@/components/testing/InteractiveUITest'

export default function UITestPage() {
  return (
    <div className="relative min-h-[60vh] p-6">
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

      {/* Overlay runner */}
      <InteractiveUITest />
    </div>
  )
}

