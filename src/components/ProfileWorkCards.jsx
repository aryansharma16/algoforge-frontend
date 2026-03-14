const empty = () => ({
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
})

const inp =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500'

export default function ProfileWorkCards({ items, onChange }) {
  const list = items.length ? items : [empty()]

  function update(idx, key, value) {
    onChange(
      list.map((row, i) => {
        if (i !== idx) return row
        const u = { ...row, [key]: value }
        if (key === 'current' && value) u.endDate = ''
        return u
      })
    )
  }

  function add() {
    onChange([...list, empty()])
  }

  function remove(idx) {
    if (list.length <= 1) onChange([empty()])
    else onChange(list.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Work experience</h3>
          <p className="text-xs text-slate-500">One card per role · add as many as you need</p>
        </div>
      </div>
      <div className="space-y-4">
        {list.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 shadow-lg sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="rounded-lg bg-violet-600/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                Role {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove card
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Company</label>
                <input
                  value={row.company}
                  onChange={(e) => update(idx, 'company', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Role</label>
                <input
                  value={row.role}
                  onChange={(e) => update(idx, 'role', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Start date</label>
                <input
                  type="date"
                  value={row.startDate}
                  onChange={(e) => update(idx, 'startDate', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">End date</label>
                <input
                  type="date"
                  value={row.endDate}
                  onChange={(e) => update(idx, 'endDate', e.target.value)}
                  disabled={row.current}
                  className={`${inp} disabled:opacity-40`}
                />
              </div>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={row.current}
                onChange={(e) => update(idx, 'current', e.target.checked)}
                className="rounded border-slate-600 bg-slate-900 text-violet-600"
              />
              I currently work here
            </label>
            <div className="mt-3">
              <label className="mb-1 block text-xs text-slate-500">Description</label>
              <textarea
                rows={2}
                value={row.description}
                onChange={(e) => update(idx, 'description', e.target.value)}
                className={inp}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border border-dashed border-violet-500/40 bg-violet-950/20 py-3 text-sm font-medium text-violet-300 hover:bg-violet-950/40"
      >
        + Add work experience
      </button>
    </div>
  )
}
