# Contributing to Atmos Web

Thanks for your interest in contributing to atmos-web! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Development Workflow

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Code Quality

Before committing, ensure your code meets quality standards:

```bash
pnpm lint      # Check for linting issues
pnpm test      # Run unit/component tests
pnpm build     # Verify production build works
```

### Writing Tests

- **Unit/Component tests**: Use Vitest + React Testing Library in `*.test.tsx` files
- **E2E tests**: Use Playwright for user flows
- Aim for meaningful test coverage, not 100%

Example unit test:
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add dark mode toggle to settings
fix: resolve chart rendering issue on mobile
docs: update installation instructions
refactor: simplify API client caching logic
```

### Style Guide

- **TypeScript**: Use strict mode; prefer explicit types over `any`
- **React**: Use functional components and hooks
- **Tailwind**: Use semantic color tokens (`horizon-blue`, `sage`, etc.)
- **Formatting**: Prettier is enforced (run `pnpm lint` to auto-fix)

### Component Development

When creating new components:

1. Place in `components/ui/` for primitives or domain-specific folders (`components/dashboard/`, `components/charts/`)
2. Use TypeScript interfaces for props
3. Include JSDoc comments for non-obvious APIs
4. Export from `index.ts` if it's a re-exported component
5. Test the component with React Testing Library

### Styling Best Practices

- Use the `cn()` helper for merging conditional classes
- Leverage Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`)
- Reference design tokens from `tailwind.config.ts`
- Avoid inline styles; use Tailwind utilities

Example:
```tsx
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-2xl shadow-card p-5 bg-bg-card', className)} {...props} />
  );
}
```

## Submitting Changes

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request** on GitHub
3. **Fill out the PR template** with context and testing info
4. **Request review** from maintainers
5. **Address feedback** and iterate

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Reference related issues with `Closes #123`
- Ensure all tests pass: `pnpm test && pnpm e2e`
- Update documentation if behavior changes
- Include screenshots for UI changes

## Release Process

Releases follow semantic versioning. When a PR is merged to `main`, it's automatically deployed (if CI/CD is configured). Tags are created for releases.

## Questions?

- Check [CLAUDE.md](CLAUDE.md) for architecture and development guidance
- Open a GitHub discussion or issue for clarification

---

Happy contributing! 🌱
