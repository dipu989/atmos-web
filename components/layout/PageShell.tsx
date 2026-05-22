import { Header } from './Header';

interface PageShellProps {
  title: string;
  subtitle?: string;
  rangePicker?: { value: string; onChange: (v: string) => void };
  rightExtra?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({
  title,
  subtitle,
  rangePicker,
  rightExtra,
  children,
}: PageShellProps) {
  return (
    <>
      <Header
        title={title}
        subtitle={subtitle}
        showRangePicker={!!rangePicker}
        rangeValue={rangePicker?.value}
        onRangeChange={rangePicker?.onChange}
        rightExtra={rightExtra}
      />
      <main className="flex flex-col gap-5 bg-bg-page p-4 lg:p-[32px_36px]">
        {children}
      </main>
    </>
  );
}
