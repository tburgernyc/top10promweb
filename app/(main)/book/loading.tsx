import { Skeleton } from '@/components/ui/Skeleton'

export default function BookLoading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <Skeleton minHeight="min-h-[2rem]" className="w-8 h-8 rounded-full" />
            {i < 3 && <Skeleton minHeight="min-h-[2px]" className="flex-1" />}
          </div>
        ))}
      </div>
      {/* Step content */}
      <Skeleton minHeight="min-h-[2rem]" className="w-56" />
      <div className="space-y-4">
        <Skeleton minHeight="min-h-[3rem]" className="w-full" />
        <Skeleton minHeight="min-h-[3rem]" className="w-full" />
        <Skeleton minHeight="min-h-[3rem]" className="w-full" />
      </div>
      <Skeleton minHeight="min-h-[3rem]" className="w-full" />
    </div>
  )
}
