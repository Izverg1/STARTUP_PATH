'use client'

import { ProjectOnboardingGate } from '@/components/onboarding/ProjectOnboardingGate'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to projects once user has selected/created a project
    router.replace('/dashboard/projects')
  }, [router])

  return (
    <ProjectOnboardingGate>
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          Redirecting to projects...
        </div>
      </div>
    </ProjectOnboardingGate>
  )
}