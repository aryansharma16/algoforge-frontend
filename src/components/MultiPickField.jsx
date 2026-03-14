import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { mergePicklist, persistUserExtra } from '../utils/itemPicklistStorage'
import { ITEM_LIMITS } from '../constants/learningItem'

/**
 * Chips + searchable list; presets + user-saved + custom add.
 */
export default function MultiPickField({
  label,
  presets,
  storageKey,
  value,
  onChange,
  max = ITEM_LIMITS.tagsMax,
  hint,
  error,
  placeholder = 'Search or add…',
}) {
  const listId = useId()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [bump, setBump] = useState(0)

  const options = useMemo(() => {
    return mergePicklist(presets, storageKey, '')
  }, [presets, storageKey, bump])

  const q = query.trim().toLowerCase()
  const available = options.filter(
    (o) =>
      !value.includes(o) &&
      (!q || o.toLowerCase().includes(q))
  )
  const draft = query.trim().slice(0, ITEM_LIMITS.tagMaxLen)
  const canAddCustom =
    draft &&
    !value.includes(draft) &&
    value.length < max &&
    !options.some((o) => o.toLowerCase() === draft.toLowerCase())

  function addOne(s) {
    const t = String(s).trim().slice(0, ITEM_LIMITS.tagMaxLen)
    if (!t || value.includes(t) || value.length >= max) return
    persistUserExtra(storageKey, t)
    onChange([...value, t])
    setBump((b) => b + 1)
    setQuery('')
  }

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const rows = [
    ...(canAddCustom ? [{ kind: 'add', label: `Add "${draft}"` }] : []),
    ...available.slice(0, 40).map((o) => ({ kind: 'opt', o })),
  ]

  return (
    <div ref={wrapRef}>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <div className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs text-violet-900 ring-1 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-200 dark:ring-violet-500/25"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== tag))}
                className="text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-white"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            id={listId}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (canAddCustom) addOne(draft)
                else if (available[0]) addOne(available[0])
              }
            }}
            placeholder={placeholder}
            disabled={value.length >= max}
            className="w-full border-0 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-600"
          />
          {open && rows.length > 0 && value.length < max && (
            <ul className="scrollbar-themed absolute z-20 mt-1 max-h-48 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-900">
              {rows.map((row, i) => (
                <li
                  key={row.kind === 'add' ? '__add' : row.o}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    row.kind === 'add' ? addOne(draft) : addOne(row.o)
                  }
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    row.kind === 'add'
                      ? 'text-violet-700 dark:text-violet-300'
                      : 'text-slate-800 dark:text-slate-200'
                  } hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  {row.kind === 'add' ? row.label : row.o}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-1 text-[10px] text-slate-600">
          {value.length}/{max} · Pick from list or add your own (saved for next time)
        </p>
      </div>
      {hint && <p className="mt-1 text-[10px] text-slate-600">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
