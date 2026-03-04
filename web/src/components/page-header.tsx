import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type PageHeaderProps = PropsWithChildren<{
  className?: string;
}>;

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex justify-between items-center bg-text-title-invert p-5',
        className,
      )}
    >
      {children}
    </header>
  );
}
