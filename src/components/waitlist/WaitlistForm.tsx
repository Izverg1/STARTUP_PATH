'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface WaitlistFormProps {
  type: 'customer' | 'partner'
  title: string
  description: string
  benefits: string[]
  icon: string
  borderColor: string
  buttonColor: string
  accentColor: string
}

export function WaitlistForm({
  type,
  title,
  description,
  benefits,
  icon,
  borderColor,
  buttonColor,
  accentColor
}: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    position: '',
    additionalField: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const additionalInfo: any = {
        source: 'landing_page'
      }

      // Add type-specific additional info
      if (type === 'customer') {
        additionalInfo.monthlyBudget = formData.additionalField
        additionalInfo.industry = 'SaaS'
      } else {
        additionalInfo.partnershipType = formData.additionalField
      }

      console.log('Submitting waitlist form:', {
        email: formData.email,
        company: formData.company,
        type,
        additionalInfo
      })

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          company: formData.company || undefined,
          position: formData.position || undefined,
          type,
          additionalInfo
        }),
      })

      const result = await response.json()
      console.log('Waitlist API response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join waitlist')
      }

      setStatus('success')
      setMessage(result.message)
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        company: '',
        position: '',
        additionalField: ''
      })

    } catch (error) {
      console.error('Waitlist submission error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (status === 'success') {
    return (
      <Card className={`bg-black border ${borderColor} p-8 text-center`}>
        <div className={`text-4xl mb-4`}>✅</div>
        <h3 className={`text-2xl font-bold ${accentColor} mb-4`}>Welcome to the waitlist!</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• You'll receive email updates on our progress</p>
          <p>• Early access when we launch</p>
          <p>• Special launch pricing available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`bg-black border ${borderColor} p-6 hover:border-opacity-50 transition-all duration-300`}>
      <div className="text-center">
        <div className={`text-3xl mb-4`}>{icon}</div>
        <h3 className={`text-xl font-bold ${accentColor} mb-3`}>{title}</h3>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        
        {/* Benefits */}
        <div className="space-y-2 text-left mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
              <div className={`w-1.5 h-1.5 ${accentColor.replace('text-', 'bg-')} rounded-full`} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input 
            type="email" 
            placeholder="Your email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 text-sm h-9 focus:outline-none focus:ring-2 ${type === 'customer' ? 'focus:border-cyan-500 focus:ring-cyan-500/20' : 'focus:border-purple-500 focus:ring-purple-500/20'}`}
            required
            disabled={status === 'loading'}
            autoComplete="email"
          />
          <Input 
            type="text" 
            placeholder="Company name"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 text-sm h-9 focus:outline-none focus:ring-2 ${type === 'customer' ? 'focus:border-cyan-500 focus:ring-cyan-500/20' : 'focus:border-purple-500 focus:ring-purple-500/20'}`}
            disabled={status === 'loading'}
            autoComplete="organization"
          />
          <Input 
            type="text" 
            placeholder={type === 'customer' ? 'Monthly marketing budget' : 'Partnership type (Agency, Integration, etc.)'}
            value={formData.additionalField}
            onChange={(e) => handleInputChange('additionalField', e.target.value)}
            className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 text-sm h-9 focus:outline-none focus:ring-2 ${type === 'customer' ? 'focus:border-cyan-500 focus:ring-cyan-500/20' : 'focus:border-purple-500 focus:ring-purple-500/20'}`}
            disabled={status === 'loading'}
          />
          
          <Button 
            type="submit"
            disabled={status === 'loading' || !formData.email}
            className={`w-full ${buttonColor} text-white font-bold py-2 text-sm disabled:opacity-50`}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              `Join ${type === 'customer' ? 'Customer' : 'Partner'} Waitlist`
            )}
          </Button>
        </form>
        
        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}
        
        <div className="mt-3 text-xs text-gray-400">
          {type === 'customer' ? '500+ startups already in line' : '50+ partners interested'}
        </div>
      </div>
    </Card>
  )
}