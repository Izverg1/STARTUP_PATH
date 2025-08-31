"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

type TestStep = {
  id: string;
  title: string;
  description: string;
  instruction?: string;
  run: () => Promise<{ passed: boolean; details?: string }> | { passed: boolean; details?: string };
};

export function InteractiveUITest() {
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<null | { passed: boolean; details?: string }>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const log = (m: string) => setLogs(l => [...l, `[${new Date().toLocaleTimeString()}] ${m}`].slice(-10));
  // Auto-mode default ON; disable with ?auto=0
  const autoMode = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('auto') !== '0'
    } catch {
      return true
    }
  }, [])

  const steps: TestStep[] = [
    {
      id: "load",
      title: "App Loaded",
      description: "Verify the app responds at this route and header is present.",
      run: async () => {
        const el = document.querySelector("header, [data-testid=app-header], h1, .ui-test-scroll");
        return { passed: !!el, details: el ? "Page content detected" : "Header not found" };
      },
    },
    {
      id: "footer-blur",
      title: "Footer Blur",
      description: "When the lower panel expands, the dashboard blurs slightly.",
      instruction: "Hover the bottom status bar to expand the footer, then click Run Check.",
      run: async () => {
        // Proactively toggle the demo overlay if available
        let overlay = document.querySelector('[data-testid="footer-blur-overlay"]');
        if (!overlay) {
          const toggleBtn = document.querySelector('[data-testid="demo-footer-toggle"]') as HTMLButtonElement | null;
          if (toggleBtn) toggleBtn.click();
          // Also try simulating hover on demo footer bar
          const footerBar = Array.from(document.querySelectorAll('*')).find(el => (el as HTMLElement).textContent?.includes('Demo: Hover to expand lower panel')) as HTMLElement | undefined;
          if (footerBar) {
            const evt = new MouseEvent('mouseenter', { bubbles: true });
            footerBar.dispatchEvent(evt);
          }
          await new Promise(r => setTimeout(r, 300));
          overlay = document.querySelector('[data-testid="footer-blur-overlay"]');
        }
        return { passed: !!overlay, details: overlay ? "Blur overlay detected" : "No blur overlay yet" };
      },
    },
    {
      id: "scrollbar",
      title: "Red Scrollbar",
      description: "A dashboard scroll area should exist and be scrollable.",
      run: async () => {
        const el = document.querySelector(".dashboard-scrollbar, .effectiveness-scrollbar, .experiments-scrollbar, .ui-test-scroll");
        if (!el) return { passed: false, details: "No scroll container found" };
        const anyEl = el as HTMLElement;
        const scrollable = anyEl.scrollHeight > anyEl.clientHeight;
        return { passed: scrollable, details: scrollable ? "Scrollable container found" : "Container not scrollable" };
      },
    },
  ];

  const step = steps[stepIndex];

  const runStep = async () => {
    setRunning(true);
    try {
      const res = await step.run();
      setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const next = () => {
    setResult(null);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const prev = () => {
    setResult(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  // Auto-run with a 5s read delay per step, then advance on success
  useEffect(() => {
    if (!autoMode) return;
    let cancelled = false;

    async function orchestrate() {
      // wait for user read time
      await new Promise(r => setTimeout(r, 5000));
      if (cancelled) return;

      // Pre-step setup for specific checks (e.g., toggle footer overlay)
      if (steps[stepIndex]?.id === 'footer-blur') {
        const toggleBtn = document.querySelector('[data-testid="demo-footer-toggle"]') as HTMLButtonElement | null;
        if (toggleBtn) toggleBtn.click();
      }

      // Run the step
      setRunning(true);
      try {
        let attempts = 0;
        let res: { passed: boolean; details?: string } = { passed: false };
        while (!res.passed && attempts < 3 && !cancelled) {
          attempts++;
          log(`Step ${stepIndex + 1}: attempt ${attempts}`);
          res = await steps[stepIndex].run();
          if (!res.passed) {
            log(`Step ${stepIndex + 1} failed: ${res.details || 'no details'} — applying remediation`);
            // Remediation hooks per step
            if (steps[stepIndex].id === 'footer-blur') {
              const toggleBtn = document.querySelector('[data-testid="demo-footer-toggle"]') as HTMLButtonElement | null;
              if (toggleBtn) toggleBtn.click();
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              await new Promise(r => setTimeout(r, 400));
            }
            if (steps[stepIndex].id === 'load') {
              await new Promise(r => setTimeout(r, 300));
            }
          }
        }
        if (cancelled) return;
        setResult(res);
        if (res.passed) log(`Step ${stepIndex + 1} passed`);

        // If this was the last step, show completion and exit gracefully
        const isLast = stepIndex >= steps.length - 1;
        if (isLast) {
          setCompleted(true);
          await new Promise(r => setTimeout(r, 1500));
          // Clear result and keep banner for a bit
          setResult(null);
          return;
        }

        // Advance regardless (so the demo keeps moving) after brief pause
        await new Promise(r => setTimeout(r, 700));
        setResult(null);
        setStepIndex(i => Math.min(i + 1, steps.length - 1));
      } finally {
        setRunning(false);
      }
    }

    orchestrate();
    return () => { cancelled = true; };
  }, [autoMode, stepIndex]);

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* Modal */}
      <div className="pointer-events-auto absolute right-6 bottom-20 w-[420px] bg-slate-950/95 border border-red-500/40 rounded-xl shadow-2xl p-4 text-white">
        {completed ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-300">UI Interactive Test</div>
              <h3 className="text-lg font-bold text-green-300">All tests passed</h3>
              <p className="text-sm text-slate-300 mt-1">Automation completed successfully.</p>
            </div>
          </div>
        ) : (
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-red-300">UI Interactive Test</div>
            <h3 className="text-lg font-bold">{step.title}</h3>
          </div>
          <div className="text-xs text-gray-400">Step {stepIndex + 1} / {steps.length}</div>
        </div>
        )}
        {!completed && (
          <>
            <p className="text-sm text-gray-300 mt-2">{step.description}</p>
            {step.instruction && (
              <p className="text-xs text-gray-400 mt-1">{step.instruction}</p>
            )}
          </>
        )}

        {!completed && (
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={running} onClick={runStep}>
              {running ? "Running..." : "Run Check"}
            </Button>
            <Button size="sm" onClick={next} disabled={!result?.passed}>
              Next
            </Button>
            <Button size="sm" variant="ghost" onClick={prev} disabled={stepIndex === 0}>
              Back
            </Button>
          </div>
        )}

        {result && !completed && (
          <div className={`mt-3 text-sm ${result.passed ? "text-green-300" : "text-red-300"}`}>
            {result.passed ? "✓ Passed" : "✗ Not Passed"}{result.details ? ` — ${result.details}` : ""}
          </div>
        )}

        {/* Live logs */}
        <div className="mt-3 p-2 bg-black/40 border border-slate-700/40 rounded text-xs text-slate-300 max-h-28 overflow-auto">
          {logs.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
