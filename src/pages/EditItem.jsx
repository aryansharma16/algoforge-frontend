import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useGetItemByIdQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from '../api/itemApi'
import { useGetJourneyByIdQuery } from '../api/journeyApi'
import ItemForm from '../features/items/ItemForm'
import {
  itemToForm,
  emptyErrors,
  validateForm,
  buildItemPayload,
  mapItemServerErrors,
} from '../features/items/itemFormState'
import { toast, apiErrorMessage } from '../utils/toast'

function EditItemForm({ item, journeyId, itemId }) {
  const navigate = useNavigate()
  const [updateItem, { isLoading: saving }] = useUpdateItemMutation()
  const [form, setForm] = useState(() => itemToForm(item))
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
      await updateItem({
        journeyId,
        itemId,
        ...buildItemPayload(form, tags, flags, resources),
      }).unwrap()
      toast.success('Item updated')
      navigate(`/journeys/${journeyId}/items/${itemId}`, { replace: true })
    } catch (err) {
      setErrors(mapItemServerErrors(err))
      toast.error('Could not save', { description: apiErrorMessage(err) })
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-5 sm:p-8"
    >
      <ItemForm form={form} errors={errors} setField={setField} idPrefix="edit-item" />
      <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-6">
        <Link
          to={`/journeys/${journeyId}/items/${itemId}`}
          className="rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

export default function EditItem() {
  const { journeyId, itemId } = useParams()
  const navigate = useNavigate()
  const { data: journey, isLoading: jLoad } = useGetJourneyByIdQuery(journeyId)
  const { data: item, isLoading, isError } = useGetItemByIdQuery({
    journeyId,
    itemId,
  })
  const [deleteItem, { isLoading: deleting }] = useDeleteItemMutation()

  async function onDelete() {
    if (!confirm(`Delete “${item?.title || 'this item'}”? Cannot be undone.`)) return
    try {
      await deleteItem({ journeyId, itemId }).unwrap()
      toast.success('Item deleted')
      navigate(`/journeys/${journeyId}`, { replace: true })
    } catch (err) {
      toast.error('Could not delete', { description: apiErrorMessage(err) })
    }
  }

  if (jLoad || isLoading) return <p className="text-slate-400">Loading…</p>
  if (isError || !item) {
    return (
      <div className="text-red-400">
        Item not found.
        <Link
          to={`/journeys/${journeyId}`}
          className="mt-2 block text-violet-400 hover:underline"
        >
          ← Journey
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <nav className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <Link to="/journeys" className="text-violet-400 hover:underline">
            Journeys
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            to={`/journeys/${journeyId}`}
            className="max-w-[8rem] truncate text-violet-400 hover:underline sm:max-w-none"
          >
            {journey?.title || 'Journey'}
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            to={`/journeys/${journeyId}/items/${itemId}`}
            className="max-w-[8rem] truncate text-violet-400 hover:underline"
          >
            {item.title}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">Edit</span>
        </ol>
      </nav>

      <header className="mb-8 border-b border-slate-800/80 pb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-400/80">
          Learning item
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Edit item</h1>
        <p className="mt-2 text-sm text-slate-400">
          Submissions count is server-managed; everything else you can change here.
        </p>
      </header>

      <EditItemForm key={item._id} item={item} journeyId={journeyId} itemId={itemId} />

      <section className="mt-10 rounded-2xl border border-red-900/40 bg-red-950/15 p-6">
        <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
        <p className="mt-1 text-xs text-slate-500">
          Remove this item and its submissions from the journey.
        </p>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="mt-4 rounded-xl border border-red-800/80 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900/40 disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete item'}
        </button>
      </section>
    </div>
  )
}
