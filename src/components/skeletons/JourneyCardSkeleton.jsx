/** Skeleton matching JourneyCard: hero strip + title/status + description area */
export default function JourneyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="relative h-20 w-full shrink-0 rounded-t-2xl bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 sm:h-24" />
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="h-4 w-[75%] rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-5 w-14 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-3 hidden gap-1.5 sm:flex sm:flex-col">
          <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="mt-2 flex gap-2 sm:hidden">
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}
