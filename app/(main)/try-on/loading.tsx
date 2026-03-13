import { Skeleton } from '@/components/ui/Skeleton'

export default function TryOnLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <Skeleton minHeight="min-h-[3rem]" className="w-48" />
      <div className="grid md:grid-cols-3 gap-4">
        <Skeleton minHeight="min-h-[400px]" className="w-full rounded-2xl" />
        <Skeleton minHeight="min-h-[400px]" className="w-full rounded-2xl" />
        <Skeleton minHeight="min-h-[400px]" className="w-full rounded-2xl" />
      </div>
    </div>
  )
}
