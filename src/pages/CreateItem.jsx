import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetJourneyByIdQuery } from '../api/journeyApi'
import { useCreateItemMutation } from '../api/itemApi'
import ItemForm from '../features/items/ItemForm'
import {
  initialForm,
  emptyErrors,
  validateForm,
  buildItemPayload,
  mapItemServerErrors,
} from '../features/items/itemFormState'
import { toast, apiErrorMessage } from '../utils/toast'

export default function CreateItem() {
  const { journeyId } = useParams()
  const navigate = useNavigate()
  const { data: journey, isLoading: jLoad, isError: jErr } =
    useGetJourneyByIdQuery(journeyId)
  const [createItem, { isLoading }] = useCreateItemMutation()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(emptyErrors)

  const setField = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '', _form: '' }))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    const { ok, errors: next, tags, flags, resources } = validateForm(form)
    if (!ok) {
      setErrors(next)
      return
    }
    try {
      const row = await createItem({
        journeyId,
        ...buildItemPayload(form, tags, flags, resources),
      }).unwrap()
      toast.success('Item created')
      navigate(`/journeys/${journeyId}/items/${row._id}`, { replace: true })
    } catch (err) {
      setErrors(mapItemServerErrors(err))
      toast.error('Could not create item', { description: apiErrorMessage(err) })
    }
  }

  if (jLoad)
    return <p className="text-slate-600 dark:text-slate-400">Loading journey…</p>
  if (jErr || !journey) {
    return (
      <div className="text-red-400">
        Journey not found.
        <Link to="/journeys" className="mt-2 block text-violet-400 hover:underline">
          ← Journeys
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <nav
        className="mb-6 text-sm text-slate-600 dark:text-slate-500"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              to="/journeys"
              className="text-violet-600 hover:underline dark:text-violet-400"
            >
              Journeys
            </Link>
          </li>
          <li className="text-slate-500 dark:text-slate-600">/</li>
          <li>
            <Link
              to={`/journeys/${journeyId}`}
              className="max-w-[10rem] truncate text-violet-600 hover:underline dark:text-violet-400 sm:max-w-none"
            >
              {journey.title || 'Journey'}
            </Link>
          </li>
          <li className="text-slate-500 dark:text-slate-600">/</li>
          <li className="text-slate-700 dark:text-slate-300">New item</li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800/80">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400/80">
          Learning item
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Create item
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
          Full schema: type, status, platform, tags, resources, notes. Edit anytime later.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800/80 dark:bg-slate-950/20 sm:p-8"
      >
        <ItemForm form={form} errors={errors} setField={setField} idPrefix="create-item" />
        <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Link
            to={`/journeys/${journeyId}`}
            className="rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating…' : 'Create item'}
          </button>
        </div>
      </form>
    </div>
  )
}
