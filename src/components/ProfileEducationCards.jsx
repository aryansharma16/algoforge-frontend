const empty = () => ({
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  description: '',
})

const inp =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600'

export default function ProfileEducationCards({ items, onChange }) {
  const list = items.length ? items : [empty()]

  function update(idx, key, value) {
    onChange(list.map((row, i) => (i === idx ? { ...row, [key]: value } : row)))
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
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Education</h3>
          <p className="text-xs text-slate-500">One card per school · add more anytime</p>
        </div>
      </div>
      <div className="space-y-4">
        {list.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 dark:shadow-lg sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
              <span className="rounded-lg bg-fuchsia-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 dark:bg-fuchsia-600/20 dark:text-fuchsia-300">
                Education {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove card
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Institution</label>
              <input
                value={row.institution}
                onChange={(e) => update(idx, 'institution', e.target.value)}
                className={inp}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Degree</label>
                <input
                  value={row.degree}
                  onChange={(e) => update(idx, 'degree', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Field</label>
                <input
                  value={row.field}
                  onChange={(e) => update(idx, 'field', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
            <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Start year</label>
                <input
                  type="number"
                  value={row.startYear}
                  onChange={(e) => update(idx, 'startYear', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">End year</label>
                <input
                  type="number"
                  value={row.endYear}
                  onChange={(e) => update(idx, 'endYear', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
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
        className="w-full rounded-xl border-2 border-dashed border-fuchsia-600 bg-fuchsia-50 py-3 text-sm font-semibold text-fuchsia-950 shadow-sm hover:bg-fuchsia-100 dark:border-fuchsia-500/40 dark:bg-fuchsia-950/20 dark:font-medium dark:text-fuchsia-200 dark:shadow-none dark:hover:bg-fuchsia-950/40"
      >
        + Add education
      </button>
    </div>
  )
}
