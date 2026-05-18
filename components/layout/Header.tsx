import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-divider bg-bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-heading font-semibold text-horizon-blue">
            Atmos
          </Link>
          <nav className="hidden flex-row gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-body text-text-secondary hover:text-horizon-blue"
            >
              Dashboard
            </Link>
            <Link
              href="/trips"
              className="text-body text-text-secondary hover:text-horizon-blue"
            >
              Trips
            </Link>
            <Link
              href="/analytics"
              className="text-body text-text-secondary hover:text-horizon-blue"
            >
              Analytics
            </Link>
            <Link
              href="/insights"
              className="text-body text-text-secondary hover:text-horizon-blue"
            >
              Insights
            </Link>
          </nav>
        </div>
        <Link
          href="/settings"
          className="text-body text-text-secondary hover:text-horizon-blue"
        >
          Settings
        </Link>
      </div>
    </header>
  );
}
