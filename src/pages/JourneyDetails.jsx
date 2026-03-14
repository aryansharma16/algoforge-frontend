import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useGetJourneyByIdQuery } from '../api/journeyApi'
import { useGetItemsQuery } from '../api/itemApi'
import { JOURNEY_LABELS } from '../constants/journey'
import { CS_TOPIC_LABEL } from '../constants/csTopics'
import JourneyTimeline, { completionMetrics } from '../components/JourneyTimeline'
import JourneyItemsSection from '../components/JourneyItemsSection'

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function StatusPill({ status }) {
  const colors = {
    planned: 'bg-slate-500/20 text-slate-300 ring-slate-500/30',
    active: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
    paused: 'bg-amber-500/15 text-amber-200 ring-amber-500/25',
    completed: 'bg-violet-500/15 text-violet-200 ring-violet-500/25',
    archived: 'bg-slate-600/30 text-slate-400 ring-slate-600/40',
  }
  const c = colors[status] || colors.planned
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${c}`}
    >
      {JOURNEY_LABELS[status] || status}
    </span>
  )
}

function VisibilityPill({ v }) {
  const colors = {
    private: 'text-slate-400',
    unlisted: 'text-amber-400/90',
    public: 'text-sky-400',
  }
  return (
    <span className={`text-xs font-medium capitalize ${colors[v] || ''}`}>
      {JOURNEY_LABELS[v] || v}
    </span>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-slate-600">{sub}</p>}
    </div>
  )
}

function ProgressRing({ percent }) {
  const pct = Math.min(100, Math.max(0, Number(percent) || 0))
  const r = 36
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg className="-rotate-90 transform" width="96" height="96" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-slate-800"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="url(#jring)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
        <defs>
          <linearGradient id="jring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-center text-sm font-bold leading-tight text-white">
        {pct < 1 && pct > 0 ? pct.toFixed(1) : Math.round(pct)}%
      </span>
    </div>
  )
}

export default function JourneyDetails() {
  const { journeyId } = useParams()
  const navigate = useNavigate()
  const { data: journey, isLoading: jLoading, isError: jErr } =
    useGetJourneyByIdQuery(journeyId)
  const { data: items, isLoading: iLoading, isError: iErr } =
    useGetItemsQuery(journeyId)

  const list = Array.isArray(items) ? items : []
  const target = journey?.targetItems ?? 0
  const doneCount = list.length
  const progress = useMemo(
    () => completionMetrics(list, target),
    [list, target]
  )

  const topicTags = useMemo(() => {
    const t = journey?.metadata?.topicTags
    return Array.isArray(t) ? t.filter((x) => typeof x === 'string') : []
  }, [journey])

  const extraMeta = useMemo(() => {
    const m = journey?.metadata
    if (!m || typeof m !== 'object') return null
    const { topicTags: _, ...rest } = m
    const keys = Object.keys(rest)
    if (!keys.length) return null
    return rest
  }, [journey])

  if (jLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="h-40 rounded-2xl bg-slate-800/80" />
      </div>
    )
  }
  if (jErr || !journey) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-300">
        Journey not found or failed to load.
        <Link to="/journeys" className="mt-4 block text-violet-400 hover:underline">
          ← Journeys
        </Link>
      </div>
    )
  }

  const typeLabel = JOURNEY_LABELS[journey.journeyType] || journey.journeyType

  return (
    <div className="pb-16">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/journeys" className="text-violet-400 hover:underline">
          Journeys
        </Link>
        <span className="text-slate-600">/</span>
        <span className="max-w-[14rem] truncate text-slate-400">{journey.title}</span>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/40 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/20">
                {typeLabel}
              </span>
              <StatusPill status={journey.status} />
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="opacity-60">·</span>
                <VisibilityPill v={journey.visibility} />
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {journey.title}
            </h1>
            {journey.category && (
              <p className="mt-2 text-sm text-violet-300/80">{journey.category}</p>
            )}
            {journey.description ? (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                {journey.description}
              </p>
            ) : (
              <p className="mt-4 text-sm italic text-slate-600">No description yet.</p>
            )}
            {topicTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {topicTags.map((id) => (
                  <span
                    key={id}
                    className="rounded-lg bg-slate-800/90 px-2 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700"
                  >
                    {CS_TOPIC_LABEL[id] || id.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row lg:flex-col lg:items-end">
            <div className="flex flex-col items-center gap-1">
              <ProgressRing percent={progress.percent} />
              <span className="max-w-[6rem] text-center text-[9px] text-slate-500">
                Done vs target
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <Link
                to={`/journeys/${journeyId}/edit`}
                className="rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
              >
                Edit journey
              </Link>
              <Link
                to={`/journeys/${journeyId}/items/new`}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500"
              >
                New item
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <StatCard
          label="Items"
          value={doneCount}
          sub={target ? `Target ${target}` : 'No target set'}
        />
        <StatCard label="Priority" value={journey.priority ?? 0} />
        <StatCard
          label="Start"
          value={formatDate(journey.startDate) || '—'}
        />
        <StatCard label="End" value={formatDate(journey.endDate) || '—'} />
        <StatCard
          label="Last activity"
          value={formatDate(journey.lastActivityAt) || '—'}
          sub={journey.updatedAt ? `Updated ${formatDate(journey.updatedAt)}` : undefined}
        />
      </div>

      <div className="mt-6">
        <JourneyTimeline
          startDate={journey.startDate}
          endDate={journey.endDate}
          items={list}
          targetItems={target}
        />
      </div>

      {extraMeta && (
        <details className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/30 px-4 py-3">
          <summary className="cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-300">
            Custom metadata (JSON)
          </summary>
          <pre className="scrollbar-themed mt-3 max-h-40 overflow-y-auto overflow-x-hidden rounded-lg bg-slate-950 p-3 text-[11px] text-slate-500">
            {JSON.stringify(extraMeta, null, 2)}
          </pre>
        </details>
      )}

      <JourneyItemsSection
        journeyId={journeyId}
        items={list}
        loading={iLoading}
        error={iErr}
        onCreateClick={() => navigate(`/journeys/${journeyId}/items/new`)}
        empty={
          <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 py-16 text-center">
            <p className="text-slate-500">No items yet.</p>
            <Link
              to={`/journeys/${journeyId}/items/new`}
              className="mt-3 inline-block text-sm font-medium text-violet-400 hover:underline"
            >
              Create first item
            </Link>
          </div>
        }
      />
    </div>
  )
}
