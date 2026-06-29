import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';
import { clearAuth, getRefreshToken, getStoredUser } from '@/lib/auth';
import { logout } from '@/lib/api/client';

const mockRouterReplace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
  useRouter: vi.fn(() => ({ replace: mockRouterReplace })),
}));

vi.mock('@/lib/auth', () => ({
  clearAuth: vi.fn(),
  getRefreshToken: vi.fn(() => 'refresh-token-abc'),
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

vi.mock('@/lib/api/client', () => ({
  logout: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/hooks/useTrips', () => ({
  useMe: vi.fn(() => ({
    data: {
      id: '1',
      display_name: 'John Doe',
      email: 'john@example.com',
      avatar_url: '',
      locale: 'en',
      timezone: 'UTC',
      created_at: '',
      updated_at: '',
    },
    isLoading: false,
    isError: false,
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

  it('shows user name and email in sidebar footer', () => {
    renderSidebar();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('mobile overlay is not visible by default', () => {
    renderSidebar();
    // The dialog/drawer only renders when isOpen is true
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows "?" placeholder when no user data is available', async () => {
    vi.mocked(getStoredUser).mockReturnValueOnce(null);
    const { useMe } = await import('@/lib/hooks/useTrips');
    vi.mocked(useMe).mockReturnValueOnce({ data: undefined, isLoading: false, isError: false });
    renderSidebar();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('calls the backend logout endpoint with the refresh token, then clears local auth and redirects', async () => {
    renderSidebar();
    fireEvent.click(screen.getByLabelText('Log out'));

    expect(getRefreshToken).toHaveBeenCalled();
    await waitFor(() => expect(logout).toHaveBeenCalledWith('refresh-token-abc'));
    expect(clearAuth).toHaveBeenCalled();
    expect(mockRouterReplace).toHaveBeenCalledWith('/login');
  });

  it('still clears local auth and redirects when the backend logout call fails', async () => {
    vi.mocked(logout).mockRejectedValueOnce(new Error('network error'));
    renderSidebar();
    fireEvent.click(screen.getByLabelText('Log out'));

    await waitFor(() => expect(clearAuth).toHaveBeenCalled());
    expect(mockRouterReplace).toHaveBeenCalledWith('/login');
  });
});
