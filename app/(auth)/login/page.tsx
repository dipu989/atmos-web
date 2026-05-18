export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="w-full max-w-md rounded-lg border border-divider bg-bg-card p-8 shadow-card">
        <h1 className="text-heading font-semibold text-text-primary">
          Sign in
        </h1>
        <p className="text-body mt-2 text-text-secondary">
          Enter your credentials to access your dashboard.
        </p>
      </div>
    </main>
  );
}
