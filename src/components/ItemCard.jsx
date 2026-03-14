import { Link } from 'react-router-dom'

export default function ItemCard({ item, journeyId }) {
  if (!item?._id || !journeyId) return null
  return (
    <Link
      to={`/journeys/${journeyId}/items/${item._id}`}
      className="block rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-violet-500/40 transition-colors"
    >
      <h3 className="font-medium text-white">{item.title || 'Item'}</h3>
      {item.status && (
        <p className="mt-1 text-xs text-slate-500 capitalize">{item.status}</p>
      )}
      {item.type && (
        <span className="mt-2 inline-block text-xs text-violet-400/80">
          {item.type}
        </span>
      )}
    </Link>
  )
}
