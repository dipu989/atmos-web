'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setAuth } from '@/lib/auth'
import { getMe } from '@/lib/api/client'

/**
 * OAuth callback page — /auth/callback
 *
 * After Google OAuth the backend redirects here with:
 *   ?access_token=<jwt>&refresh_token=<jwt>
 *
 * This page:
 *   1. Reads tokens from query params
 *   2. Fetches /users/me using the access token to get the user object
 *   3. Persists everything via setAuth()
 *   4. Strips tokens from the URL (no tokens in browser history)
 *   5. Redirects to /dashboard
 *
 * On any failure → redirects to /login?error=oauth_failed
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken || !refreshToken) {
        router.replace('/login?error=oauth_failed')
        return
      }

      try {
        // Strip tokens from URL immediately so they don't sit in browser history
        window.history.replaceState({}, '', '/auth/callback')

        // Fetch user profile using the new access token
        const user = await getMe(accessToken)

        setAuth(accessToken, refreshToken, user)
        router.replace('/')
      } catch {
        router.replace('/login?error=oauth_failed')
      }
    }

    void handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-horizon-blue border-t-transparent" />
        <p className="text-[14px] text-text-secondary">Completing sign in…</p>
      </div>
    </div>
  )
}
