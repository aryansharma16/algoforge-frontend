import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateJourneyMutation } from '../api/journeyApi'
import JourneyForm from '../features/journeys/JourneyForm'
import {
  initialForm,
  emptyErrors,
  validateForm,
  buildJourneyPayload,
  mapJourneyServerErrors,
} from '../features/journeys/journeyFormState'
import { toast, apiErrorMessage } from '../utils/toast'

export default function CreateJourney() {
  const [createJourney, { isLoading }] = useCreateJourneyMutation()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(emptyErrors)
  const [createdJourney, setCreatedJourney] = useState(null)

  const setField = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '', _form: '' }))
  }, [])

  async function onSubmit(ev) {
    ev.preventDefault()
    const { ok, errors: nextErrors, metadata } = validateForm(form)
    if (!ok) {
      setErrors(nextErrors)
      toast.error('Please fix the errors below.')
      return
    }
    try {
      const row = await createJourney(buildJourneyPayload(form, metadata)).unwrap()
      toast.success('Journey created')
      setCreatedJourney(row)
    } catch (err) {
      setErrors(mapJourneyServerErrors(err))
      toast.error('Could not create journey', {
        description: apiErrorMessage(err, 'Check fields or try again.'),
      })
    }
  }

  if (createdJourney) {
    return (
      <div className="mx-auto max-w-4xl pb-16">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/journeys" className="text-violet-400 hover:underline">
                Journeys
              </Link>
            </li>
            <li aria-hidden className="text-slate-600">/</li>
            <li className="text-slate-300">New journey</li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-950/30 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <p className="text-4xl font-medium text-emerald-500 dark:text-emerald-400" aria-hidden>
              ✓
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Thank you!
            </h1>
            <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
              Your journey &quot;{createdJourney.title}&quot; was created. Open it to add
              items and log submissions.
            </p>
            <Link
              to={`/journeys/${createdJourney._id}`}
              className="mt-6 inline-flex rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500"
            >
              Go to journey
            </Link>

            <div className="mt-10 w-full max-w-lg rounded-xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-slate-700/80 dark:bg-slate-900/50">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400/90">
                How to use AlgoForge
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <strong className="text-slate-800 dark:text-slate-300">Journeys</strong> — Organize
                  your learning (e.g. DSA, system design). Add items (problems,
                  topics) to each journey.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-300">Items</strong> — Each item
                  can have multiple submissions. Log your solution, time/space
                  complexity, notes, and code.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-300">Profile</strong> — Update
                  your profile from the sidebar to share skills and links.
                </li>
              </ul>
            </div>
          </div>
        </div>
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
          <li className="text-slate-300">New journey</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Create journey
        </h1>
        <p className="mt-2 text-slate-400">
          Define your learning path. You can change everything later from journey
          settings.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-800/80 bg-slate-950/30 p-5 shadow-xl sm:p-8"
      >
        <JourneyForm
          form={form}
          errors={errors}
          setField={setField}
          idPrefix="create"
        />
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-6">
          <Link
            to="/journeys"
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating…' : 'Create journey'}
          </button>
        </div>
      </form>
    </div>
  )
}
