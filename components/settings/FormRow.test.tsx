// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormRow } from './FormRow'

describe('FormRow', () => {
  it('renders the label', () => {
    render(<FormRow label="Full name"><input /></FormRow>)
    expect(screen.getByText('Full name')).toBeInTheDocument()
  })

  it('renders its children', () => {
    render(<FormRow label="Field"><input data-testid="child-input" /></FormRow>)
    expect(screen.getByTestId('child-input')).toBeInTheDocument()
  })

  it('shows hint when provided', () => {
    render(
      <FormRow label="Email" hint="We will never share your email.">
        <input />
      </FormRow>,
    )
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument()
  })

  it('does not show hint when not provided', () => {
    render(<FormRow label="Name"><input /></FormRow>)
    // No hint element should be rendered
    expect(screen.queryByText(/hint/i)).not.toBeInTheDocument()
  })

  it('has border-b class (divider) by default', () => {
    const { container } = render(<FormRow label="Name"><input /></FormRow>)
    const row = container.firstChild as HTMLElement
    expect(row.className).toContain('border-b')
  })

  it('does not have border-b class when divider=false', () => {
    const { container } = render(
      <FormRow label="Name" divider={false}><input /></FormRow>,
    )
    const row = container.firstChild as HTMLElement
    expect(row.className).not.toContain('border-b')
  })
})
