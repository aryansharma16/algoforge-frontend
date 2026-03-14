/** Skeleton matching JourneyDetails: breadcrumb, header, stats, progress, items section placeholder */
export default function JourneyDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 pb-12 sm:pb-16">
      <nav className="flex flex-wrap items-center gap-1 text-xs sm:gap-2 sm:text-sm">
        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-700 sm:h-8 sm:w-64" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50"
          >
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-1 h-6 w-12 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900/30 sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 max-w-md w-[80%] rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800/90 dark:bg-[#0a0c10]">
        <div className="border-b border-slate-200 px-4 py-5 dark:border-slate-800/90 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-2 h-4 w-64 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="divide-y divide-slate-200 p-4 dark:divide-slate-800 sm:p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-8 w-16 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
