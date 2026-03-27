'use client';

interface LoadingSkeletonProps {
  className?: string;
  aspectRatio?: string;
}

export function LoadingSkeleton({
  className = '',
  aspectRatio = 'aspect-video',
}: LoadingSkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-800 ${aspectRatio} ${className}`}
      role="status"
      aria-label="Loading..."
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      <span className="sr-only">Loading image…</span>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
