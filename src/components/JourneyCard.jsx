import { Link } from 'react-router-dom'

export default function JourneyCard({ journey }) {
  if (!journey?._id) return null
  return (
    <Link
      to={`/journeys/${journey._id}`}
      className="block h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-violet-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-violet-500/40"
    >
      <h3 className="font-semibold text-slate-900 dark:text-white">
        {journey.title || 'Untitled'}
      </h3>
      {journey.status && (
        <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-500">
          {journey.status}
        </p>
      )}
      {journey.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {journey.description}
        </p>
      )}
    </Link>
  )
}
