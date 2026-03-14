import {
  LEARNING_ITEM_TYPES,
  ITEM_STATUSES,
  ITEM_LIMITS,
} from '../../constants/learningItem'

export function initialForm() {
  return {
    title: '',
    description: '',
    type: 'problem',
    status: 'pending',
    orderIndex: '0',
    platform: '',
    platformId: '',
    platformUrl: '',
    platformDifficulty: '',
    personalDifficulty: '',
    tags: [],
    flags: [],
    notes: '',
    resources: [{ title: '', url: '', type: '' }],
    revisionRequired: false,
  }
}

export function itemToForm(item) {
  if (!item) return initialForm()
  const resources = Array.isArray(item.resources) && item.resources.length
    ? item.resources.map((r) => ({
        title: r.title ?? '',
        url: r.url ?? '',
        type: r.type ?? '',
      }))
    : [{ title: '', url: '', type: '' }]
  return {
    title: item.title ?? '',
    description: item.description ?? '',
    type: LEARNING_ITEM_TYPES.includes(item.type) ? item.type : 'problem',
    status: ITEM_STATUSES.includes(item.status) ? item.status : 'pending',
    orderIndex: item.orderIndex != null ? String(item.orderIndex) : '0',
    platform: item.platform ?? '',
    platformId: item.platformId ?? '',
    platformUrl: item.platformUrl ?? '',
    platformDifficulty: item.platformDifficulty ?? '',
    personalDifficulty: item.personalDifficulty ?? '',
    tags: Array.isArray(item.tags) ? [...item.tags] : [],
    flags: Array.isArray(item.flags) ? [...item.flags] : [],
    notes: item.notes ?? '',
    resources,
    revisionRequired: Boolean(item.revisionRequired),
  }
}

export function emptyErrors() {
  return {
    title: '',
    description: '',
    type: '',
    status: '',
    orderIndex: '',
    platform: '',
    platformId: '',
    platformUrl: '',
    platformDifficulty: '',
    personalDifficulty: '',
    tags: '',
    flags: '',
    notes: '',
    resources: '',
    _form: '',
  }
}

function trimTag(s) {
  return String(s || '').trim().slice(0, ITEM_LIMITS.tagMaxLen)
}

export function validateForm(form) {
  const e = emptyErrors()
  const title = form.title.trim()
  if (!title) e.title = 'Title is required.'
  else if (title.length > ITEM_LIMITS.titleMax)
    e.title = `Max ${ITEM_LIMITS.titleMax} characters.`

  if (form.description.length > ITEM_LIMITS.descriptionMax)
    e.description = `Max ${ITEM_LIMITS.descriptionMax} characters.`

  if (!LEARNING_ITEM_TYPES.includes(form.type)) e.type = 'Invalid type.'
  if (!ITEM_STATUSES.includes(form.status)) e.status = 'Invalid status.'

  const oi = form.orderIndex === '' ? 0 : Number(form.orderIndex)
  if (Number.isNaN(oi) || !Number.isFinite(oi)) e.orderIndex = 'Must be a number.'

  if (form.platform.length > ITEM_LIMITS.platformMax)
    e.platform = `Max ${ITEM_LIMITS.platformMax} chars.`
  if (form.platformId.length > ITEM_LIMITS.platformIdMax)
    e.platformId = `Max ${ITEM_LIMITS.platformIdMax} chars.`
  if (form.platformUrl.length > ITEM_LIMITS.platformUrlMax)
    e.platformUrl = `Max ${ITEM_LIMITS.platformUrlMax} chars.`
  if (form.platformDifficulty.length > ITEM_LIMITS.difficultyMax)
    e.platformDifficulty = `Max ${ITEM_LIMITS.difficultyMax} chars.`
  if (form.personalDifficulty.length > ITEM_LIMITS.difficultyMax)
    e.personalDifficulty = `Max ${ITEM_LIMITS.difficultyMax} chars.`

  const tags = (form.tags || []).map(trimTag).filter(Boolean)
  if (tags.length > ITEM_LIMITS.tagsMax) e.tags = `Max ${ITEM_LIMITS.tagsMax} tags.`

  const flags = (form.flags || []).map(trimTag).filter(Boolean)
  if (flags.length > ITEM_LIMITS.flagsMax) e.flags = `Max ${ITEM_LIMITS.flagsMax} flags.`

  if (form.notes.length > ITEM_LIMITS.notesMax)
    e.notes = `Max ${ITEM_LIMITS.notesMax} characters.`

  const resources = (form.resources || [])
    .map((r) => ({
      title: String(r.title || '').trim().slice(0, 200),
      url: String(r.url || '').trim().slice(0, ITEM_LIMITS.platformUrlMax),
      type: String(r.type || '').trim().slice(0, 80),
    }))
    .filter((r) => r.title || r.url || r.type)

  if (resources.length > ITEM_LIMITS.resourcesMax)
    e.resources = `Max ${ITEM_LIMITS.resourcesMax} resources.`

  const ok = Object.values(e).every((v) => !v)
  return { ok, errors: e, tags, flags, resources }
}

export function buildItemPayload(form, tags, flags, resources) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type,
    status: form.status,
    orderIndex: form.orderIndex === '' ? 0 : Math.floor(Number(form.orderIndex)),
    platform: form.platform.trim(),
    platformId: form.platformId.trim(),
    platformUrl: form.platformUrl.trim(),
    platformDifficulty: form.platformDifficulty.trim(),
    personalDifficulty: form.personalDifficulty.trim(),
    tags,
    flags,
    notes: form.notes.trim(),
    resources,
    revisionRequired: Boolean(form.revisionRequired),
  }
}

export function mapItemServerErrors(err) {
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
  if (!next._form && typeof d.message === 'string') next._form = d.message
  return next
}
