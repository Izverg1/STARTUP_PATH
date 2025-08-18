'use client'

import { useState, useEffect } from 'react'
import { MetricPopup } from '@/components/MetricPopup'

// Slide 3: Channel Assessment Pipeline with Animations
export function Slide3Animated() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Channel Assessment Pipeline</h2>
          <p className="text-gray-400">Transform scattered channels into optimized budget allocation</p>
        </div>

        {/* Horizontal Pipeline with animations */}
        <div className="relative">
          {/* Animated flow particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-px">
              <div className="w-4 h-4 bg-cyan-400/30 rounded-full animate-pipeline-flow" />
              <div className="w-4 h-4 bg-cyan-400/30 rounded-full animate-pipeline-flow animation-delay-500" />
              <div className="w-4 h-4 bg-cyan-400/30 rounded-full animate-pipeline-flow" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Input: Channels - Animated */}
            <div className={`flex-1 bg-gray-900/50 border border-red-500/20 rounded-lg p-5 transition-all duration-700 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <h3 className="text-xs font-mono text-red-400 mb-3 uppercase">Channel Inputs</h3>
              <div className="space-y-2">
                {['Google Ads', 'LinkedIn', 'Facebook', 'Content'].map((channel, i) => (
                  <div key={channel} className={`flex items-center gap-2 animate-slide-in-right animation-delay-${(i + 1) * 100}`}>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-data-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    <span className="text-sm text-gray-300">{channel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated arrows between stages */}
            <svg className="w-5 h-5 text-gray-600">
              <path d="M0 10 L15 10 M10 5 L15 10 L10 15" stroke="currentColor" strokeWidth="2" fill="none" className="animate-connection-draw" />
            </svg>

            {/* Process 1: Data Collection - Animated */}
            <div className={`flex-1 bg-gray-900/50 border border-gray-700/30 rounded-lg p-5 transition-all duration-700 animation-delay-200 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <h3 className="text-xs font-mono text-gray-400 mb-3 uppercase">Data Collection</h3>
              <div className="text-center">
                <div className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin-slow">
                  {/* Animated icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" className="animate-pulse"/>
                    <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" className="animate-pulse animation-delay-300"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>CTR • CAC</div>
                  <div>Conversions</div>
                  <div className="text-xs text-gray-600 mt-2">
                    <MetricPopup 
                      metric="Data Volume"
                      value="500K+ data points"
                      rationale="We process 500,000+ data points weekly from all connected channels, enabling statistically significant optimization decisions within 2-3 weeks instead of months."
                      source="Internal platform analytics (2024)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <svg className="w-5 h-5 text-gray-600">
              <path d="M0 10 L15 10 M10 5 L15 10 L10 15" stroke="currentColor" strokeWidth="2" fill="none" className="animate-connection-draw animation-delay-300" />
            </svg>

            {/* Process 2: AI Analysis - Animated */}
            <div className={`flex-1 bg-gray-900/50 border border-cyan-500/20 rounded-lg p-5 transition-all duration-700 animation-delay-400 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <h3 className="text-xs font-mono text-cyan-400 mb-3 uppercase">AI Optimization</h3>
              <div className="text-center">
                <div className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-pulse">
                  {/* Brain icon animated */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" className="animate-ping" />
                  </svg>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Thompson Sampling</div>
                  <div>Budget Allocation</div>
                  <div className="text-xs text-cyan-400 mt-2">Real-time</div>
                </div>
              </div>
            </div>

            <svg className="w-5 h-5 text-gray-600">
              <path d="M0 10 L15 10 M10 5 L15 10 L10 15" stroke="currentColor" strokeWidth="2" fill="none" className="animate-connection-draw animation-delay-500" />
            </svg>

            {/* Output: Optimized Budget - Animated with Popups */}
            <div className={`flex-1 bg-gray-900/50 border border-green-500/20 rounded-lg p-5 transition-all duration-700 animation-delay-600 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <h3 className="text-xs font-mono text-green-400 mb-3 uppercase">Optimized Output</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Google</span>
                  <MetricPopup 
                    metric="Google Ads Allocation"
                    value="45%"
                    rationale="Google Ads typically shows 2-3x better conversion rates (7-10%) for B2B SaaS compared to social channels. With $300 CPQM vs $600+ on other channels, it deserves the largest allocation."
                    source="WordStream 2024, Y Combinator benchmarks"
                    className="text-green-400 font-bold animate-metric-reveal animation-delay-700"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">LinkedIn</span>
                  <MetricPopup 
                    metric="LinkedIn Allocation"
                    value="25%"
                    rationale="LinkedIn shows 3-5% conversion for B2B with high-quality leads. Average CPQM of $450 makes it our second-best performer for enterprise deals."
                    source="LinkedIn Marketing Solutions 2024"
                    className="text-yellow-400 font-bold animate-metric-reveal animation-delay-800"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Facebook</span>
                  <MetricPopup 
                    metric="Facebook Allocation"
                    value="15%"
                    rationale="Facebook/Meta typically underperforms for B2B with 1-2% conversion. We maintain minimal spend for brand awareness and retargeting only."
                    source="Meta Business 2024 B2B Report"
                    className="text-red-400 font-bold animate-metric-reveal"
                    style={{ animationDelay: '900ms' }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Content</span>
                  <MetricPopup 
                    metric="Content Marketing Allocation"
                    value="15%"
                    rationale="Content/SEO shows 35-45% webinar attendance rates with lowest CAC over time. Small allocation due to longer payback period (6-12 months)."
                    source="ON24, DemandSage 2025"
                    className="text-cyan-400 font-bold animate-metric-reveal"
                    style={{ animationDelay: '1000ms' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Loop - Animated */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-gray-900/30 rounded-full px-4 py-2 animate-pulse">
              <span className="text-xs text-gray-500 uppercase tracking-wider">← Continuous Optimization Loop →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Slide 5: Results with Animated Metrics and Popups
export function Slide5Animated() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-w-full h-full flex-shrink-0 flex items-center px-16 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Performance Measurement Pipeline</h2>
          <p className="text-gray-400">Real results from optimized channel allocation</p>
        </div>

        {/* Horizontal Metrics Flow */}
        <div className="relative">
          <div className="flex items-center justify-center gap-8">
            
            {/* Before State - Animated */}
            <div className={`flex-1 max-w-sm transition-all duration-700 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="bg-gray-900/50 border border-red-500/20 rounded-lg p-6">
                <h3 className="text-sm font-mono text-red-400 mb-4 uppercase">Before Optimization</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">CAC</span>
                    <MetricPopup 
                      metric="Customer Acquisition Cost"
                      value="$2,400"
                      rationale="Typical early-stage startup CAC without optimization. Based on unoptimized spend across channels with 0.8% conversion rate and $300K annual marketing spend."
                      source="OpenView 2024 SaaS Benchmarks"
                      className="text-red-400 font-bold"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Conversion</span>
                    <MetricPopup 
                      metric="Conversion Rate"
                      value="0.8%"
                      rationale="Industry average for cold outreach is 1-5%. Early-stage startups typically see lower end (0.5-1%) due to limited brand recognition."
                      source="Martal, ManyReach 2024-2025"
                      className="text-red-400 font-bold"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">ROAS</span>
                    <MetricPopup 
                      metric="Return on Ad Spend"
                      value="0.7x"
                      rationale="Below breakeven ROAS means you're losing $0.30 for every $1 spent. Common in early stages before channel optimization."
                      source="Industry analysis"
                      className="text-red-400 font-bold"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payback</span>
                    <MetricPopup 
                      metric="CAC Payback Period"
                      value="18 months"
                      rationale="VCs want to see 12-18 month payback before Series A. 18+ months indicates inefficient GTM that needs optimization."
                      source="Bessemer 2023, OpenView/Paddle 2024"
                      className="text-red-400 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transformation Arrow - Animated */}
            <div className={`flex flex-col items-center transition-all duration-700 animation-delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-full mb-2 animate-pulse">
                <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-cyan-400 uppercase">AI Optimization</span>
            </div>

            {/* After State - Animated with Popups */}
            <div className={`flex-1 max-w-sm transition-all duration-700 animation-delay-600 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
                <h3 className="text-sm font-mono text-green-400 mb-4 uppercase">After Optimization</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">CAC</span>
                    <MetricPopup 
                      metric="Optimized CAC"
                      value="$680"
                      rationale="72% reduction achieved by reallocating 30% of budget from $600 CPQM channels to $300 CPQM channels, as shown in our runway optimization example."
                      source="Platform simulation results"
                      className="text-green-400 font-bold animate-metric-reveal animation-delay-700"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Conversion</span>
                    <MetricPopup 
                      metric="Optimized Conversion"
                      value="3.2%"
                      rationale="4x improvement through A/B testing, better targeting, and focusing on high-intent channels. Achievable within 2-3 months of optimization."
                      source="Platform historical data"
                      className="text-green-400 font-bold animate-metric-reveal animation-delay-800"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">ROAS</span>
                    <MetricPopup 
                      metric="Optimized ROAS"
                      value="2.4x"
                      rationale="240% improvement means $2.40 return for every $1 spent. Achieved through Thompson Sampling allocation and continuous optimization."
                      source="Platform performance metrics"
                      className="text-green-400 font-bold animate-metric-reveal"
                      style={{ animationDelay: '900ms' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payback</span>
                    <MetricPopup 
                      metric="Optimized Payback"
                      value="4 months"
                      rationale="77% faster payback achieved through lower CAC and higher conversion. This meets VC expectations for efficient growth."
                      source="Portfolio company benchmarks"
                      className="text-green-400 font-bold animate-metric-reveal"
                      style={{ animationDelay: '1000ms' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Results Bar - Animated */}
          <div className={`mt-10 flex justify-center gap-8 transition-all duration-700 animation-delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center animate-slide-in-left" style={{ animationDelay: '1100ms' }}>
              <div className="text-3xl font-bold text-green-400 animate-count-up">
                <MetricPopup 
                  metric="CAC Reduction"
                  value="72%"
                  rationale="From $2,400 to $680. This 72% reduction is achieved through intelligent channel allocation, moving budget from low-performing to high-performing channels."
                  source="Based on CPQM optimization formula"
                />
              </div>
              <div className="text-sm text-gray-400">Lower CAC</div>
            </div>
            <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center animate-slide-in-left" style={{ animationDelay: '1200ms' }}>
              <div className="text-3xl font-bold text-cyan-400 animate-count-up">
                <MetricPopup 
                  metric="Conversion Improvement"
                  value="4x"
                  rationale="From 0.8% to 3.2%. Achieved through better targeting, A/B tested messaging, and focusing spend on channels with proven performance."
                  source="Platform optimization results"
                />
              </div>
              <div className="text-sm text-gray-400">Higher Conversion</div>
            </div>
            <div className="bg-gray-900/30 rounded-lg px-6 py-4 text-center animate-slide-in-left" style={{ animationDelay: '1300ms' }}>
              <div className="text-3xl font-bold text-purple-400 animate-count-up">
                <MetricPopup 
                  metric="ROAS Improvement"
                  value="240%"
                  rationale="From 0.7x to 2.4x ROAS. This transformation turns a money-losing operation into a profitable growth engine within 3-6 months."
                  source="Customer success metrics"
                />
              </div>
              <div className="text-sm text-gray-400">Better ROAS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}