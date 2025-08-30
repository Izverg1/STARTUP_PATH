"use client";

import { useState, useEffect } from "react";
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

  const steps: TestStep[] = [
    {
      id: "load",
      title: "App Loaded",
      description: "Verify the app responds at this route and header is present.",
      run: async () => {
        const header = document.querySelector("header, [data-testid=app-header]");
        return { passed: !!header, details: header ? "Header found" : "Header not found" };
      },
    },
    {
      id: "footer-blur",
      title: "Footer Blur",
      description: "When the lower panel expands, the dashboard blurs slightly.",
      instruction: "Hover the bottom status bar to expand the footer, then click Run Check.",
      run: async () => {
        const overlay = document.querySelector('[data-testid="footer-blur-overlay"]');
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

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* Modal */}
      <div className="pointer-events-auto absolute right-6 bottom-20 w-[420px] bg-slate-950/95 border border-red-500/40 rounded-xl shadow-2xl p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-red-300">UI Interactive Test</div>
            <h3 className="text-lg font-bold">{step.title}</h3>
          </div>
          <div className="text-xs text-gray-400">Step {stepIndex + 1} / {steps.length}</div>
        </div>
        <p className="text-sm text-gray-300 mt-2">{step.description}</p>
        {step.instruction && (
          <p className="text-xs text-gray-400 mt-1">{step.instruction}</p>
        )}

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

        {result && (
          <div className={`mt-3 text-sm ${result.passed ? "text-green-300" : "text-red-300"}`}>
            {result.passed ? "✓ Passed" : "✗ Not Passed"}{result.details ? ` — ${result.details}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

