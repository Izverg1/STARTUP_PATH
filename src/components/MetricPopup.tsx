'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Info, X } from 'lucide-react'

interface MetricPopupProps {
  metric: string
  value: string
  rationale: string
  source?: string
  sourceUrl?: string
  methodology?: string
  className?: string
}

export function MetricPopup({ metric, value, rationale, source, sourceUrl, methodology, className = "" }: MetricPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonRect(rect)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const renderPopup = () => {
    if (!mounted || !isOpen || !buttonRect) return null

    return createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
        
        {/* Popup */}
        <div 
          className="fixed z-[9999] w-72 bg-gray-900/95 border border-cyan-500/30 rounded-lg p-4 shadow-xl backdrop-blur-sm"
          style={{
            left: Math.max(8, Math.min(window.innerWidth - 296, buttonRect.left + buttonRect.width / 2 - 144)),
            top: Math.max(8, buttonRect.top - 8),
            transform: 'translateY(-100%)'
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h4 className="text-sm font-bold text-cyan-400 mb-2">{metric}</h4>
          <p className="text-xs text-gray-300 mb-2">{rationale}</p>
          
          {methodology && (
            <div className="mb-2">
              <h5 className="text-xs font-semibold text-yellow-400 mb-1">Methodology:</h5>
              <p className="text-xs text-gray-400">{methodology}</p>
            </div>
          )}
          
          {source && (
            <div className="border-t border-gray-700 pt-2">
              <h5 className="text-xs font-semibold text-gray-400 mb-1">Source:</h5>
              {sourceUrl ? (
                <a 
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {source}
                </a>
              ) : (
                <p className="text-xs text-gray-500">{source}</p>
              )}
            </div>
          )}
          
          {/* Arrow pointing down */}
          <div 
            className="absolute -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-900/95"
            style={{
              left: Math.max(8, Math.min(280, buttonRect.left + buttonRect.width / 2 - (buttonRect.left + buttonRect.width / 2 - 144) + 144 - 8))
            }}
          />
        </div>
      </>,
      document.body
    )
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`relative group ${className} cursor-pointer border-b border-dotted border-cyan-400/50 hover:border-cyan-400`}
        aria-label={`Learn more about ${metric}`}
      >
        <span className="relative">
          {value}
          <span className="absolute -top-1 -right-4 animate-pulse">
            <Info className="w-3 h-3 text-cyan-400" />
          </span>
          <span className="absolute -top-1 -right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-white" />
          </span>
        </span>
      </button>

      {renderPopup()}
    </div>
  )
}