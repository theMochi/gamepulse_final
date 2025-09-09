import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarsProps {
  rating: number; // 0-5 stars
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

export function Stars({ 
  rating, 
  maxStars = 5, 
  size = 'md', 
  className,
  showValue = false 
}: StarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    const filled = rating >= i;
    const halfFilled = rating >= i - 0.5 && rating < i;
    
    stars.push(
      <Star
        key={i}
        className={cn(
          sizeClasses[size],
          filled ? 'fill-yellow-400 text-yellow-400' : 
          halfFilled ? 'fill-yellow-400/50 text-yellow-400' : 
          'text-gray-300'
        )}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
