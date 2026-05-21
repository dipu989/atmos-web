import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[16px] border border-divider bg-bg-card shadow-card',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-heading font-semibold text-text-primary', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-body text-text-secondary', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

// ─── SectionCard ─────────────────────────────────────────────────────────────
// Higher-level card with optional title/subtitle header. Used on analytics and
// other pages that need titled chart/data sections.

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children, className, ...rest }: SectionCardProps) {
  return (
    <div
      className={cn('rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5', className)}
      {...rest}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-[17px] font-semibold leading-tight text-[#1A2332]">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-[13px] text-[#6B7A8D]">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
