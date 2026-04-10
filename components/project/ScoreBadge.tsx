import { getScoreLabel } from '@/lib/scoring';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export default function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const { label, bgColor, textColor } = getScoreLabel(score);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold',
        bgColor,
        textColor,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {score}% · {label}
    </span>
  );
}
