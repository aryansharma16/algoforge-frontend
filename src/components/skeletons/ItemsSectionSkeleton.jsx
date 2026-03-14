/** Skeleton matching JourneyItemsSection: header strip + toolbar + item rows */
export default function ItemsSectionSkeleton() {
  return (
    <section className="mt-8 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200/80 animate-pulse dark:border-slate-800/90 dark:bg-[#0a0c10] dark:shadow-xl dark:ring-black/20 sm:mt-10 md:mt-12 sm:rounded-2xl">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-5 dark:border-slate-800/90 dark:from-[#12151c] dark:via-[#0d1117] dark:to-[#12151c] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <p className="h-4 w-72 max-w-xl rounded bg-slate-100 dark:bg-slate-800" />
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-9 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
        <div className="h-9 flex-1 min-w-0 max-w-xs rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </section>
  )
}
