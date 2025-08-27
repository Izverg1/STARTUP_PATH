'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is trying to access a specific settings tab
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    
    // Map old settings tabs to new account tabs
    const tabMapping: Record<string, string> = {
      'profile': 'personal',
      'organization': 'organization', 
      'performance': 'preferences',
      'security': 'security'
    }

    const targetTab = tabMapping[tabParam || ''] || 'organization'
    
    // Redirect to the new unified Account page
    router.replace(`/dashboard/account?tab=${targetTab}`)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="text-gray-400 mb-2">Redirecting to Account...</div>
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}