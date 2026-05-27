'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

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
    <main className="min-h-screen bg-white antialiased">
    </main>
  )
}
