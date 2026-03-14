export default function SubmissionCard({ submission }) {
  if (!submission) return null
  const label =
    submission.notes?.slice(0, 80) ||
    submission.result ||
    submission._id ||
    'Submission'
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
      <p className="text-slate-200">{label}</p>
      {submission.createdAt && (
        <p className="mt-1 text-xs text-slate-500">
          {new Date(submission.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}
