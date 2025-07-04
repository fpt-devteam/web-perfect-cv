import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/utils/cn.util';

interface EnhancedAIScoreCardProps {
  score: number;
  isLoading?: boolean;
  className?: string;
}

export function EnhancedAIScoreCard({
  score,
  isLoading = false,
  className,
}: EnhancedAIScoreCardProps) {
  // Calculate the stroke dash offset for the circle animation
  const radius = 19.78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score level and color
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'rgb(34, 197, 94)', icon: TrendingUp };
    if (score >= 80) return { level: 'Very Good', color: 'rgb(59, 130, 246)', icon: TrendingUp };
    if (score >= 70) return { level: 'Good', color: 'rgb(245, 158, 11)', icon: Minus };
    if (score >= 60) return { level: 'Fair', color: 'rgb(249, 115, 22)', icon: TrendingDown };
    return { level: 'Needs Improvement', color: 'rgb(239, 68, 68)', icon: TrendingDown };
  };

  const { level, color, icon: Icon } = getScoreLevel(score);

  if (isLoading) {
    return (
      <div className={cn('px-6 pt-6 pb-4 flex items-center gap-4 flex-row', className)}>
        <div className="relative animate-pulse" style={{ width: '46px', height: '46px' }}>
          <div className="w-full h-full bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'px-6 pt-6 pb-4 flex items-center gap-4 flex-row cursor-pointer group hover:bg-gray-50 transition-colors rounded-lg',
        className
      )}
    >
      <div className="relative" style={{ width: '46px', height: '46px' }}>
        <svg
          width="46"
          height="46"
          xmlns="http://www.w3.org/2000/svg"
          className="-rotate-90 -my-[23px]"
        >
          <g>
            <title>CV Score</title>
            {/* Background circle */}
            <circle
              className="stroke-gray-200"
              r={radius}
              cy="23"
              cx="23"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              id="score_circle"
              r={radius}
              cy="23"
              cx="23"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDashoffset: strokeDashoffset,
                strokeDasharray: circumference,
                transition: 'stroke-dashoffset 1s ease-out',
                stroke: color,
              }}
            />
            {/* Score text */}
            <text
              x="50%"
              y="-47%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="rotate-90 fill-gray-900 text-base font-semibold"
            >
              {score}
            </text>
          </g>
        </svg>
      </div>
      <div className="flex flex-col gap-y-0.5 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-base leading-6 text-gray-900 font-medium">CV Score</p>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <p className="text-[14px] leading-5 text-gray-600">{level}</p>
      </div>
    </div>
  );
}
