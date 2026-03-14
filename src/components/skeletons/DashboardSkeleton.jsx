/** Skeleton matching Dashboard layout: header, Totals grid, Active journey card, Activity section */
export default function DashboardSkeleton() {
  return (
    <div className="w-full space-y-10 animate-pulse">
      <header className="border-b border-slate-200 pb-6 dark:border-slate-800/60 sm:pb-8">
        <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-700 sm:h-9 sm:w-56" />
        <div className="mt-2 h-4 max-w-2xl rounded bg-slate-100 dark:bg-slate-800" />
      </header>

      <section className="w-full">
        <div className="mb-4 h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70"
            >
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-9 w-16 rounded bg-slate-100 dark:bg-slate-800 sm:h-10" />
            </div>
          ))}
        </div>
      </section>

      <section className="w-full">
        <div className="mb-4 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 sm:p-8">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700 sm:h-7 sm:w-56" />
          <div className="mt-2 h-4 w-24 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-6 grid w-full gap-6 border-t border-slate-200 pt-6 dark:border-slate-800/80 sm:grid-cols-3 lg:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-1 h-8 w-12 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mb-4 h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-6 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70"
            >
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-9 w-14 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
        <div className="mb-3 h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="w-full divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800/80 dark:bg-slate-900/50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:p-6">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="shrink-0 space-y-1 text-left sm:text-right">
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
