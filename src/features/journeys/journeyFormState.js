import {
  JOURNEY_STATUSES,
  JOURNEY_TYPES,
  JOURNEY_VISIBILITY,
  JOURNEY_LIMITS,
} from '../../constants/journey'

export function initialForm() {
  return {
    title: '',
    description: '',
    category: '',
    journeyType: 'CUSTOM',
    targetItems: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    visibility: 'private',
    lastActivityAt: '',
    priority: '0',
    topicTags: [],
    metadataJson: '{}',
  }
}

export function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function omitTopicTags(obj) {
  if (!obj || typeof obj !== 'object') return {}
  const { topicTags, ...rest } = obj
  return rest
}

/** Map API journey document → form state */
export function journeyToForm(journey) {
  if (!journey) return initialForm()
  const rawMeta =
    journey.metadata && typeof journey.metadata === 'object' ? journey.metadata : {}
  const topicTags = Array.isArray(rawMeta.topicTags)
    ? rawMeta.topicTags.filter((t) => typeof t === 'string')
    : []
  const meta = JSON.stringify(omitTopicTags(rawMeta), null, 2)
  return {
    title: journey.title ?? '',
    description: journey.description ?? '',
    category: journey.category ?? '',
    journeyType: JOURNEY_TYPES.includes(journey.journeyType)
      ? journey.journeyType
      : 'CUSTOM',
    targetItems:
      journey.targetItems != null ? String(journey.targetItems) : '',
    startDate: toDatetimeLocal(journey.startDate),
    endDate: toDatetimeLocal(journey.endDate),
    status: JOURNEY_STATUSES.includes(journey.status)
      ? journey.status
      : 'planned',
    visibility: JOURNEY_VISIBILITY.includes(journey.visibility)
      ? journey.visibility
      : 'private',
    lastActivityAt: toDatetimeLocal(journey.lastActivityAt),
    priority:
      journey.priority != null ? String(journey.priority) : '0',
    topicTags,
    metadataJson: meta || '{}',
  }
}

export function emptyErrors() {
  return {
    title: '',
    description: '',
    category: '',
    journeyType: '',
    targetItems: '',
    startDate: '',
    endDate: '',
    status: '',
    visibility: '',
    lastActivityAt: '',
    priority: '',
    metadata: '',
    topicTags: '',
    _form: '',
  }
}

export function validateForm(form) {
  const e = emptyErrors()
  const t = form.title.trim()
  if (!t) e.title = 'Title is required.'
  else if (t.length > JOURNEY_LIMITS.titleMax)
    e.title = `Title must be at most ${JOURNEY_LIMITS.titleMax} characters.`

  if (form.description.length > JOURNEY_LIMITS.descriptionMax)
    e.description = `Description must be at most ${JOURNEY_LIMITS.descriptionMax} characters.`

  if (form.category.length > JOURNEY_LIMITS.categoryMax)
    e.category = `Category must be at most ${JOURNEY_LIMITS.categoryMax} characters.`

  if (!JOURNEY_TYPES.includes(form.journeyType))
    e.journeyType = 'Pick a valid journey type.'

  const ti = form.targetItems === '' ? 0 : Number(form.targetItems)
  if (Number.isNaN(ti) || ti < 0)
    e.targetItems = 'Target items must be a number ≥ 0.'

  if (!JOURNEY_STATUSES.includes(form.status))
    e.status = 'Pick a valid status.'

  if (!JOURNEY_VISIBILITY.includes(form.visibility))
    e.visibility = 'Pick a valid visibility.'

  const pr = form.priority === '' ? 0 : Number(form.priority)
  if (Number.isNaN(pr) || !Number.isFinite(pr))
    e.priority = 'Priority must be a number.'

  const start = form.startDate ? new Date(form.startDate) : null
  const end = form.endDate ? new Date(form.endDate) : null
  if (form.startDate && Number.isNaN(start?.getTime?.()))
    e.startDate = 'Invalid start date.'
  if (form.endDate && Number.isNaN(end?.getTime?.()))
    e.endDate = 'Invalid end date.'
  if (start && end && end < start)
    e.endDate = 'End date must be on or after start date.'

  if (form.lastActivityAt) {
    const la = new Date(form.lastActivityAt)
    if (Number.isNaN(la.getTime())) e.lastActivityAt = 'Invalid last activity date.'
  }

  let metadata = {}
  const raw = form.metadataJson.trim()
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (
        parsed === null ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      )
        e.metadata = 'Metadata must be a JSON object (e.g. {"key":"value"}).'
      else metadata = { ...parsed }
    } catch {
      e.metadata = 'Metadata must be valid JSON.'
    }
  }

  const tags = Array.isArray(form.topicTags) ? form.topicTags : []
  if (tags.length > 24) e.topicTags = 'At most 24 focus tags.'
  else if (tags.some((t) => typeof t !== 'string' || t.length > 64))
    e.topicTags = 'Invalid tag.'

  const ok = Object.values(e).every((v) => !v)
  return { ok, errors: e, metadata }
}

export function buildJourneyPayload(form, metadata) {
  const tags = Array.isArray(form.topicTags) ? form.topicTags : []
  const meta = {
    ...omitTopicTags(metadata),
    topicTags: tags,
  }
  const body = {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    journeyType: form.journeyType,
    targetItems:
      form.targetItems === ''
        ? 0
        : Math.max(0, Math.floor(Number(form.targetItems))),
    status: form.status,
    visibility: form.visibility,
    priority: form.priority === '' ? 0 : Number(form.priority),
    metadata: meta,
  }
  if (form.startDate) body.startDate = new Date(form.startDate).toISOString()
  if (form.endDate) body.endDate = new Date(form.endDate).toISOString()
  if (form.lastActivityAt)
    body.lastActivityAt = new Date(form.lastActivityAt).toISOString()
  return body
}

export function mapJourneyServerErrors(err) {
  const next = emptyErrors()
  const d = err?.data
  if (!d) {
    next._form = err?.error || 'Request failed.'
    return next
  }
  if (typeof d.message === 'string' && !d.errors) next._form = d.message
  const list = d.errors || d.error?.errors
  if (list && typeof list === 'object') {
    for (const [k, v] of Object.entries(list)) {
      const msg = Array.isArray(v) ? v[0] : v?.message || String(v)
      if (k in next) next[k] = msg
      else next._form = [next._form, msg].filter(Boolean).join(' ')
    }
  }
  if (Array.isArray(d)) {
    d.forEach((item) => {
      if (item.path && item.msg) next[item.path] = item.msg
    })
  }
  if (!next._form && typeof d.message === 'string') next._form = d.message
  return next
}
