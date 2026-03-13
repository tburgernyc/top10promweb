import { Skeleton } from '@/components/ui/Skeleton'

export default function FittingRoomLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Left — featured viewer */}
      <div className="lg:w-2/3 flex flex-col gap-4">
        <Skeleton minHeight="min-h-[60dvh]" className="w-full rounded-3xl" />
        <div className="flex gap-2">
          <Skeleton minHeight="min-h-[2.75rem]" className="flex-1" />
          <Skeleton minHeight="min-h-[2.75rem]" className="flex-1" />
        </div>
      </div>
      {/* Right — thumbnail strip */}
      <div className="lg:w-1/3 flex flex-col gap-3">
        <Skeleton minHeight="min-h-[1rem]" className="w-32" />
        <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} minHeight="min-h-[160px]" className="w-full rounded-xl" />
          ))}
        </div>
        <Skeleton minHeight="min-h-[2.75rem]" className="w-full mt-auto" />
      </div>
    </div>
  )
}
