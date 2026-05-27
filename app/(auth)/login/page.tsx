'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/api/client'
import { isAuthenticated, setAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GoogleButton } from '@/components/ui/GoogleButton'

function AtmosLogo() {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-horizon-blue to-sage">
        <span className="text-[17px] font-bold leading-none text-white">a</span>
      </div>
      <span className="text-[17px] font-semibold text-text-primary">atmos</span>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/')
    }
    if (searchParams.get('error') === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.')
    }
  }, [router, searchParams])

  function handleGoogleSignIn() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'
    window.location.href = `${apiUrl}/api/v1/auth/google/login`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await login({ email, password })
      setAuth(result.access_token, result.refresh_token, result.user)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <h1 className="mb-6 text-subheading font-semibold text-text-primary">Sign in</h1>

      {/* Google OAuth */}
      <GoogleButton onClick={handleGoogleSignIn} />

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#F0F2F5]" />
        <span className="text-[12px] text-text-secondary">or</span>
        <div className="h-px flex-1 bg-[#F0F2F5]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          disabled={loading}
        />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-alert-red"
          >
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-horizon-blue hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-[400px]">
      <AtmosLogo />
      <Suspense fallback={<div className="rounded-2xl bg-white p-8 shadow-card" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
