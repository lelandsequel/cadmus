import { cn } from '@/lib/utils';

type Status = 'draft' | 'active' | 'complete' | 'archived';

interface StatusPillProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-surface-high text-on-surface-variant' },
  active: { label: 'Active', classes: 'bg-secondary-pale text-secondary' },
  complete: { label: 'Complete', classes: 'bg-tertiary-pale text-tertiary' },
  archived: { label: 'Archived', classes: 'bg-surface-high text-outline' },
};

export default function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
