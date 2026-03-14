import { useCallback, useState } from 'react'

export default function SkillChipsInput({ skills, onChange, placeholder = 'Add skill…' }) {
  const [draft, setDraft] = useState('')

  const add = useCallback(
    (raw) => {
      const t = raw.trim()
      if (!t) return
      if (skills.some((s) => s.toLowerCase() === t.toLowerCase())) {
        setDraft('')
        return
      }
      onChange([...skills, t])
      setDraft('')
    },
    [skills, onChange]
  )

  function remove(idx) {
    onChange(skills.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
        Skills
      </label>
      <div className="flex min-h-[48px] flex-wrap gap-2 rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950/80">
        {skills.map((skill, idx) => (
          <span
            key={`${skill}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-100 pl-3 pr-1 py-1 text-xs font-medium text-violet-900 dark:border-violet-500/30 dark:bg-violet-950/50 dark:text-violet-200"
          >
            {skill}
            <button
              type="button"
              onClick={() => remove(idx)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-300"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(draft)
            }
            if (e.key === ',' && draft.trim()) {
              e.preventDefault()
              add(draft.replace(/,$/, ''))
            }
            if (e.key === 'Backspace' && !draft && skills.length)
              onChange(skills.slice(0, -1))
          }}
          onBlur={() => draft.trim() && add(draft)}
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-2 py-1 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 dark:text-slate-200 dark:placeholder:text-slate-600"
          placeholder={skills.length ? '' : placeholder}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-600">Enter or comma to add · × to remove</p>
    </div>
  )
}
