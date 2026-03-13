import { DressGridSkeleton } from '@/components/ui/Skeleton'

export default function CatalogLoading() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div className="h-10 rounded-xl shimmer min-h-[2.5rem] w-48" aria-hidden="true" />
      <DressGridSkeleton count={8} />
    </div>
  )
}
