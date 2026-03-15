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
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'

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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800/80 dark:bg-slate-950/30 dark:shadow-xl sm:p-8"
    >
      <JourneyForm
        form={form}
        errors={errors}
        setField={setField}
        idPrefix="edit"
      />
      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
        <Link
          to={`/journeys/${journeyId}`}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving && <Spinner size="sm" className="shrink-0" />}
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
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/80" />
      </div>
    )
  }
  if (isError || !journey) {
    return (
      <div>
        <p className="text-red-600 dark:text-red-400">Journey not found.</p>
        <Link
          to="/journeys"
          className="mt-4 inline-block text-violet-600 hover:underline dark:text-violet-400"
        >
          ← Back to journeys
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <nav className="mb-6 text-sm text-slate-600 dark:text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/journeys" className="text-violet-600 hover:underline dark:text-violet-400">
              Journeys
            </Link>
          </li>
          <li aria-hidden className="text-slate-400 dark:text-slate-600">
            /
          </li>
          <li>
            <Link
              to={`/journeys/${journeyId}`}
              className="max-w-[12rem] truncate text-violet-600 hover:underline dark:text-violet-400 sm:max-w-none"
            >
              {journey.title || 'Journey'}
            </Link>
          </li>
          <li aria-hidden className="text-slate-400 dark:text-slate-600">
            /
          </li>
          <li className="font-medium text-slate-700 dark:font-normal dark:text-slate-300">Edit</li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800/80">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Edit journey
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
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
  const [open, setOpen] = useState(false)

  async function onDelete() {
    try {
      await deleteJourney(journeyId).unwrap()
      toast.success('Journey deleted')
      setOpen(false)
      navigate('/journeys', { replace: true })
    } catch (err) {
      toast.error('Could not delete journey', { description: apiErrorMessage(err) })
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-red-200 bg-red-50/80 p-6 dark:border-red-900/40 dark:bg-red-950/20">
      <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Danger zone</h2>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">
        Permanently remove this journey and its items from your account.
      </p>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 dark:hover:bg-red-900/50"
      >
        Delete journey
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => !isLoading && setOpen(false)}
        onConfirm={onDelete}
        title="Delete this journey?"
        message={`“${title || 'This journey'}”, all its items, and related data will be removed permanently.`}
        confirmLabel="Delete journey"
        cancelLabel="Cancel"
        variant="danger"
        loading={isLoading}
      />
    </section>
  )
}
