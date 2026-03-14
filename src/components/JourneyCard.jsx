import { Link } from 'react-router-dom'
import { JOURNEY_LABELS } from '../constants/journey'

/** CSS-only visual by journey type: gradient + optional pattern. Exported for use in list/tile views. */
export function journeyTypeVisual(journeyType) {
  const t = String(journeyType || 'CUSTOM').toUpperCase()
  const styles = {
    DSA:
      'from-emerald-600/90 via-teal-600/80 to-cyan-700/90 dark:from-emerald-500/40 dark:via-teal-600/35 dark:to-cyan-700/40',
    SYSTEM_DESIGN:
      'from-blue-600/90 via-indigo-600/80 to-violet-700/90 dark:from-blue-500/40 dark:via-indigo-600/35 dark:to-violet-700/40',
    DBMS:
      'from-amber-500/90 via-orange-500/80 to-rose-600/90 dark:from-amber-500/40 dark:via-orange-500/35 dark:to-rose-600/40',
    OS: 'from-slate-600/90 via-slate-500/80 to-zinc-600/90 dark:from-slate-500/40 dark:via-slate-600/35 dark:to-zinc-600/40',
    WEB_DEV:
      'from-fuchsia-500/90 via-pink-500/80 to-rose-500/90 dark:from-fuchsia-500/40 dark:via-pink-500/35 dark:to-rose-500/40',
    CUSTOM:
      'from-violet-500/80 via-purple-500/70 to-fuchsia-600/80 dark:from-violet-500/35 dark:via-purple-500/30 dark:to-fuchsia-600/35',
  }
  return styles[t] || styles.CUSTOM
}

export function statusPillClass(status) {
  const s = String(status || 'planned').toLowerCase()
  const map = {
    planned:
      'bg-slate-200/90 text-slate-800 ring-slate-300 dark:bg-slate-700/80 dark:text-slate-200 dark:ring-slate-500/40',
    active:
      'bg-emerald-200/90 text-emerald-900 ring-emerald-300 dark:bg-emerald-500/30 dark:text-emerald-100 dark:ring-emerald-400/50',
    paused:
      'bg-amber-200/90 text-amber-900 ring-amber-300 dark:bg-amber-500/30 dark:text-amber-100 dark:ring-amber-400/50',
    completed:
      'bg-violet-200/90 text-violet-900 ring-violet-300 dark:bg-violet-500/30 dark:text-violet-100 dark:ring-violet-400/50',
    archived:
      'bg-slate-300/80 text-slate-700 ring-slate-400 dark:bg-slate-600/50 dark:text-slate-300 dark:ring-slate-500/40',
  }
  return map[s] || map.planned
}

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatShortDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** Tile: compact square-ish card for grid */
function JourneyTile({ journey, heroClass, typeLabel }) {
  return (
    <Link
      to={`/journeys/${journey._id}`}
      className="group relative flex aspect-square max-h-[9.5rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 p-3 text-center shadow-md transition hover:border-violet-400 hover:shadow-lg dark:border-slate-700 dark:hover:border-violet-500/50"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${heroClass} opacity-95 dark:opacity-90`} aria-hidden />
      <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/30" aria-hidden />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
          {typeLabel}
        </span>
        <span className="mt-2 line-clamp-2 text-xs font-semibold text-slate-900 dark:text-white">
          {journey.title || 'Untitled'}
        </span>
        <span className={`mt-auto rounded-full px-2 py-0.5 text-[10px] ring-1 ${statusPillClass(journey.status)}`}>
          {JOURNEY_LABELS[journey.status] || journey.status}
        </span>
      </div>
    </Link>
  )
}

/** Card: default rich card with hero strip */
function JourneyCardContent({ journey, hasMenu }) {
  const typeLabel = JOURNEY_LABELS[journey.journeyType] || journey.journeyType
  const topicTags = Array.isArray(journey.metadata?.topicTags) ? journey.metadata.topicTags : []
  const tagCount = topicTags.length
  const heroClass = journeyTypeVisual(journey.journeyType)

  return (
    <Link
      to={`/journeys/${journey._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-violet-400/60 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-violet-500/50"
    >
      <div className={`relative h-20 w-full shrink-0 bg-gradient-to-br ${heroClass} sm:h-24`} aria-hidden>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)] dark:opacity-10" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-200">
            {typeLabel}
          </span>
          {journey.targetItems > 0 && (
            <span className="rounded bg-black/20 px-2 py-0.5 text-[10px] font-medium text-white dark:bg-white/20">
              Goal: {journey.targetItems}
            </span>
          )}
        </div>
      </div>
      <div className={`flex min-h-0 flex-1 flex-col p-4 ${hasMenu ? 'pr-12' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 font-semibold text-slate-900 dark:text-white line-clamp-2">
            {journey.title || 'Untitled'}
          </h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusPillClass(journey.status)}`}>
            {JOURNEY_LABELS[journey.status] || journey.status}
          </span>
        </div>
        {/* Fixed min-height so all cards match; content clamps or hides */}
        <div className="mt-3 hidden min-h-[4.5rem] flex-col gap-1.5 sm:flex">
          {journey.description ? (
            <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{journey.description}</p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-600">&nbsp;</p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-500">
            {journey.category && <span className="font-medium text-slate-600 dark:text-slate-400">{journey.category}</span>}
            {tagCount > 0 && <span>{tagCount} topic{tagCount !== 1 ? 's' : ''}</span>}
            {journey.startDate && <span title={formatDate(journey.startDate)}>From {formatShortDate(journey.startDate)}</span>}
            {journey.lastActivityAt && <span className="text-slate-400 dark:text-slate-500" title={formatDate(journey.lastActivityAt)}>Active {formatShortDate(journey.lastActivityAt)}</span>}
            {!journey.category && tagCount === 0 && !journey.startDate && !journey.lastActivityAt && <span>&nbsp;</span>}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
          <span className="text-[11px] text-slate-500 dark:text-slate-500">{typeLabel}</span>
          {journey.targetItems > 0 && <span className="text-[11px] text-slate-500 dark:text-slate-500">· Goal {journey.targetItems}</span>}
          {tagCount > 0 && <span className="text-[11px] text-slate-500 dark:text-slate-500">· {tagCount} topic{tagCount !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </Link>
  )
}

/** Detailed: larger card with full meta grid */
function JourneyDetailedContent({ journey, hasMenu }) {
  const typeLabel = JOURNEY_LABELS[journey.journeyType] || journey.journeyType
  const topicTags = Array.isArray(journey.metadata?.topicTags) ? journey.metadata.topicTags : []
  const heroClass = journeyTypeVisual(journey.journeyType)

  return (
    <Link
      to={`/journeys/${journey._id}`}
      className={`block rounded-2xl border border-slate-200 bg-white shadow-md transition hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-violet-500/50 p-5 sm:p-6 ${hasMenu ? 'pr-14 sm:pr-16' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block h-3 w-12 rounded-full bg-gradient-to-r ${heroClass}`} aria-hidden />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{journey.title || 'Untitled'}</h3>
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {typeLabel}
            </span>
            <span className={`rounded-lg px-2 py-0.5 text-[10px] ring-1 ${statusPillClass(journey.status)}`}>
              {JOURNEY_LABELS[journey.status] || journey.status}
            </span>
          </div>
          {journey.description && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{journey.description}</p>
          )}
        </div>
        <div className="shrink-0 text-right text-xs text-slate-500">
          <div className="rounded-lg bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800/50">Goal: {journey.targetItems || 0}</div>
          <div className="mt-1">Updated {formatShortDate(journey.updatedAt)}</div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
        {journey.category && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
            <span className="text-slate-500">Category</span>
            <p className="text-slate-800 dark:text-slate-200">{journey.category}</p>
          </div>
        )}
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
          <span className="text-slate-500">Topics</span>
          <p className="text-slate-800 dark:text-slate-200">{topicTags.length} tag{topicTags.length !== 1 ? 's' : ''}</p>
        </div>
        {(journey.startDate || journey.endDate) && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
            <span className="text-slate-500">Dates</span>
            <p className="text-slate-800 dark:text-slate-200">
              {journey.startDate ? formatShortDate(journey.startDate) : '—'} → {journey.endDate ? formatShortDate(journey.endDate) : '—'}
            </p>
          </div>
        )}
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
          <span className="text-slate-500">Last activity</span>
          <p className="text-slate-800 dark:text-slate-200">{journey.lastActivityAt ? formatShortDate(journey.lastActivityAt) : '—'}</p>
        </div>
      </div>
      {topicTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {topicTags.slice(0, 6).map((tag) => (
            <span key={tag} className="rounded-lg bg-violet-100 px-2 py-0.5 text-[10px] text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-500/20">
              {tag}
            </span>
          ))}
          {topicTags.length > 6 && <span className="text-[10px] text-slate-500">+{topicTags.length - 6}</span>}
        </div>
      )}
    </Link>
  )
}

export default function JourneyCard({ journey, variant = 'card', hasMenu }) {
  if (!journey?._id) return null
  const typeLabel = JOURNEY_LABELS[journey.journeyType] || journey.journeyType
  const heroClass = journeyTypeVisual(journey.journeyType)

  if (variant === 'tile') {
    return (
      <div className="relative">
        <JourneyTile journey={journey} heroClass={heroClass} typeLabel={typeLabel} />
      </div>
    )
  }
  if (variant === 'detailed') {
    return (
      <div className="relative">
        <JourneyDetailedContent journey={journey} hasMenu={hasMenu} />
      </div>
    )
  }
  return (
    <div className="relative h-full min-h-0">
      <JourneyCardContent journey={journey} hasMenu={hasMenu} />
    </div>
  )
}
