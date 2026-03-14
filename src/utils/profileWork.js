const empty = () => ({
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
})

function toLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function normalizeWorkForForm(rows) {
  if (!Array.isArray(rows) || !rows.length) return [empty()]
  return rows.map((w) => ({
    company: w.company ?? '',
    role: w.role ?? '',
    startDate: toLocal(w.startDate),
    endDate: w.current ? '' : toLocal(w.endDate),
    current: Boolean(w.current),
    description: w.description ?? '',
  }))
}
