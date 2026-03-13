import { Skeleton } from '@/components/ui/Skeleton'

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton minHeight="min-h-[4rem]" className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton minHeight="min-h-[1.5rem]" className="w-40" />
          <Skeleton minHeight="min-h-[1rem]" className="w-56" />
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} minHeight="min-h-[5rem]" className="w-full rounded-2xl" />
        ))}
      </div>
      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} minHeight="min-h-[2.5rem]" className="w-24 rounded-full" />
        ))}
      </div>
      {/* Content list */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} minHeight="min-h-[5rem]" className="w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
