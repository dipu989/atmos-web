'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/lib/api/client'
import { isAuthenticated, setAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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

export default function SignUpPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await signup({ email, password, display_name: displayName })
      setAuth(result.access_token, result.refresh_token, result.user)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <AtmosLogo />

      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="mb-6 text-subheading font-semibold text-text-primary">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
            disabled={loading}
          />
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
            autoComplete="new-password"
            minLength={8}
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
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-horizon-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
