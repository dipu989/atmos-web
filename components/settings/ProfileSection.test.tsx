// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProfileSection } from './ProfileSection'
import type { User } from '@/types/index'

// ─── Mock TanStack Query hooks ─────────────────────────────────────────────────
const mockUpdateMeMutateAsync = vi.fn()
const mockUpdatePrefsMutateAsync = vi.fn()

const verifiedUser: User = {
  id: 'u1',
  email: 'test@example.com',
  display_name: 'Test User',
  avatar_url: '',
  locale: 'en',
  timezone: 'UTC',
  email_verified_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockUseMe = vi.fn()

function setMeData(data: User) {
  mockUseMe.mockReturnValue({ data, isLoading: false, isError: false })
}

vi.mock('@/lib/hooks/useTrips', () => ({
  useMe: () => mockUseMe(),
  usePreferences: () => ({
    data: {
      distance_unit: 'km',
      push_notifications_enabled: false,
      daily_goal_kg_co2e: 5,
    },
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('@/lib/hooks/useMutations', () => ({
  useUpdateMe: () => ({
    mutateAsync: mockUpdateMeMutateAsync,
    isPending: false,
  }),
  useUpdatePreferences: () => ({
    mutateAsync: mockUpdatePrefsMutateAsync,
    isPending: false,
  }),
}))

describe('ProfileSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateMeMutateAsync.mockResolvedValue({})
    mockUpdatePrefsMutateAsync.mockResolvedValue({})
    setMeData(verifiedUser)
  })

  it('renders all fields', () => {
    render(<ProfileSection />)
    expect(screen.getByText('Full name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Time zone')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Distance unit')).toBeInTheDocument()
  })

  it('shows the user email in a read-only input', () => {
    render(<ProfileSection />)
    const emailInput = screen.getByDisplayValue('test@example.com')
    expect(emailInput).toBeDisabled()
  })

  it('shows Verified badge next to email when email_verified_at is set', () => {
    render(<ProfileSection />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('hides Verified badge when email_verified_at is null', () => {
    setMeData({ ...verifiedUser, email_verified_at: null })
    render(<ProfileSection />)
    expect(screen.queryByText('Verified')).not.toBeInTheDocument()
  })

  it('pre-fills name from user data', () => {
    render(<ProfileSection />)
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
  })

  it('submit sends PUT /users/me when name changes', async () => {
    render(<ProfileSection />)
    const nameInput = screen.getByDisplayValue('Test User')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    fireEvent.click(screen.getByText('Save changes'))
    await waitFor(() => {
      expect(mockUpdateMeMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ display_name: 'New Name' }),
      )
    })
  })

  it('shows success toast after saving', async () => {
    render(<ProfileSection />)
    const nameInput = screen.getByDisplayValue('Test User')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    fireEvent.click(screen.getByText('Save changes'))
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Changes saved')
    })
  })

  it('shows error toast when API call fails', async () => {
    mockUpdateMeMutateAsync.mockRejectedValue(new Error('Server error'))
    render(<ProfileSection />)
    const nameInput = screen.getByDisplayValue('Test User')
    fireEvent.change(nameInput, { target: { value: 'Bad Name' } })
    fireEvent.click(screen.getByText('Save changes'))
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Server error')
    })
  })

  it('shows "No changes to save" toast when nothing has changed', async () => {
    render(<ProfileSection />)
    fireEvent.click(screen.getByText('Save changes'))
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('No changes to save')
    })
  })
})
