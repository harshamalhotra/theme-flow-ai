import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareOff, SearchX, BarChart3 } from "lucide-react";

export function FeedbackCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-2.5 animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="h-1.5 w-1.5 rounded-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function FeedbackListSkeleton() {
  return (
    <div className="space-y-2.5 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <FeedbackCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ThemePillSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-9 rounded-lg" style={{ width: `${80 + Math.random() * 60}px` }} />
      ))}
    </div>
  );
}

export function SparklineSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-[100px] w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 text-center space-y-2">
      <Skeleton className="h-7 w-10 mx-auto" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <MessageSquareOff size={20} className="text-muted-foreground" />}
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-[220px]">{description}</p>
    </div>
  );
}

export function NoFeedbackEmpty() {
  return (
    <EmptyState
      icon={<MessageSquareOff size={20} className="text-muted-foreground" />}
      title="No feedback yet"
      description="Add feedback using the button above to start analyzing sentiment and themes."
    />
  );
}

export function NoResultsEmpty() {
  return (
    <EmptyState
      icon={<SearchX size={20} className="text-muted-foreground" />}
      title="No results found"
      description="Try adjusting your search query or filters to find matching feedback."
    />
  );
}

export function NoChartDataEmpty() {
  return (
    <EmptyState
      icon={<BarChart3 size={20} className="text-muted-foreground" />}
      title="Not enough data"
      description="Add more feedback across different dates to see sentiment trends."
    />
  );
}
