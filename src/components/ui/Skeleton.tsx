

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '16px',
        borderRadius: borderRadius ?? 'var(--radius-md)',
        background: 'var(--bg-tertiary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
}

export function SkeletonText({
  width,
  className = '',
}: {
  width?: string | number;
  className?: string;
}) {
  return (
    <Skeleton
      width={width}
      height={12}
      borderRadius="4px"
      className={className}
    />
  );
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius="9999px" />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <Skeleton height={14} width="60%" />
      <div style={{ marginTop: 12 }}>
        <SkeletonText width="100%" />
      </div>
      <div style={{ marginTop: 8 }}>
        <SkeletonText width="80%" />
      </div>
      <div style={{ marginTop: 8 }}>
        <SkeletonText width="40%" />
      </div>
    </div>
  );
}
