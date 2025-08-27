'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new unified Account page
    router.replace('/dashboard/account?tab=personal')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="text-gray-400 mb-2">Redirecting to Account...</div>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}