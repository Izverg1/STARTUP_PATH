'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react'

interface HeroSectionProps {
  onCTAClick?: () => void
  className?: string
}

export function HeroSection({ onCTAClick, className }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-white ${className}`}>
      {/* Clean background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/20" />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium">
          <span>SOL:GEN for startups™</span>
        </div>

        {/* Main headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Scientific Channel Fit,
            <br />
            <span className="text-blue-600">
              Simulated
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founders, your runway is finite. Every dollar on marketing burn rate demands 
            <strong> traction</strong> and <strong>PMF</strong>. SOL:GEN is built by founders for founders, providing a 
            simulated sandbox to test acquisition channels, validate your MVP, and de-risk 
            your go-to-market strategy. We help you find founder-led sales breakthroughs, 
            identify growth hacking opportunities, and prepare defensible payback math for 
            your pre-seed or Series A investor pitch. Stop guessing, start scaling.
          </p>
        </div>

        {/* Key value proposition */}
        <div className="text-2xl md:text-3xl font-bold text-blue-600">
          Optimize your burn rate. Accelerate your unicorn potential.
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            onClick={onCTAClick}
            size="lg"
            className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg transition-colors duration-300"
          >
            Join Founder Cohort
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <a href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              Explore Demo
            </Button>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="pt-8 space-y-4">
          <p className="text-gray-500 text-sm">Built by founders, for founders</p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}