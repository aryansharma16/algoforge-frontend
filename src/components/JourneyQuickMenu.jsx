import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function JourneyQuickMenu({
  journeyId,
  journeyTitle,
  menuOpen,
  setMenuOpen,
  onAskDelete,
}) {
  const open = menuOpen === journeyId
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
        aria-label="Journey actions"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setMenuOpen(open ? null : journeyId)
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <span className="text-lg leading-none">⋮</span>
      </button>
      {open && (
        <ul
          className="absolute right-0 top-full z-30 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-600 dark:bg-[#16161e]"
          onClick={(e) => e.stopPropagation()}
        >
          <li>
            <Link
              to={`/journeys/${journeyId}`}
              className="block px-3 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen(null)}
            >
              View
            </Link>
          </li>
          <li>
            <Link
              to={`/journeys/${journeyId}/edit`}
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
                onAskDelete({ _id: journeyId, title: journeyTitle })
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
