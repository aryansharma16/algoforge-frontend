import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { mergePicklist, persistUserExtra } from '../utils/itemPicklistStorage'

/**
 * Searchable single value; pick from list or add custom (saved to storageKey for reuse).
 * Value always editable when focused (type to replace).
 */
export default function SearchableCreatableSelect({
  id,
  label,
  presets,
  storageKey,
  value,
  onChange,
  maxLength = 100,
  error,
  placeholder = 'Search or type new…',
  hint,
  disabled,
}) {
  const listId = useId()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [bump, setBump] = useState(0)

  const options = useMemo(
    () => mergePicklist(presets, storageKey, value),
    [presets, storageKey, value, bump]
  )

  const q = query.trim()
  const filtered = options
    .filter((opt) => opt.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 50)
  const exact = q && options.some((o) => o.toLowerCase() === q.toLowerCase())
  const showCreate = q.length > 0 && !exact && q.length <= maxLength

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function pick(opt) {
    onChange(opt.slice(0, maxLength))
    setOpen(false)
    setQuery('')
  }

  function useCustom() {
    const v = q.slice(0, maxLength)
    if (!v) return
    persistUserExtra(storageKey, v)
    onChange(v)
    setBump((b) => b + 1)
    setOpen(false)
    setQuery('')
  }

  const display = open ? query : value || ''
  const listRows = showCreate
    ? [{ kind: 'create', label: `Use "${q}"` }, ...filtered.map((o) => ({ kind: 'opt', o }))]
    : filtered.map((o) => ({ kind: 'opt', o }))

  const [highlight, setHighlight] = useState(0)
  useEffect(() => {
    setHighlight(0)
  }, [q, open, bump])

  return (
    <div ref={wrapRef} className="relative">
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs text-slate-500">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={value && !open ? value : placeholder}
        value={display}
        onChange={(e) => {
          const v = e.target.value
          setQuery(v)
          onChange(v)
          if (!open) setOpen(true)
        }}
        onFocus={() => {
          setOpen(true)
          setQuery(value || '')
        }}
        onBlur={() => {
          /* delay close so click on option works */
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
          }
          if (e.key === 'Enter' && open && listRows.length) {
            e.preventDefault()
            const row = listRows[highlight]
            if (row?.kind === 'create') useCustom()
            else if (row?.kind === 'opt') pick(row.o)
          }
          if (e.key === 'ArrowDown' && listRows.length) {
            e.preventDefault()
            setHighlight((h) => Math.min(h + 1, listRows.length - 1))
          }
          if (e.key === 'ArrowUp' && listRows.length) {
            e.preventDefault()
            setHighlight((h) => Math.max(h - 1, 0))
          }
        }}
        className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 ${
          error ? 'border-red-500' : 'border-slate-700'
        }`}
      />
      {open && (listRows.length > 0 || showCreate) && (
        <ul
          id={listId}
          className="scrollbar-themed absolute z-20 mt-1 max-h-56 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-slate-600 bg-slate-900 py-1 shadow-xl"
        >
          {listRows.map((row, i) => (
            <li
              key={row.kind === 'create' ? '__create' : row.o}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                row.kind === 'create' ? useCustom() : pick(row.o)
              }
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === highlight ? 'bg-slate-800 text-white' : 'text-slate-200'
              } ${row.kind === 'create' ? 'border-b border-slate-800 text-violet-300' : ''}`}
            >
              {row.kind === 'create' ? row.label : row.o}
            </li>
          ))}
        </ul>
      )}
      {hint && <p className="mt-1 text-[10px] text-slate-600">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
