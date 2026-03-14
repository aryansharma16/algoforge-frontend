import { useMemo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDeleteItemMutation } from '../api/itemApi'
import ConfirmDialog from './ConfirmDialog'
import { toast, apiErrorMessage } from '../utils/toast'
import {
  LEARNING_ITEM_TYPES,
  ITEM_STATUSES,
  ITEM_TYPE_LABELS,
  ITEM_STATUS_LABELS,
  STATUS_SORT_ORDER,
  SORT_OPTIONS,
} from '../constants/learningItem'

const VIEWS = [
  { id: 'tiles', label: 'Tiles', hint: 'Compact grid' },
  { id: 'cards', label: 'Cards', hint: 'Balanced' },
  { id: 'detailed', label: 'Detailed', hint: 'Full context' },
  { id: 'list', label: 'List', hint: 'Table' },
]

function statusPillClass(status) {
  const s = String(status || 'pending').toLowerCase()
  const map = {
    pending:
      'bg-slate-200 text-slate-800 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-slate-500/30',
    in_progress:
      'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/35',
    completed:
      'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-400/35',
    skipped:
      'bg-slate-200 text-slate-600 ring-slate-300 dark:bg-slate-600/25 dark:text-slate-400 dark:ring-slate-500/25',
  }
  return map[s] || map.pending
}

function typeIcon(type) {
  const t = String(type || 'other')
  const icons = {
    problem: '⌁',
    topic: '§',
    reading: '¶',
    video: '▶',
    task: '✓',
    other: '·',
  }
  return icons[t] || icons.other
}

function formatShort(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function collectUniques(items, key) {
  const set = new Set()
  for (const it of items) {
    if (key === 'tags' || key === 'flags') {
      const arr = it[key]
      if (Array.isArray(arr)) arr.forEach((x) => x && set.add(String(x)))
    } else {
      const v = it[key]
      if (v != null && String(v).trim()) set.add(String(v).trim())
    }
  }
  return [...set].sort()
}

function matchesFilters(item, f) {
  if (f.search) {
    const q = f.search.toLowerCase()
    const title = (item.title || '').toLowerCase()
    const desc = (item.description || '').toLowerCase()
    const notes = (item.notes || '').toLowerCase()
    if (!title.includes(q) && !desc.includes(q) && !notes.includes(q)) return false
  }
  if (f.status.size > 0 && !f.status.has(String(item.status || 'pending'))) return false
  if (f.type.size > 0 && !f.type.has(String(item.type || 'problem'))) return false
  if (f.tagAny.length) {
    const tags = new Set((item.tags || []).map(String))
    if (!f.tagAny.some((t) => tags.has(t))) return false
  }
  if (f.flagAny.length) {
    const flags = new Set((item.flags || []).map(String))
    if (!f.flagAny.some((x) => flags.has(x))) return false
  }
  if (f.platform && String(item.platform || '').toLowerCase() !== f.platform.toLowerCase())
    return false
  if (
    f.platformDifficulty &&
    String(item.platformDifficulty || '') !== f.platformDifficulty
  )
    return false
  if (
    f.personalDifficulty &&
    String(item.personalDifficulty || '') !== f.personalDifficulty
  )
    return false
  if (f.revisionOnly && !item.revisionRequired) return false
  if (f.minSubmissions !== '') {
    const n = Number(f.minSubmissions)
    if (!Number.isNaN(n) && (item.submissionCount ?? 0) < n) return false
  }
  return true
}

function sortItems(items, sortField, dir) {
  const mul = dir === 'asc' ? 1 : -1
  const statusRank = (s) => STATUS_SORT_ORDER[s] ?? 99
  return [...items].sort((a, b) => {
    let cmp = 0
    switch (sortField) {
      case 'orderIndex':
        cmp = (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        break
      case 'createdAt':
        cmp =
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        break
      case 'updatedAt':
        cmp =
          new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
        break
      case 'title':
        cmp = String(a.title || '').localeCompare(String(b.title || ''))
        break
      case 'status':
        cmp = statusRank(a.status) - statusRank(b.status)
        break
      case 'type':
        cmp = String(a.type || '').localeCompare(String(b.type || ''))
        break
      case 'submissionCount':
        cmp = (a.submissionCount ?? 0) - (b.submissionCount ?? 0)
        break
      case 'lastSubmissionAt':
        cmp =
          new Date(a.lastSubmissionAt || 0).getTime() -
          new Date(b.lastSubmissionAt || 0).getTime()
        break
      case 'platformDifficulty':
        cmp = String(a.platformDifficulty || '').localeCompare(
          String(b.platformDifficulty || '')
        )
        break
      case 'personalDifficulty':
        cmp = String(a.personalDifficulty || '').localeCompare(
          String(b.personalDifficulty || '')
        )
        break
      case 'platform':
        cmp = String(a.platform || '').localeCompare(String(b.platform || ''))
        break
      default:
        cmp = (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    }
    if (cmp !== 0) return cmp * mul
    return String(a._id).localeCompare(String(b._id))
  })
}

/** ⋮ menu: View / Edit / Delete. Stops propagation so parent Link still works for the rest of the card. */
function ItemQuickMenu({
  journeyId,
  itemId,
  itemTitle,
  base,
  menuOpen,
  setMenuOpen,
  onAskDelete,
}) {
  const open = menuOpen === itemId
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, setMenuOpen])

  return (
    <div className="relative z-20" ref={wrapRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Item actions"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setMenuOpen(open ? null : itemId)
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <span className="text-lg leading-none">⋮</span>
      </button>
      {open && (
        <ul
          className="scrollbar-themed absolute right-0 top-full mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-600 dark:bg-[#16161e]"
          onClick={(e) => e.stopPropagation()}
        >
          <li>
            <Link
              to={`${base}/${itemId}`}
              className="block px-3 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen(null)}
            >
              View
            </Link>
          </li>
          <li>
            <Link
              to={`${base}/${itemId}/edit`}
              className="block px-3 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen(null)}
            >
              Edit
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              onClick={() => {
                setMenuOpen(null)
                onAskDelete({ _id: itemId, title: itemTitle })
              }}
            >
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

function ToggleChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
        active
          ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200 hover:text-slate-900 dark:bg-[#16161e] dark:text-slate-400 dark:ring-slate-700/80 dark:hover:bg-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function cloneFilterState(f) {
  return {
    status: new Set(f.status),
    type: new Set(f.type),
    tagAny: [...f.tagAny],
    flagAny: [...f.flagAny],
    platform: f.platform,
    platformDifficulty: f.platformDifficulty,
    personalDifficulty: f.personalDifficulty,
    revisionOnly: f.revisionOnly,
    minSubmissions: f.minSubmissions,
  }
}

const EMPTY_FILTERS = {
  status: new Set(),
  type: new Set(),
  tagAny: [],
  flagAny: [],
  platform: '',
  platformDifficulty: '',
  personalDifficulty: '',
  revisionOnly: false,
  minSubmissions: '',
}

function appliedFilterCount(f) {
  let n = 0
  if (f.status.size) n++
  if (f.type.size) n++
  if (f.tagAny.length) n++
  if (f.flagAny.length) n++
  if (f.platform) n++
  if (f.platformDifficulty) n++
  if (f.personalDifficulty) n++
  if (f.revisionOnly) n++
  if (f.minSubmissions !== '') n++
  return n
}

export default function JourneyItemsSection({
  journeyId,
  items,
  loading,
  error,
  onCreateClick,
  empty,
}) {
  const list = Array.isArray(items) ? items : []
  const [view, setView] = useState('cards')
  const [sortField, setSortField] = useState('orderIndex')
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState(() => cloneFilterState(EMPTY_FILTERS))
  const [draft, setDraft] = useState(() => cloneFilterState(EMPTY_FILTERS))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const filterRef = useRef(null)
  const addRef = useRef(null)
  const [itemMenuOpen, setItemMenuOpen] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteItem, { isLoading: deleting }] = useDeleteItemMutation()

  const allTags = useMemo(() => collectUniques(list, 'tags'), [list])
  const allFlags = useMemo(() => collectUniques(list, 'flags'), [list])
  const allPlatforms = useMemo(() => collectUniques(list, 'platform'), [list])
  const allPlatDiff = useMemo(() => collectUniques(list, 'platformDifficulty'), [list])
  const allPersDiff = useMemo(() => collectUniques(list, 'personalDifficulty'), [list])

  useEffect(() => {
    function close(e) {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFiltersOpen(false)
      if (addRef.current && !addRef.current.contains(e.target)) setAddOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const openFilters = () => {
    setDraft(cloneFilterState(applied))
    setFiltersOpen(true)
    setAddOpen(false)
  }

  const applyFilters = () => {
    setApplied(cloneFilterState(draft))
    setFiltersOpen(false)
  }

  const clearAppliedAndDraft = () => {
    const empty = cloneFilterState(EMPTY_FILTERS)
    setApplied(empty)
    setDraft(empty)
    setFiltersOpen(false)
  }

  const filtered = useMemo(() => {
    return list.filter((item) =>
      matchesFilters(item, {
        search,
        ...applied,
      })
    )
  }, [list, search, applied])

  const sorted = useMemo(
    () => sortItems(filtered, sortField, sortDir),
    [filtered, sortField, sortDir]
  )

  const filterBadge = appliedFilterCount(applied)
  const completedCount = useMemo(
    () => list.filter((i) => String(i.status).toLowerCase() === 'completed').length,
    [list]
  )

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-10 dark:border-slate-800/80 dark:bg-[#0d1117]">
        <span className="h-8 w-8 animate-pulse rounded-full bg-violet-500/20" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800/80" />
        </div>
      </div>
    )
  }
  if (error) return <p className="mt-10 text-red-400">Could not load items</p>
  if (list.length === 0) return empty

  const base = `/journeys/${journeyId}/items`

  async function confirmDeleteItem() {
    if (!deleteTarget?._id) return
    try {
      await deleteItem({ journeyId, itemId: deleteTarget._id }).unwrap()
      toast.success('Item deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error('Could not delete item', { description: apiErrorMessage(err) })
    }
  }
  const d = draft

  return (
    <section className="mt-8 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200/80 dark:border-slate-800/90 dark:bg-[#0a0c10] dark:shadow-xl dark:ring-black/20 sm:mt-10 md:mt-12 sm:rounded-2xl">
      {/* Header strip */}
      <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-5 dark:border-slate-800/90 dark:from-[#12151c] dark:via-[#0d1117] dark:to-[#12151c] sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgb(139,92,246) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgb(99,102,241) 0%, transparent 45%)`,
          }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-lg text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/25">
                ≡
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Items
              </h2>
            </div>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-500">
              Search, filter, and open items. Layout changes how dense the grid feels.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700/80">
              {list.length} total
            </span>
            <span
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ${
                sorted.length < list.length
                  ? 'bg-violet-100 text-violet-900 ring-violet-300 dark:bg-violet-950/50 dark:text-violet-200 dark:ring-violet-500/30'
                  : 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:ring-slate-700/80'
              }`}
            >
              {sorted.length} shown
            </span>
            <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800 ring-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400/90 dark:ring-emerald-500/20">
              {completedCount} done
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800/80 dark:bg-[#0d1117] sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search title, description, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/25 dark:border-slate-700/80 dark:bg-[#16161e] dark:text-slate-100 dark:placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Layout segments */}
            <div className="flex max-w-full snap-x snap-mandatory overflow-x-auto rounded-xl border border-slate-300 bg-white p-1 scrollbar-themed dark:border-slate-700/80 dark:bg-[#16161e] sm:snap-none sm:flex-wrap">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  title={v.hint}
                  onClick={() => setView(v.id)}
                  className={`shrink-0 snap-start rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition sm:px-3 sm:text-xs ${
                    view === v.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="select-ide min-w-[9rem] py-2 text-xs"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-[#16161e]">
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
                onClick={() => setSortDir((x) => (x === 'asc' ? 'desc' : 'asc'))}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-violet-500/40 hover:text-violet-700 dark:border-slate-600 dark:bg-[#16161e] dark:text-slate-300 dark:hover:text-white"
              >
                {sortDir === 'asc' ? '↑' : '↓'}
              </button>
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => (filtersOpen ? setFiltersOpen(false) : openFilters())}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
                    filterBadge
                      ? 'border-violet-500/50 bg-violet-950/40 text-violet-100'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-[#16161e] dark:text-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  Filters
                  {filterBadge > 0 && (
                    <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] text-white">
                      {filterBadge}
                    </span>
                  )}
                  <span className="text-slate-500">{filtersOpen ? '▲' : '▼'}</span>
                </button>
                {filtersOpen && (
                  <div className="scrollbar-themed absolute right-0 top-full z-30 mt-2 w-[min(100vw-2rem,24rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-slate-200 dark:border-slate-600 dark:bg-[#16161e] dark:ring-black/50 sm:w-[22rem]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Filter items
                    </p>
                    <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
                      Apply saves filters. Clear resets everything.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                          Status
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ITEM_STATUSES.map((s) => (
                            <ToggleChip
                              key={s}
                              active={d.status.has(s)}
                              onClick={() =>
                                setDraft((prev) => {
                                  const next = cloneFilterState(prev)
                                  if (next.status.has(s)) next.status.delete(s)
                                  else next.status.add(s)
                                  return next
                                })
                              }
                            >
                              {ITEM_STATUS_LABELS[s]}
                            </ToggleChip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                          Type
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {LEARNING_ITEM_TYPES.map((t) => (
                            <ToggleChip
                              key={t}
                              active={d.type.has(t)}
                              onClick={() =>
                                setDraft((prev) => {
                                  const next = cloneFilterState(prev)
                                  if (next.type.has(t)) next.type.delete(t)
                                  else next.type.add(t)
                                  return next
                                })
                              }
                            >
                              {ITEM_TYPE_LABELS[t]}
                            </ToggleChip>
                          ))}
                        </div>
                      </div>
                      {allTags.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {allTags.map((tag) => (
                              <ToggleChip
                                key={tag}
                                active={d.tagAny.includes(tag)}
                                onClick={() =>
                                  setDraft((prev) => {
                                    const next = cloneFilterState(prev)
                                    next.tagAny = next.tagAny.includes(tag)
                                      ? next.tagAny.filter((x) => x !== tag)
                                      : [...next.tagAny, tag]
                                    return next
                                  })
                                }
                              >
                                {tag}
                              </ToggleChip>
                            ))}
                          </div>
                        </div>
                      )}
                      {allFlags.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                            Flags
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {allFlags.map((fl) => (
                              <ToggleChip
                                key={fl}
                                active={d.flagAny.includes(fl)}
                                onClick={() =>
                                  setDraft((prev) => {
                                    const next = cloneFilterState(prev)
                                    next.flagAny = next.flagAny.includes(fl)
                                      ? next.flagAny.filter((x) => x !== fl)
                                      : [...next.flagAny, fl]
                                    return next
                                  })
                                }
                              >
                                {fl}
                              </ToggleChip>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[10px] text-slate-500">Platform</label>
                          <select
                            value={d.platform}
                            onChange={(e) =>
                              setDraft((p) => ({ ...cloneFilterState(p), platform: e.target.value }))
                            }
                            className="select-ide w-full py-2 text-xs"
                          >
                            <option value="">Any</option>
                            {allPlatforms.map((p) => (
                              <option key={p} value={p} className="bg-[#16161e]">
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-slate-500">
                            Plat. difficulty
                          </label>
                          <select
                            value={d.platformDifficulty}
                            onChange={(e) =>
                              setDraft((p) => ({
                                ...cloneFilterState(p),
                                platformDifficulty: e.target.value,
                              }))
                            }
                            className="select-ide w-full py-2 text-xs"
                          >
                            <option value="">Any</option>
                            {allPlatDiff.map((p) => (
                              <option key={p} value={p} className="bg-[#16161e]">
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-slate-500">
                            Personal diff.
                          </label>
                          <select
                            value={d.personalDifficulty}
                            onChange={(e) =>
                              setDraft((p) => ({
                                ...cloneFilterState(p),
                                personalDifficulty: e.target.value,
                              }))
                            }
                            className="select-ide w-full py-2 text-xs"
                          >
                            <option value="">Any</option>
                            {allPersDiff.map((p) => (
                              <option key={p} value={p} className="bg-[#16161e]">
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-slate-500">
                            Min submissions
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={d.minSubmissions}
                            onChange={(e) =>
                              setDraft((p) => ({
                                ...cloneFilterState(p),
                                minSubmissions: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-[#0d1117] dark:text-slate-200"
                          />
                        </div>
                      </div>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={d.revisionOnly}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...cloneFilterState(p),
                              revisionOnly: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-400 dark:border-slate-600"
                        />
                        Revision required only
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={applyFilters}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={clearAppliedAndDraft}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Clear all
                      </button>
                      <button
                        type="button"
                        onClick={() => setFiltersOpen(false)}
                        className="ml-auto rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={addRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAddOpen((o) => !o)
                    setFiltersOpen(false)
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-violet-600 to-violet-700 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-900/25 hover:from-violet-500 hover:to-violet-600"
                >
                  Add
                  <span className="opacity-80">▼</span>
                </button>
                {addOpen && (
                  <div className="absolute right-0 top-full z-30 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-slate-200 dark:border-slate-600 dark:bg-[#16161e] dark:ring-black/40">
                    <button
                      type="button"
                      className="block w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-violet-100 hover:text-violet-900 dark:text-slate-200 dark:hover:bg-violet-600/20 dark:hover:text-white"
                      onClick={() => {
                        setAddOpen(false)
                        onCreateClick()
                      }}
                    >
                      New item
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="bg-slate-50 p-4 dark:bg-[#0a0c10] sm:p-5">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700/80 dark:bg-[#0d1117]/80">
            <p className="text-slate-600 dark:text-slate-400">Nothing matches search or filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                clearAppliedAndDraft()
              }}
              className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-violet-700 hover:bg-slate-50 dark:border-0 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-slate-700"
            >
              Clear search & filters
            </button>
          </div>
        ) : view === 'tiles' ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sorted.map((item) => (
              <li key={item._id}>
                <Link
                  to={`${base}/${item._id}`}
                  className="group flex aspect-square max-h-[9.5rem] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 text-center shadow-md transition hover:border-violet-400 hover:shadow-violet-200/50 dark:border-slate-800/90 dark:from-[#16161e] dark:to-[#0d1117] dark:shadow-black/20 dark:hover:border-violet-500/45 dark:hover:shadow-violet-950/20"
                >
                  <span className="text-2xl text-violet-600 transition group-hover:scale-110 dark:text-violet-400/90">
                    {typeIcon(item.type)}
                  </span>
                  <span className="mt-2 line-clamp-2 text-xs font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                  <span
                    className={`mt-auto rounded-full px-2 py-0.5 text-[10px] capitalize ring-1 ${statusPillClass(item.status)}`}
                  >
                    {ITEM_STATUS_LABELS[item.status] || item.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : view === 'cards' ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((item) => (
              <li
                key={item._id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-md transition hover:border-violet-300 hover:shadow-md dark:border-slate-800/90 dark:from-[#141820] dark:to-[#0d1117] dark:shadow-black/25 dark:hover:border-violet-500/35 dark:hover:shadow-violet-950/10"
              >
                <Link
                  to={`${base}/${item._id}`}
                  className="flex min-h-0 flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent opacity-0 transition group-hover:opacity-100 dark:via-violet-500/25" />
                  <div className="flex flex-1 flex-col p-4 pr-12">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20">
                          {typeIcon(item.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-violet-800 dark:text-white dark:group-hover:text-violet-100">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-500">
                            {ITEM_TYPE_LABELS[item.type] || item.type}
                            {item.platform ? ` · ${item.platform}` : ''}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-medium capitalize ring-1 ${statusPillClass(item.status)}`}
                      >
                        {ITEM_STATUS_LABELS[item.status] || item.status}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-800/80">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                        #{item.orderIndex ?? 0}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                        {item.submissionCount ?? 0} submissions
                      </span>
                    </div>
                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300/95 dark:ring-violet-500/15"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 4 && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-600">
                            +{item.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-200 bg-slate-100/80 px-4 py-2.5 text-[11px] text-violet-700 dark:border-slate-800/80 dark:bg-black/20 dark:text-violet-400/80">
                    <span>Open item</span>
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </div>
                </Link>
                <div className="absolute right-3 top-3 z-10">
                  <ItemQuickMenu
                    journeyId={journeyId}
                    itemId={item._id}
                    itemTitle={item.title}
                    base={base}
                    menuOpen={itemMenuOpen}
                    setMenuOpen={setItemMenuOpen}
                    onAskDelete={setDeleteTarget}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : view === 'detailed' ? (
          <ul className="space-y-4">
            {sorted.map((item) => (
              <li
                key={item._id}
                className="relative rounded-2xl border border-slate-200 bg-white shadow-md transition hover:border-violet-300 dark:border-slate-800/90 dark:bg-gradient-to-br dark:from-[#12151c] dark:to-[#0a0c10] dark:shadow-lg dark:hover:border-violet-500/30 dark:hover:shadow-violet-950/5"
              >
                <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                  <ItemQuickMenu
                    journeyId={journeyId}
                    itemId={item._id}
                    itemTitle={item.title}
                    base={base}
                    menuOpen={itemMenuOpen}
                    setMenuOpen={setItemMenuOpen}
                    onAskDelete={setDeleteTarget}
                  />
                </div>
                <Link
                  to={`${base}/${item._id}`}
                  className="block rounded-2xl p-5 pr-14 sm:p-6 sm:pr-16"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-violet-600 dark:text-violet-400">{typeIcon(item.type)}</span>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {ITEM_TYPE_LABELS[item.type]}
                        </span>
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[10px] ring-1 ${statusPillClass(item.status)}`}
                        >
                          {ITEM_STATUS_LABELS[item.status] || item.status}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-500">
                      <div className="rounded-lg bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800/50">
                        Order #{item.orderIndex ?? 0}
                      </div>
                      <div className="mt-1">Created {formatShort(item.createdAt)}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-[#0d1117] dark:ring-slate-800">
                      <span className="text-slate-500">Submissions</span>
                      <span className="ml-2 font-mono text-slate-800 dark:text-slate-200">
                        {item.submissionCount ?? 0}
                      </span>
                      {item.lastSubmissionAt && (
                        <span className="mt-1 block text-[10px] text-slate-600">
                          Last {formatShort(item.lastSubmissionAt)}
                        </span>
                      )}
                    </div>
                    {(item.platform || item.platformUrl) && (
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-[#0d1117] dark:ring-slate-800">
                        <span className="text-slate-500">Platform</span>
                        <p className="truncate text-slate-800 dark:text-slate-200">{item.platform || '—'}</p>
                        {item.platformDifficulty && (
                          <p className="text-[10px] text-slate-500">
                            Diff: {item.platformDifficulty}
                          </p>
                        )}
                      </div>
                    )}
                    {(item.personalDifficulty || item.platformDifficulty) && (
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-[#0d1117] dark:ring-slate-800">
                        <span className="text-slate-500">Difficulty</span>
                        <p className="text-slate-800 dark:text-slate-200">
                          {item.personalDifficulty || item.platformDifficulty || '—'}
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 dark:bg-[#0d1117] dark:ring-slate-800">
                      <span className="text-slate-500">Resources</span>
                      <span className="ml-2 text-slate-800 dark:text-slate-200">
                        {Array.isArray(item.resources) ? item.resources.length : 0}
                      </span>
                      {item.revisionRequired && (
                        <span className="mt-1 block text-amber-400/90">Revision required</span>
                      )}
                    </div>
                  </div>
                  {(item.tags?.length > 0 || item.flags?.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-violet-100 px-2 py-0.5 text-[10px] text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.flags?.map((fl) => (
                        <span
                          key={fl}
                          className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900 ring-1 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-500/20"
                        >
                          {fl}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800/90 dark:bg-[#0d1117]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-[#16161e] dark:text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Sub</th>
                  <th className="px-4 py-3.5">Platform</th>
                  <th className="px-4 py-3.5">Diff</th>
                  <th className="px-4 py-3.5">Updated</th>
                  <th className="w-12 px-2 py-3.5 text-right"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {sorted.map((item) => (
                  <tr key={item._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <Link
                        to={`${base}/${item._id}`}
                        className="font-medium text-violet-700 hover:text-violet-900 hover:underline dark:text-violet-300 dark:hover:text-violet-200"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {ITEM_TYPE_LABELS[item.type] || item.type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] capitalize ring-1 ${statusPillClass(item.status)}`}
                      >
                        {ITEM_STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-400">
                      {item.submissionCount ?? 0}
                    </td>
                    <td className="max-w-[8rem] truncate px-4 py-3 text-slate-500">
                      {item.platform || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.platformDifficulty || item.personalDifficulty || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatShort(item.updatedAt)}</td>
                    <td className="px-2 py-2 text-right align-middle">
                      <ItemQuickMenu
                        journeyId={journeyId}
                        itemId={item._id}
                        itemTitle={item.title}
                        base={base}
                        menuOpen={itemMenuOpen}
                        setMenuOpen={setItemMenuOpen}
                        onAskDelete={setDeleteTarget}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDeleteItem}
        title="Delete this item?"
        message={
          deleteTarget
            ? `“${deleteTarget.title || 'This item'}” and its submissions will be removed permanently.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
      />
    </section>
  )
}
