import { cn } from '@/shared/utils/cn.util';

interface ScoreBarProps {
    score: number; // 0-100 percentage
    className?: string;
    showAnimation?: boolean;
}

function getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
}

export function ScoreBar({ score, className, showAnimation = true }: ScoreBarProps) {
    const clampedScore = Math.max(0, Math.min(100, score));

    return (
        <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', className)}>
            <div
                className={cn(
                    'h-full rounded-full transition-all duration-1000 ease-out',
                    getScoreColor(clampedScore),
                    showAnimation && 'animate-in slide-in-from-left'
                )}
                style={{ width: `${clampedScore}%` }}
            />
        </div>
    );
}
