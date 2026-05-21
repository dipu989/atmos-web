// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders without a label when label prop is omitted', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.queryByRole('label')).toBeNull()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders a label when the label prop is provided', () => {
    render(<Input label="Email address" />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('associates the label with the input via htmlFor/id', () => {
    render(<Input label="Email address" />)
    const input = screen.getByLabelText('Email address')
    expect(input.tagName).toBe('INPUT')
  })

  it('renders the error message when error prop is provided', () => {
    render(<Input label="Email" error="Invalid email address" />)
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
  })

  it('applies error border class when error prop is set', () => {
    render(<Input label="Email" error="Required" />)
    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('border-alert-red')
  })

  it('does not show an error message when error prop is absent', () => {
    render(<Input label="Email" />)
    expect(screen.queryByRole('paragraph')).toBeNull()
  })

  it('passes through standard HTML input attributes', () => {
    render(<Input label="Email" type="email" placeholder="you@example.com" disabled />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'you@example.com')
    expect(input).toBeDisabled()
  })
})
