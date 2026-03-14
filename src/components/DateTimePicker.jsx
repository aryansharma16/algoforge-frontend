import { useEffect, useId, useMemo, useRef, useState } from 'react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function parseLocal(str) {
  if (!str || typeof str !== 'string') return null
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? null : d
}

function toLocalParts(d) {
  return {
    y: d.getFullYear(),
    m: d.getMonth(),
    day: d.getDate(),
    h: d.getHours(),
    min: d.getMinutes(),
  }
}

function fromParts(y, m, day, h, min) {
  const d = new Date(y, m, day, h, min, 0, 0)
  return d
}

function toDatetimeLocalValue(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** First weekday (0=Sun) of month grid */
function calendarCells(year, month) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const lastDay = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= lastDay; d++) cells.push(d)
  return cells
}

/**
 * Minimal calendar + time — outputs same string shape as datetime-local for form state.
 */
export default function DateTimePicker({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  className = '',
}) {
  const genId = useId()
  const btnId = id || genId
  const popRef = useRef(null)
  const [open, setOpen] = useState(false)
  const d0 = parseLocal(value) || new Date()
  const [cursor, setCursor] = useState(() => ({
    y: d0.getFullYear(),
    m: d0.getMonth(),
  }))

  const display = useMemo(() => {
    const d = parseLocal(value)
    if (!d) return 'Pick date & time'
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }, [value])

  const parts = parseLocal(value) ? toLocalParts(parseLocal(value)) : toLocalParts(d0)

  useEffect(() => {
    function onDoc(e) {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function applyDay(day) {
    const d = fromParts(cursor.y, cursor.m, day, parts.h, parts.min)
    onChange(toDatetimeLocalValue(d))
  }

  function applyTime(h, min) {
    const base = parseLocal(value) || fromParts(cursor.y, cursor.m, 1, 12, 0)
    const p = toLocalParts(base)
    const d = fromParts(p.y, p.m, p.day, h, min)
    onChange(toDatetimeLocalValue(d))
  }

  function clear() {
    onChange('')
    setOpen(false)
  }

  const cells = calendarCells(cursor.y, cursor.m)

  return (
    <div className={`relative ${className}`} ref={popRef}>
      {label && (
        <label htmlFor={btnId} className="mb-1 block text-xs text-slate-500">
          {label}
        </label>
      )}
      <button
        type="button"
        id={btnId}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-slate-950 px-3 py-2 text-left text-sm text-slate-100 ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-slate-600'}`}
      >
        <span className={value ? '' : 'text-slate-500'}>{display}</span>
        <span className="text-slate-500" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-[min(100%,20rem)] rounded-xl border border-slate-600 bg-slate-900 p-3 shadow-xl ring-1 ring-violet-500/10">
          <div className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={() =>
                setCursor((c) =>
                  c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }
                )
              }
            >
              ‹
            </button>
            <span className="text-sm font-medium text-slate-200">
              {MONTHS[cursor.m]} {cursor.y}
            </span>
            <button
              type="button"
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={() =>
                setCursor((c) =>
                  c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }
                )
              }
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-slate-500">
            {DAYS.map((x) => (
              <div key={x} className="py-1">
                {x}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) =>
              day == null ? (
                <div key={`e-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => applyDay(day)}
                  className={`rounded-md py-1.5 text-xs transition ${
                    value &&
                    parseLocal(value) &&
                    parseLocal(value).getDate() === day &&
                    parseLocal(value).getMonth() === cursor.m &&
                    parseLocal(value).getFullYear() === cursor.y
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
            <label className="sr-only">Time</label>
            <input
              type="time"
              value={`${String(parts.h).padStart(2, '0')}:${String(parts.min).padStart(2, '0')}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number)
                applyTime(h || 0, m || 0)
              }}
              className="flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
            />
            <button
              type="button"
              onClick={clear}
              className="shrink-0 rounded px-2 py-1 text-xs text-slate-500 hover:text-red-400"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
