// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Hoist mocks so they apply before module imports
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/lib/api/client', () => ({
  login: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  setAuth: vi.fn(),
  isAuthenticated: vi.fn().mockReturnValue(false),
}))

import LoginPage from '@/app/(auth)/login/page'
import * as apiClient from '@/lib/api/client'
import * as authModule from '@/lib/auth'

const mockUser = {
  id: '1',
  email: 'test@atmos.app',
  display_name: 'Test',
  avatar_url: '',
  locale: 'en',
  timezone: 'UTC',
  created_at: '',
  updated_at: '',
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authModule.isAuthenticated).mockReturnValue(false)
  })

  it('renders email and password inputs', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders the sign-in button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders a link to the signup page', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup')
  })

  it('calls login() with the entered credentials on submit', async () => {
    vi.mocked(apiClient.login).mockResolvedValue({
      access_token: 'tok',
      refresh_token: 'ref',
      user: mockUser,
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@atmos.app' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledWith({
        email: 'test@atmos.app',
        password: 'Test1234!',
      })
    })
  })

  it('calls setAuth and redirects to / on successful login', async () => {
    vi.mocked(apiClient.login).mockResolvedValue({
      access_token: 'tok',
      refresh_token: 'ref',
      user: mockUser,
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@atmos.app' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(authModule.setAuth).toHaveBeenCalledWith('tok', 'ref', mockUser)
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('disables the button and inputs while submitting', async () => {
    vi.mocked(apiClient.login).mockImplementation(() => new Promise(() => {})) // never resolves

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@atmos.app' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/password/i)).toBeDisabled()
    })
  })

  it('shows an error message when login fails', async () => {
    vi.mocked(apiClient.login).mockRejectedValue(new Error('Invalid credentials'))

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@atmos.app' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
    })
  })

  it('redirects to / immediately if already authenticated', () => {
    vi.mocked(authModule.isAuthenticated).mockReturnValue(true)
    render(<LoginPage />)
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
