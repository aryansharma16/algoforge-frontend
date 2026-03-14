import { toast as sonnerToast } from 'sonner'

export const toast = sonnerToast

/** RTK Query / fetch error → user-facing string */
export function apiErrorMessage(err, fallback = 'Something went wrong') {
  const d = err?.data
  if (typeof d?.message === 'string') return d.message
  if (typeof d?.error === 'string') return d.error
  if (typeof err?.error === 'string') return err.error
  return fallback
}
