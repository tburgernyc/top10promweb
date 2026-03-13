import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <Skeleton minHeight="min-h-[2rem]" className="w-48" />
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} minHeight="min-h-[6rem]" className="w-full rounded-2xl" />
        ))}
      </div>
      {/* Table placeholder */}
      <div className="space-y-3">
        <Skeleton minHeight="min-h-[2.5rem]" className="w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} minHeight="min-h-[3.5rem]" className="w-full" />
        ))}
      </div>
    </div>
  )
}
