export default function Loading() {
  return (
    <div className="min-h-dvh px-4 py-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl bg-white/8" />
        <div className="h-4 w-72 rounded-lg bg-white/5" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-light rounded-2xl overflow-hidden">
            <div className="aspect-[3/4] bg-white/5" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 rounded-lg bg-white/8" />
              <div className="h-3 w-1/2 rounded-lg bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
