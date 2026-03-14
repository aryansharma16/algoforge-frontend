import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useGetJourneyByIdQuery,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
} from '../api/journeyApi'
import JourneyForm from '../features/journeys/JourneyForm'
import {
  journeyToForm,
  emptyErrors,
  validateForm,
  buildJourneyPayload,
  mapJourneyServerErrors,
} from '../features/journeys/journeyFormState'
import { toast, apiErrorMessage } from '../utils/toast'

function EditJourneyForm({ journey, journeyId }) {
  const navigate = useNavigate()
  const [updateJourney, { isLoading: saving }] = useUpdateJourneyMutation()
  const [form, setForm] = useState(() => journeyToForm(journey))
  const [errors, setErrors] = useState(emptyErrors)

  const setField = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '', _form: '' }))
  }, [])

  async function onSubmit(ev) {
    ev.preventDefault()
    const { ok, errors: nextErrors, metadata } = validateForm(form)
    if (!ok) {
      setErrors(nextErrors)
      return
    }
    try {
      await updateJourney({
        id: journeyId,
        ...buildJourneyPayload(form, metadata),
      }).unwrap()
      toast.success('Journey updated')
      navigate(`/journeys/${journeyId}`, { replace: true })
    } catch (err) {
      setErrors(mapJourneyServerErrors(err))
      toast.error('Could not save', { description: apiErrorMessage(err) })
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-800/80 bg-slate-950/30 p-5 shadow-xl sm:p-8"
    >
      <JourneyForm
        form={form}
        errors={errors}
        setField={setField}
        idPrefix="edit"
      />
      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-6">
        <Link
          to={`/journeys/${journeyId}`}
          className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

export default function EditJourney() {
  const { journeyId } = useParams()
  const { data: journey, isLoading, isError } = useGetJourneyByIdQuery(journeyId)

  if (isLoading) {
    return <p className="text-slate-400">Loading journey…</p>
  }
  if (isError || !journey) {
    return (
      <div>
        <p className="text-red-400">Journey not found.</p>
        <Link
          to="/journeys"
          className="mt-4 inline-block text-violet-400 hover:underline"
        >
          ← Back to journeys
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/journeys" className="text-violet-400 hover:underline">
              Journeys
            </Link>
          </li>
          <li aria-hidden className="text-slate-600">
            /
          </li>
          <li>
            <Link
              to={`/journeys/${journeyId}`}
              className="max-w-[12rem] truncate text-violet-400 hover:underline sm:max-w-none"
            >
              {journey.title || 'Journey'}
            </Link>
          </li>
          <li aria-hidden className="text-slate-600">
            /
          </li>
          <li className="text-slate-300">Edit</li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-slate-800/80 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Edit journey
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Searchable fields, calendar dates, and focus tags. Save sends everything to your
          backend schema.
        </p>
      </header>

      <EditJourneyForm key={journey._id} journey={journey} journeyId={journeyId} />

      <DeleteJourneySection journeyId={journeyId} title={journey.title} />
    </div>
  )
}

function DeleteJourneySection({ journeyId, title }) {
  const navigate = useNavigate()
  const [deleteJourney, { isLoading }] = useDeleteJourneyMutation()

  async function onDelete() {
    if (
      !confirm(
        `Delete “${title || 'this journey'}”? This cannot be undone.`
      )
    )
      return
    try {
      await deleteJourney(journeyId).unwrap()
      toast.success('Journey deleted')
      navigate('/journeys', { replace: true })
    } catch (err) {
      toast.error('Could not delete journey', { description: apiErrorMessage(err) })
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-red-900/40 bg-red-950/20 p-6">
      <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
      <p className="mt-1 text-xs text-slate-500">
        Permanently remove this journey and its items from your account.
      </p>
      <button
        type="button"
        disabled={isLoading}
        onClick={onDelete}
        className="mt-4 rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900/50 disabled:opacity-50"
      >
        {isLoading ? 'Deleting…' : 'Delete journey'}
      </button>
    </section>
  )
}
