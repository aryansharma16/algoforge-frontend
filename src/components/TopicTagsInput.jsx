import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { CS_TOPIC_OPTIONS, CS_TOPIC_LABEL } from '../constants/csTopics'

const MAX_TAGS = 24

/**
 * Searchable multi-select → string[] of topic ids (stored in metadata.topicTags).
 */
export default function TopicTagsInput({
  value = [],
  onChange,
  error,
  disabled,
  idPrefix = 'topics',
}) {
  const listId = useId()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = new Set(value)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CS_TOPIC_OPTIONS.filter(
      (o) =>
        !selected.has(o.id) &&
        (o.label.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.group.toLowerCase().includes(q))
    ).slice(0, 40)
  }, [query, value])

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function add(id) {
    if (value.length >= MAX_TAGS) return
    onChange([...value, id])
    setQuery('')
    inputRef.current?.focus()
  }

  function remove(id) {
    onChange(value.filter((x) => x !== id))
  }

  return (
    <div ref={wrapRef} className="space-y-2">
      <label className="block text-xs text-slate-600 dark:text-slate-500">
        Focus tags <span className="text-slate-500 dark:text-slate-600">(search CS topics)</span>
      </label>
      <div
        className={`min-h-[2.75rem] rounded-lg border bg-white px-2 py-1.5 dark:bg-slate-950 ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        <div className="flex flex-wrap gap-1.5">
          {value.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs text-violet-800 ring-1 ring-violet-200 dark:bg-violet-950/80 dark:text-violet-200 dark:ring-violet-500/30"
            >
              {CS_TOPIC_LABEL[id] || id}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="rounded p-0.5 text-violet-600 hover:bg-violet-200 hover:text-violet-900 dark:text-violet-400 dark:hover:bg-violet-900/50 dark:hover:text-white"
                  aria-label={`Remove ${id}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {!disabled && value.length < MAX_TAGS && (
            <input
              ref={inputRef}
              id={`${idPrefix}-topic-search`}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              placeholder={value.length ? 'Add topic…' : 'Search DSA, system design…'}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false)
                if (e.key === 'Enter' && filtered.length === 1) {
                  e.preventDefault()
                  add(filtered[0].id)
                }
              }}
              className="min-w-[8rem] flex-1 border-0 bg-transparent py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-600"
            />
          )}
        </div>
      </div>
      {open && filtered.length > 0 && !disabled && (
        <ul
          id={listId}
          className="scrollbar-themed max-h-52 overflow-y-auto overflow-x-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-900"
        >
          {filtered.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(o.id)}
              >
                <span>{o.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  {o.group}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query && filtered.length === 0 && (
        <p className="text-xs text-slate-500">No matching topics.</p>
      )}
      <p className="text-[10px] text-slate-500 dark:text-slate-600">
        {value.length}/{MAX_TAGS} tags · Stored with your journey
      </p>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
