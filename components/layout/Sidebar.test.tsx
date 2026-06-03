import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';
import { getStoredUser } from '@/lib/auth';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

vi.mock('@/lib/auth', () => ({
  clearAuth: vi.fn(),
  getStoredUser: vi.fn(() => ({
    id: '1',
    display_name: 'John Doe',
    email: 'john@example.com',
    avatar_url: '',
    locale: 'en',
    timezone: 'UTC',
    created_at: '',
    updated_at: '',
  })),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderSidebar() {
  return render(
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>,
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default mock implementation after clearAllMocks
    vi.mocked(getStoredUser).mockReturnValue({
      id: '1',
      display_name: 'John Doe',
      email: 'john@example.com',
      avatar_url: '',
      locale: 'en',
      timezone: 'UTC',
      created_at: '',
      updated_at: '',
    });
  });

  it('renders all 5 nav items', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Trips')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('active item has aria-current="page" and data-active="true"', () => {
    renderSidebar();
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    expect(dashboardLink).toHaveAttribute('data-active', 'true');
  });

  it('inactive items do not have aria-current', () => {
    renderSidebar();
    const tripsLink = screen.getByRole('link', { name: /trips/i });
    expect(tripsLink).not.toHaveAttribute('aria-current');
    expect(tripsLink).toHaveAttribute('data-active', 'false');
  });

  it('user initials are derived from stored user name', () => {
    renderSidebar();
    // John Doe → JD
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows user name in sidebar footer', () => {
    renderSidebar();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Free plan')).toBeInTheDocument();
  });

  it('mobile overlay is not visible by default', () => {
    renderSidebar();
    // The dialog/drawer only renders when isOpen is true
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows "U" placeholder when no user is stored', () => {
    vi.mocked(getStoredUser).mockReturnValueOnce(null);
    renderSidebar();
    expect(screen.getByText('U')).toBeInTheDocument();
  });
});
