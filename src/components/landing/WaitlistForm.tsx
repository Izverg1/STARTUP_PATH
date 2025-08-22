'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface WaitlistFormProps {
  className?: string
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Store in localStorage for demo
      const existingEmails = JSON.parse(localStorage.getItem('startup-path-waitlist') || '[]')
      if (!existingEmails.includes(email)) {
        existingEmails.push(email)
        localStorage.setItem('startup-path-waitlist', JSON.stringify(existingEmails))
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className={`p-8 bg-gradient-to-br from-gray-900/90 to-black/90 border-red-500/20 backdrop-blur-sm ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">You're on the list!</h3>
          <p className="text-gray-400">
            Welcome to the STARTUP_PATH founder cohort. We'll notify you when early access opens.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            Add Another Email
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-8 bg-gradient-to-br from-gray-900/90 to-black/90 border-red-500/20 backdrop-blur-sm ${className}`}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Join the Founder Cohort</h3>
          <p className="text-gray-400">
            Secure early access to STARTUP_PATH and optimize your burn rate with scientific channel fit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="founder@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all duration-300"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Joining Cohort...</span>
              </div>
            ) : (
              'Secure Early Access'
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500">
          By joining, you agree to receive updates about STARTUP_PATH.
          <br />
          © 2025 <a href="https://iamkarlson.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">KARLSON LLC</a>. Built by founders, for founders.
        </div>
      </div>
    </Card>
  )
}