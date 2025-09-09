import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface GameCardSkeletonProps {
  className?: string;
}

export function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <Card className={cn('border-neutral-200', className)}>
      <CardContent className="p-0">
        <Skeleton className="aspect-[3/4] rounded-t-lg" />
        
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-3 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>

          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
