import { useEffect, useId, useRef, useState } from 'react'

/**
 * Searchable single-select: type to filter, click or Enter to choose.
 */
export default function SearchableSelect({
  id,
  label,
  options,
  value,
  onChange,
  getLabel = (v) => String(v),
  error,
  placeholder = 'Search or select…',
  disabled,
  className = '',
}) {
  const listId = useId()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)

  const selectedLabel = value != null && value !== '' ? getLabel(value) : ''
  const filtered = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(query.trim().toLowerCase())
  )

  useEffect(() => {
    setHighlight(0)
  }, [query, open])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function pick(opt) {
    onChange(opt)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs text-slate-500 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          placeholder={open ? placeholder : selectedLabel || placeholder}
          value={open ? query : selectedLabel}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
              inputRef.current?.blur()
            }
            if (e.key === 'ArrowDown' && filtered.length) {
              e.preventDefault()
              setOpen(true)
              setHighlight((h) => Math.min(h + 1, filtered.length - 1))
            }
            if (e.key === 'ArrowUp' && filtered.length) {
              e.preventDefault()
              setHighlight((h) => Math.max(h - 1, 0))
            }
            if (e.key === 'Enter' && filtered.length) {
              e.preventDefault()
              pick(filtered[highlight] ?? filtered[0])
            }
          }}
          className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-600 ${
            error ? 'border-red-500' : 'border-slate-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {open && filtered.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="scrollbar-themed absolute z-10 mt-1 max-h-52 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-slate-600 bg-slate-900 py-1 shadow-lg"
          >
            {filtered.map((opt, i) => (
              <li
                key={String(opt)}
                role="option"
                aria-selected={opt === value}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-slate-800 ${
                  i === highlight
                    ? 'bg-slate-800 text-white'
                    : opt === value
                      ? 'bg-violet-900/40 text-violet-200'
                      : 'text-slate-200'
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(opt)}
              >
                {getLabel(opt)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
