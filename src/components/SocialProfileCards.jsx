import {
  SOCIAL_PROFILE_TYPES,
  MAX_SOCIAL_PROFILES,
} from '../constants/socialProfiles'

const empty = () => ({
  type: 'github',
  url: '',
  label: '',
})

const inp =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500'
const sel = `${inp} cursor-pointer`

export default function SocialProfileCards({ items, onChange }) {
  const list = items.length ? items : [empty()]

  function update(idx, key, value) {
    onChange(
      list.map((row, i) =>
        i === idx
          ? {
              ...row,
              [key]: key === 'type' ? String(value).toLowerCase().slice(0, 32) : value,
            }
          : row
      )
    )
  }

  function add() {
    if (list.length >= MAX_SOCIAL_PROFILES) return
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
          <h3 className="text-sm font-semibold text-slate-200">Social & coding profiles</h3>
          <p className="text-xs text-slate-500">
            LinkedIn, GitHub, LeetCode, etc. · max {MAX_SOCIAL_PROFILES}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {list.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-cyan-900/40 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
                Link {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Type</label>
                <select
                  value={row.type || 'other'}
                  onChange={(e) => update(idx, 'type', e.target.value)}
                  className={sel}
                >
                  {SOCIAL_PROFILE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Label (optional)
                </label>
                <input
                  value={row.label}
                  onChange={(e) => update(idx, 'label', e.target.value.slice(0, 80))}
                  className={inp}
                  placeholder="e.g. Main portfolio"
                  maxLength={80}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs text-slate-500">URL</label>
              <input
                type="url"
                value={row.url}
                onChange={(e) => update(idx, 'url', e.target.value.slice(0, 2000))}
                className={`font-mono text-xs ${inp}`}
                placeholder="https://…"
                maxLength={2000}
              />
            </div>
          </div>
        ))}
      </div>
      {list.length < MAX_SOCIAL_PROFILES && (
        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-950/40"
        >
          + Add profile link
        </button>
      )}
    </div>
  )
}
