import { Link } from 'react-router-dom'

export default function JourneyCard({ journey }) {
  if (!journey?._id) return null
  return (
    <Link
      to={`/journeys/${journey._id}`}
      className="block rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-violet-500/40 transition-colors h-full"
    >
      <h3 className="font-medium text-white">{journey.title || 'Untitled'}</h3>
      {journey.status && (
        <p className="mt-1 text-xs text-slate-500 capitalize">{journey.status}</p>
      )}
      {journey.description && (
        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
          {journey.description}
        </p>
      )}
    </Link>
  )
}
