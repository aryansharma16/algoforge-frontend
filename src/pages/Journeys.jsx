import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetJourneysQuery, useDeleteJourneyMutation } from '../api/journeyApi'
import JourneyCard from '../components/JourneyCard'
import JourneyQuickMenu from '../components/JourneyQuickMenu'
import ConfirmDialog from '../components/ConfirmDialog'
import { formatShortDate } from '../components/JourneyCard'
import { journeyTypeVisual, statusPillClass } from '../components/JourneyCard'
import {
  JOURNEY_TYPES,
  JOURNEY_LABELS,
  JOURNEY_STATUSES,
} from '../constants/journey'
import { toast, apiErrorMessage } from '../utils/toast'

const VIEWS = [
  { id: 'tiles', label: 'Tiles', hint: 'Compact grid' },
  { id: 'cards', label: 'Cards', hint: 'Balanced' },
  { id: 'detailed', label: 'Detailed', hint: 'Full context' },
  { id: 'list', label: 'List', hint: 'Table' },
]

const SORT_OPTIONS = [
  { value: 'lastActivityAt', label: 'Last activity' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'createdAt', label: 'Created' },
  { value: 'status', label: 'Status' },
]

const STATUS_ORDER = { active: 0, planned: 1, paused: 2, completed: 3, archived: 4 }

function filterAndSortJourneys(list, search, typeFilter, statusFilter, sortBy, sortDir) {
  let out = list

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    out = out.filter(
      (j) =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.description || '').toLowerCase().includes(q) ||
        (j.category || '').toLowerCase().includes(q)
    )
  }
  if (typeFilter && typeFilter !== 'all') {
    out = out.filter((j) => String(j.journeyType || '').toUpperCase() === typeFilter.toUpperCase())
  }
  if (statusFilter && statusFilter !== 'all') {
    out = out.filter((j) => String(j.status || '').toLowerCase() === statusFilter.toLowerCase())
  }

  const mul = sortDir === 'asc' ? 1 : -1
  out = [...out].sort((a, b) => {
    let cmp = 0
    switch (sortBy) {
      case 'title':
        cmp = String(a.title || '').localeCompare(String(b.title || ''))
        break
      case 'createdAt':
        cmp =
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        break
      case 'status':
        cmp =
          (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
        break
      case 'lastActivityAt':
      default:
        cmp =
          new Date(a.lastActivityAt || 0).getTime() -
          new Date(b.lastActivityAt || 0).getTime()
        break
    }
    if (cmp !== 0) return cmp * mul
    return String(a._id).localeCompare(String(b._id))
  })
  return out
}

export default function Journeys() {
  const { data, isLoading, isError, error } = useGetJourneysQuery()
  const [deleteJourney, { isLoading: deleting }] = useDeleteJourneyMutation()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('lastActivityAt')
  const [sortDir, setSortDir] = useState('desc')
  const [view, setView] = useState('cards')
  const [menuOpen, setMenuOpen] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function confirmDelete() {
    if (!deleteTarget?._id) return
    try {
      await deleteJourney(deleteTarget._id).unwrap()
      toast.success('Journey deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error('Could not delete journey', { description: apiErrorMessage(err) })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      </div>
    )
  }
  if (isError) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || 'Could not load journeys'}
      </p>
    )
  }

  const list = Array.isArray(data) ? data : []
  const filtered = useMemo(
    () =>
      filterAndSortJourneys(list, search, typeFilter, statusFilter, sortBy, sortDir),
    [list, search, typeFilter, statusFilter, sortBy, sortDir]
  )

  const hasFilters = search.trim() || typeFilter !== 'all' || statusFilter !== 'all'

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Journeys
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Learning paths you own. Create a journey, add items, and track progress.
          </p>
        </div>
        <Link
          to="/journeys/new"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-md shadow-violet-900/25 hover:bg-violet-500 sm:w-auto sm:py-2.5"
        >
          New journey
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
          <p className="text-slate-600 dark:text-slate-400">No journeys yet.</p>
          <Link
            to="/journeys/new"
            className="mt-4 inline-block text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Create your first journey →
          </Link>
        </div>
      ) : (
        <>
          {/* Single toolbar: search, view, sort, type filter, status filter */}
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/40 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden>
                🔍
              </span>
              <input
                type="search"
                placeholder="Search journeys…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-800">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    title={v.hint}
                    onClick={() => setView(v.id)}
                    className={`shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition sm:text-xs ${
                      view === v.id
                        ? 'bg-violet-600 text-white shadow-sm dark:bg-violet-500'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <select
                id="journeys-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
                aria-label={sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortDir === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-l border-slate-200 pl-2 dark:border-slate-600 sm:border-l-0 sm:pl-0">
              <label className="sr-only" htmlFor="journeys-type">Type</label>
              <select
                id="journeys-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Type: All</option>
                {JOURNEY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {JOURNEY_LABELS[t] || t}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="journeys-status">Status</label>
              <select
                id="journeys-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Status: All</option>
                {JOURNEY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {JOURNEY_LABELS[s] || s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasFilters && (
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-500">
              Showing {filtered.length} of {list.length} journey{list.length !== 1 ? 's' : ''}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
              <p className="text-slate-600 dark:text-slate-400">No journeys match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
                className="mt-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                Clear filters
              </button>
            </div>
          ) : view === 'tiles' ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((j) => (
                <li key={j._id}>
                  <JourneyCard journey={j} variant="tile" />
                </li>
              ))}
            </ul>
          ) : view === 'cards' ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
              {filtered.map((j) => (
                <li key={j._id} className="group relative flex min-h-0">
                  <div className="absolute right-3 top-3 z-10">
                    <JourneyQuickMenu
                      journeyId={j._id}
                      journeyTitle={j.title}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      onAskDelete={setDeleteTarget}
                    />
                  </div>
                  <div className="min-h-0 flex-1">
                    <JourneyCard journey={j} variant="card" hasMenu />
                  </div>
                </li>
              ))}
            </ul>
          ) : view === 'detailed' ? (
            <ul className="space-y-4">
              {filtered.map((j) => (
                <li key={j._id} className="relative">
                  <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                    <JourneyQuickMenu
                      journeyId={j._id}
                      journeyTitle={j.title}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      onAskDelete={setDeleteTarget}
                    />
                  </div>
                  <JourneyCard journey={j} variant="detailed" hasMenu />
                </li>
              ))}
            </ul>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">Title</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Goal</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Updated</th>
                    <th className="w-12 px-2 py-3.5 text-right"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filtered.map((j) => (
                    <tr key={j._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <Link
                          to={`/journeys/${j._id}`}
                          className="font-medium text-violet-700 hover:underline dark:text-violet-300 dark:hover:text-violet-200"
                        >
                          {j.title || 'Untitled'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {JOURNEY_LABELS[j.journeyType] || j.journeyType}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] ring-1 ${statusPillClass(j.status)}`}>
                          {JOURNEY_LABELS[j.status] || j.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-400">
                        {j.targetItems ?? 0}
                      </td>
                      <td className="max-w-[8rem] truncate px-4 py-3 text-slate-500 dark:text-slate-500">
                        {j.category || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-500">
                        {formatShortDate(j.updatedAt) || '—'}
                      </td>
                      <td className="px-2 py-2 text-right align-middle">
                        <JourneyQuickMenu
                          journeyId={j._id}
                          journeyTitle={j.title}
                          menuOpen={menuOpen}
                          setMenuOpen={setMenuOpen}
                          onAskDelete={setDeleteTarget}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this journey?"
        message={
          deleteTarget
            ? `"${deleteTarget.title || 'This journey'}" and all its items and submissions will be removed permanently.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
