import { useGetDashboardQuery } from '../api/dashboardApi'
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton'

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:bg-slate-900/90">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {value ?? '—'}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading, isError, error } = useGetDashboardQuery()

  if (isLoading) return <DashboardSkeleton />
  if (isError) {
    return (
      <p className="text-red-400">
        {error?.data?.message || 'Could not load dashboard'}
      </p>
    )
  }

  const core = data?.core ?? {}
  const journey = data?.journey ?? {}
  const streak = data?.streak ?? {}
  const activity = data?.activity ?? {}
  const active = journey.activeJourney

  return (
    <div className="w-full space-y-10">
      <header className="border-b border-slate-200 pb-6 dark:border-slate-800/60 sm:pb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
          Overview of your preparation activity
        </p>
      </header>

      <section className="w-full">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Totals
        </h2>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          <Stat label="Total items" value={core.totalItems} />
          <Stat label="Total submissions" value={core.totalSubmissions} />
          <Stat label="Current streak (days)" value={streak.currentStreak} />
          <Stat label="Longest streak" value={streak.longestStreak} />
        </div>
      </section>

      <section className="w-full">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Active journey
        </h2>
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 sm:p-8">
          <p className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
            {active?.title ?? 'No active journey'}
          </p>
          {active?.status && (
            <p className="mt-2 text-sm capitalize text-violet-600 dark:text-violet-300/90">
              {active.status}
            </p>
          )}
          <div className="mt-6 grid w-full gap-6 border-t border-slate-200 pt-6 dark:border-slate-800/80 sm:grid-cols-3 lg:gap-10">
            <div>
              <span className="text-sm text-slate-500">Completed items</span>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                {journey.completedItems ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Remaining items</span>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                {journey.remainingItems ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Target items</span>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                {journey.targetItems ?? active?.targetItems ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Activity
        </h2>
        <div className="mb-6 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          <Stat label="Today submissions" value={activity.todaySubmissions} />
          <Stat label="Weekly submissions" value={activity.weeklySubmissions} />
        </div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recent activity
        </h3>
        <ul className="w-full divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800/80 dark:bg-slate-900/50">
          {(activity.recentActivity ?? []).length === 0 ? (
            <li className="p-6 text-sm text-slate-500">No recent submissions</li>
          ) : (
            (activity.recentActivity ?? []).map((row) => (
              <li
                key={row._id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:p-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {row.itemTitle ?? 'Item'}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">{row.journeyTitle}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className="font-medium capitalize text-violet-600 dark:text-violet-400">
                    {row.solvingMethod?.replace(/_/g, ' ')}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : ''}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  )
}
