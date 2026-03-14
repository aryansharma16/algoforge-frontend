import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal confirmation dialog. Renders via portal on document.body.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, loading, onClose])

  if (!open) return null

  async function handleConfirm() {
    await onConfirm()
  }

  const confirmBtn =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/40'
      : 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500/40'

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
        aria-label="Close"
        onClick={loading ? undefined : onClose}
        disabled={loading}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleConfirm()}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-50 ${confirmBtn}`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
