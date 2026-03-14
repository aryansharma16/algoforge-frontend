/** Skeleton for ItemDetails: header + form/code split layout placeholder */
export default function ItemDetailsSkeleton() {
  return (
    <div className="-mx-3 flex w-[calc(100%+1.5rem)] max-w-none flex-col animate-pulse xs:-mx-4 xs:w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
      <header className="flex flex-col gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 dark:border-slate-800 dark:bg-[#0a0c10]/95 xs:px-4">
        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-full max-w-md rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </header>

      <div className="grid min-h-[400px] grid-cols-1 gap-0 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <aside className="space-y-4 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#0d1117] lg:border-b-0 lg:border-r lg:border-slate-200">
          <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
          <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
        </aside>
        <div className="flex flex-col border-t border-slate-200 bg-slate-100 dark:border-t-0 dark:bg-[#1a1b26]">
          <div className="h-11 border-b border-slate-200 bg-white px-3 dark:border-slate-700/90 dark:bg-[#16161e]" />
          <div className="min-h-[320px] flex-1 rounded bg-slate-200/50 dark:bg-slate-800/50" />
        </div>
      </div>
    </div>
  )
}
