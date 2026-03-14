import { useMemo } from 'react'

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

/** Items counted as “done” for progress (adjust if your API uses other statuses). */
export function countCompletedItems(items) {
  if (!Array.isArray(items)) return 0
  const doneStatuses = new Set(['completed', 'done', 'solved'])
  return items.filter((item) => {
    const s = String(item?.status || '').toLowerCase()
    if (doneStatuses.has(s)) return true
    if ((item?.submissionCount ?? 0) > 0) return true
    return false
  }).length
}

/**
 * Prefer: completed-like items / targetItems.
 * Falls back: any items / target if you want “backlog fill” — we use completed for ring.
 */
export function completionMetrics(items, targetItems) {
  const totalItems = Array.isArray(items) ? items.length : 0
  const completed = countCompletedItems(items)
  const target = Math.max(0, Number(targetItems) || 0)
  const denom = target > 0 ? target : Math.max(totalItems, 1)
  const raw = denom > 0 ? (completed / denom) * 100 : 0
  const volumeRaw = target > 0 && totalItems > 0 ? (totalItems / target) * 100 : null
  return {
    completed,
    totalItems,
    target,
    /** Primary % for UI (cap 100) */
    percent: Math.min(100, raw),
    /** 0–100 for display string (1 decimal so 1/500 shows 0.2%) */
    percentDisplay: Math.min(100, Math.round(raw * 10) / 10),
    volumePercent: volumeRaw != null ? Math.min(100, volumeRaw) : null,
    formula:
      target > 0
        ? `Completion = completed items ÷ target (${completed} ÷ ${target})`
        : totalItems > 0
          ? `Set a target in Edit journey to track % (you have ${totalItems} item(s))`
          : 'Add items and a target to see completion %',
  }
}

export default function JourneyTimeline({
  startDate,
  endDate,
  items,
  targetItems,
}) {
  const now = useMemo(() => new Date(), [])
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null
  const metrics = useMemo(
    () => completionMetrics(items, targetItems),
    [items, targetItems]
  )

  const timeline = useMemo(() => {
    if (!start || !end || start >= end) return null
    const t0 = start.getTime()
    const t1 = end.getTime()
    const span = t1 - t0
    const pct = (t) => Math.max(0, Math.min(100, ((t - t0) / span) * 100))

    const months = []
    let m = startOfMonth(start)
    const endM = startOfMonth(end)
    while (m <= endM) {
      const ms = m.getTime()
      if (ms >= t0 && ms <= t1) {
        months.push({
          key: `${m.getFullYear()}-${m.getMonth()}`,
          label: `${MONTHS_SHORT[m.getMonth()]} ${m.getFullYear()}`,
          left: pct(ms),
        })
      }
      m = addMonths(m, 1)
    }

    const todayMs = now.getTime()
    const todayInRange = todayMs >= t0 && todayMs <= t1
    const todayLeft = todayInRange ? pct(todayMs) : null

    const daySpan = Math.ceil(span / (24 * 60 * 60 * 1000))

    const timeCheckpoints = [0, 25, 50, 75, 100].map((p) => ({
      p,
      left: p,
      label: `${p}%`,
    }))

    return {
      span,
      daySpan,
      months,
      todayLeft,
      todayInRange,
      beforeStart: todayMs < t0,
      afterEnd: todayMs > t1,
      timeCheckpoints,
      t0,
      t1,
    }
  }, [start, end, now])

  if (!start || !end) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-violet-400/90">
          Timeline & completion
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Set <strong className="text-slate-400">start</strong> and{' '}
          <strong className="text-slate-400">end</strong> on the journey to see the calendar
          timeline.
        </p>
        <CompletionBar metrics={metrics} />
        <FormulaNote metrics={metrics} />
      </div>
    )
  }

  if (start >= end) {
    return (
      <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 text-amber-200/90">
        End date should be after start date for a meaningful timeline.
        <CompletionBar metrics={metrics} className="mt-4" />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/90 to-slate-900/50 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-violet-400/90">
            Timeline
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            <span className="tabular-nums text-slate-400">{timeline.daySpan}</span> days
            ·{' '}
            {start.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            →{' '}
            {end.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right text-[10px] text-slate-600">
          {timeline.beforeStart && <span>Not started yet</span>}
          {timeline.afterEnd && <span>Journey window ended</span>}
          {timeline.todayInRange && (
            <span className="text-emerald-400/90">Today is inside this window</span>
          )}
        </div>
      </div>

      {/* Calendar rail */}
      <div className="relative mt-6 pb-8">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-slate-700/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600/50 via-violet-500/70 to-indigo-500/60"
            style={{
              width: timeline.todayInRange
                ? `${timeline.todayLeft}%`
                : timeline.afterEnd
                  ? '100%'
                  : '0%',
            }}
          />
        </div>

        {/* Month ticks */}
        <div className="relative mt-2 h-14">
          {timeline.months.map((mo) => (
            <div
              key={mo.key}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${mo.left}%` }}
            >
              <span className="h-2 w-px bg-slate-600" />
              <span className="mt-1 max-w-[4rem] truncate text-center text-[10px] font-medium text-slate-400">
                {mo.label}
              </span>
            </div>
          ))}
        </div>

        {/* Time checkpoints (quarters of the journey window) */}
        <div className="relative -mt-4 h-8 border-t border-slate-800/80 pt-2">
          {timeline.timeCheckpoints.map((cp) => (
            <div
              key={cp.p}
              className="absolute top-2 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${cp.left}%` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 ring-2 ring-slate-900" />
              <span className="mt-0.5 text-[9px] tabular-nums text-slate-600">
                {cp.p}%
              </span>
            </div>
          ))}
          {timeline.todayLeft != null && (
            <div
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${timeline.todayLeft}%` }}
            >
              <span className="whitespace-nowrap rounded bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950 shadow">
                Today
              </span>
              <span className="mt-0.5 h-6 w-0.5 bg-emerald-500/80" />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-5">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Item completion (checkpoints)
        </h4>
        <p className="mt-1 text-[11px] text-slate-500">
          Dots mark 0% · 25% · 50% · 75% · 100% of your <strong className="text-slate-400">target</strong> item
          count. Fill reflects completed / in-progress items (submissions or status).
        </p>
        <CompletionBar metrics={metrics} className="mt-3" />
        <FormulaNote metrics={metrics} />
      </div>
    </div>
  )
}

function CompletionBar({ metrics, className = '' }) {
  const checkpoints = [0, 25, 50, 75, 100]
  const fill = metrics.percent

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tabular-nums text-white">
          {metrics.percentDisplay}%
        </span>
        <span className="text-xs text-slate-500">
          {metrics.completed} done · {metrics.totalItems} total items
          {metrics.target > 0 && (
            <span className="text-slate-600"> · target {metrics.target}</span>
          )}
        </span>
      </div>
      <div className="relative py-3">
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-[width] duration-700 ease-out"
            style={{ width: `${fill}%` }}
          />
        </div>
        <div className="relative -mt-4 h-4">
          {checkpoints.map((p) => (
            <div
              key={p}
              className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${p}%` }}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${
                  fill >= p ? 'bg-indigo-400' : 'bg-slate-600'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="relative mt-0.5 h-4 text-[9px] tabular-nums text-slate-600">
          {checkpoints.map((p) => (
            <span
              key={p}
              className="absolute -translate-x-1/2"
              style={{ left: `${p}%` }}
            >
              {p}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FormulaNote({ metrics }) {
  return (
    <p className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
      <span className="font-medium text-slate-400">How this is calculated: </span>
      {metrics.target > 0 ? (
        <>
          We count an item as <strong className="text-slate-400">done</strong> if it has
          submissions (&gt;0) or status completed/done/solved. Then{' '}
          <code className="rounded bg-slate-800 px-1 text-violet-300">
            % = min(100, done ÷ target × 100)
          </code>
          . Creating items alone does not raise completion unless they&apos;re done or have
          submissions. Set target in Edit journey.
        </>
      ) : (
        metrics.formula
      )}
    </p>
  )
}
