import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const options = [
  { id: 'system', label: 'System', hint: 'Match device' },
  { id: 'light', label: 'Light', hint: 'Always light' },
  { id: 'dark', label: 'Dark', hint: 'Always dark' },
]

export default function Settings() {
  const { preference, setPreference, resolved } = useTheme()

  return (
    <div className="mx-auto max-w-2xl space-y-10 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Appearance and account shortcuts
        </p>
      </div>

      {/* Theme — above profile */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          Appearance
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Theme applies across the signed-in app. System follows your OS light/dark
          mode.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setPreference(o.id)}
              className={`flex flex-col rounded-xl border px-4 py-4 text-left transition ${
                preference === o.id
                  ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/30 dark:border-violet-500 dark:bg-violet-950/40 dark:ring-violet-500/20'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
              }`}
            >
              <span className="font-semibold text-slate-900 dark:text-white">
                {o.label}
              </span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {o.hint}
              </span>
              {preference === o.id && o.id === 'system' && (
                <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-violet-600 dark:text-violet-300">
                  Now: {resolved}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Profile */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Profile
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Edit display name, bio, location, work, education, and social links.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-900/20 hover:bg-violet-500 dark:shadow-violet-950/40"
        >
          Open profile editor →
        </Link>
      </section>
    </div>
  )
}
