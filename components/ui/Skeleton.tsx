interface SkeletonProps {
  className?: string
  /** Must use min-h, never fixed h- */
  minHeight?: string
}

export function Skeleton({ className = '', minHeight = 'min-h-[1rem]' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'rounded-xl shimmer',
        minHeight,
        className,
      ].join(' ')}
    />
  )
}

export function DressCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden glass-light">
      <Skeleton minHeight="min-h-[320px]" className="rounded-none w-full" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton minHeight="min-h-[1.25rem]" className="w-3/4" />
        <Skeleton minHeight="min-h-[1rem]" className="w-1/2" />
        <Skeleton minHeight="min-h-[2rem]" className="w-full mt-1" />
      </div>
    </div>
  )
}

export function DressGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <DressCardSkeleton key={i} />
      ))}
    </div>
  )
}
