import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [createJourney, { isLoading }] = useCreateJourneyMutation()
  const [form, setForm] = useState(initialForm)
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
      const row = await createJourney(buildJourneyPayload(form, metadata)).unwrap()
      toast.success('Journey created', { description: row.title || 'Opening your new journey…' })
      navigate(`/journeys/${row._id}`, { replace: true })
    } catch (err) {
      setErrors(mapJourneyServerErrors(err))
      toast.error('Could not create journey', {
        description: apiErrorMessage(err, 'Check fields or try again.'),
      })
    }
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
