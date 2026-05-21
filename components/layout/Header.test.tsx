import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { SidebarProvider } from './SidebarContext';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
}));

type HeaderProps = React.ComponentProps<typeof Header>;

function renderHeader(props: HeaderProps) {
  return render(
    <SidebarProvider>
      <Header {...props} />
    </SidebarProvider>,
  );
}

describe('Header', () => {
  it('renders the title', () => {
    renderHeader({ title: 'Dashboard' });
    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderHeader({ title: 'Dashboard', subtitle: 'Welcome back' });
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    renderHeader({ title: 'Dashboard' });
    expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
  });

  it('renders rightExtra when provided', () => {
    renderHeader({
      title: 'Dashboard',
      rightExtra: <button>Export</button>,
    });
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('does not render range picker when showRangePicker is false', () => {
    renderHeader({ title: 'Dashboard' });
    expect(screen.queryByTestId('range-picker-button')).not.toBeInTheDocument();
  });

  it('renders range picker button when showRangePicker is true', () => {
    renderHeader({
      title: 'Dashboard',
      showRangePicker: true,
      rangeValue: 'This month',
      onRangeChange: vi.fn(),
    });
    expect(screen.getByTestId('range-picker-button')).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('range picker shows dropdown options on click', () => {
    renderHeader({
      title: 'Dashboard',
      showRangePicker: true,
      rangeValue: 'This month',
      onRangeChange: vi.fn(),
    });

    // Dropdown not visible initially
    expect(screen.queryByText('Today')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(screen.getByTestId('range-picker-button'));

    // All options should appear
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('This week')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    expect(screen.getByText('This year')).toBeInTheDocument();
  });

  it('range picker calls onChange and closes on option select', () => {
    const onRangeChange = vi.fn();
    renderHeader({
      title: 'Dashboard',
      showRangePicker: true,
      rangeValue: 'This month',
      onRangeChange,
    });

    fireEvent.click(screen.getByTestId('range-picker-button'));
    fireEvent.click(screen.getByText('Today'));

    expect(onRangeChange).toHaveBeenCalledWith('Today');
    // Dropdown should close
    expect(screen.queryByText('This week')).not.toBeInTheDocument();
  });

  it('shows mobile hamburger button', () => {
    renderHeader({ title: 'Dashboard' });
    expect(
      screen.getByRole('button', { name: /open navigation/i }),
    ).toBeInTheDocument();
  });
});
