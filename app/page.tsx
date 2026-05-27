'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { LandingNav } from '@/components/landing/LandingNav'

/**
 * Root page — /
 *
 * Authenticated users are redirected immediately to the dashboard.
 * Everyone else sees the landing page.
 */
export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white antialiased">
      <LandingNav />
      <main>
        {/* Sections added here as they are built */}
      </main>
    </div>
  )
}
