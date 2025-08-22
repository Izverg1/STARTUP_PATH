'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TutorialStep {
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const tutorialSteps: TutorialStep[] = [
  {
    target: '.experiment-controls',
    title: 'Experiment Controls',
    content: 'Access tutorial, filters, and design new experiments from this control panel.',
    position: 'bottom'
  },
  {
    target: '.metrics-overview',
    title: 'Performance Overview',
    content: 'Monitor your experiment metrics: active experiments, budget allocation, confidence levels, and success rates.',
    position: 'bottom'
  },
  {
    target: '.simulation-results',
    title: 'Active Experiments',
    content: 'View your running experiments with real-time performance data, confidence levels, and budget tracking.',
    position: 'top'
  },
  {
    target: '.lab-workspace',
    title: 'Thompson Sampling Lab',
    content: 'This workspace uses Thompson Sampling for optimal experiment allocation and statistical accuracy.',
    position: 'bottom'
  }
]

export function Tutorial({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [fadeoutComplete, setFadeoutComplete] = useState(false)
  const [tutorialActive, setTutorialActive] = useState(false)
  
  const step = tutorialSteps[currentStep]
  
  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(step.target)
      if (element) {
        const rect = element.getBoundingClientRect()
        let top = 0
        let left = 0
        
        switch (step.position) {
          case 'bottom':
            top = rect.bottom + 10
            left = rect.left + rect.width / 2
            break
          case 'top':
            top = rect.top - 10
            left = rect.left + rect.width / 2
            break
          case 'left':
            top = rect.top + rect.height / 2
            left = rect.left - 10
            break
          case 'right':
            top = rect.top + rect.height / 2
            left = rect.right + 10
            break
        }
        
        setPosition({ top, left })
      } else {
        // Fallback position if element not found - center of screen
        setPosition({ 
          top: window.innerHeight / 2, 
          left: window.innerWidth / 2 
        })
      }
      setIsVisible(true)
    }
    
    // Delay to ensure elements are rendered
    const timer = setTimeout(updatePosition, 100)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updatePosition)
    }
  }, [currentStep, step])
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 200)
    } else {
      handleComplete()
    }
  }
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
      }, 200)
    }
  }
  
  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true')
    onComplete()
  }
  
  const getTooltipStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      transition: 'opacity 0.2s',
      opacity: isVisible ? 1 : 0
    }
    
    // Check if element exists to determine if we should use fallback positioning
    const element = document.querySelector(step.target)
    
    if (!element) {
      // Fallback to center positioning if element not found
      return {
        ...baseStyles,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -50%)'
      }
    }
    
    switch (step.position) {
      case 'bottom':
        return {
          ...baseStyles,
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)'
        }
      case 'top':
        return {
          ...baseStyles,
          bottom: `${window.innerHeight - position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)'
        }
      case 'left':
        return {
          ...baseStyles,
          top: `${position.top}px`,
          right: `${window.innerWidth - position.left}px`,
          transform: 'translateY(-50%)'
        }
      case 'right':
        return {
          ...baseStyles,
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateY(-50%)'
        }
    }
  }
  
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[9998]" />
      
      {/* Highlight target element */}
      {isVisible && (
        <style jsx>{`
          ${step.target} {
            position: relative;
            z-index: 9998;
            box-shadow: 0 0 0 4px rgba(255, 0, 64, 0.5);
            border-radius: 8px;
          }
        `}</style>
      )}
      
      {/* Tooltip */}
      <div style={getTooltipStyles()}>
        <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4 max-w-sm shadow-2xl">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-semibold text-lg">{step.title}</h3>
            <button
              onClick={handleComplete}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{step.content}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">
              {currentStep + 1} of {tutorialSteps.length}
            </span>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Arrow pointer - only show if target element exists */}
        {document.querySelector(step.target) && (
          <div 
            className="absolute w-0 h-0"
            style={{
              ...(step.position === 'bottom' && {
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid rgb(17 24 39)'
              }),
              ...(step.position === 'top' && {
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgb(17 24 39)'
              }),
              ...(step.position === 'left' && {
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '8px solid rgb(17 24 39)'
              }),
              ...(step.position === 'right' && {
                left: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: '8px solid rgb(17 24 39)'
              })
            }}
          />
        )}
      </div>
    </>
  )
}