import { Link } from 'react-router-dom'
import { useGetJourneysQuery } from '../api/journeyApi'
import JourneyCard from '../components/JourneyCard'

export default function Journeys() {
  const { data, isLoading, isError, error } = useGetJourneysQuery()

  if (isLoading) {
    return <p className="text-slate-400">Loading journeys…</p>
  }
  if (isError) {
    return (
      <p className="text-red-400">
        {error?.data?.message || 'Could not load journeys'}
      </p>
    )
  }

  const list = Array.isArray(data) ? data : []

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Journeys
          </h1>
          <p className="mt-2 text-slate-400">
            Learning paths you own. Create a journey, then add items and track
            progress.
          </p>
        </div>
        <Link
          to="/journeys/new"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          New journey
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-8 py-16 text-center">
          <p className="text-slate-400">No journeys yet.</p>
          <Link
            to="/journeys/new"
            className="mt-4 inline-block text-sm font-medium text-violet-400 hover:underline"
          >
            Create your first journey →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((j) => (
            <li key={j._id}>
              <JourneyCard journey={j} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
