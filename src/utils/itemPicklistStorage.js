const PREFIX = 'algoforge_item_picklist_'

export const STORAGE_KEYS = {
  platform: `${PREFIX}platform`,
  tag: `${PREFIX}tag`,
  flag: `${PREFIX}flag`,
  difficulty: `${PREFIX}difficulty`,
}

function parseArr(raw) {
  if (!raw) return []
  try {
    const a = JSON.parse(raw)
    return Array.isArray(a) ? a.filter((x) => typeof x === 'string' && x.trim()) : []
  } catch {
    return []
  }
}

export function loadUserExtras(key) {
  if (typeof localStorage === 'undefined') return []
  return parseArr(localStorage.getItem(key))
}

export function persistUserExtra(key, value) {
  const v = String(value || '').trim()
  if (!v || typeof localStorage === 'undefined') return
  const prev = loadUserExtras(key)
  if (prev.includes(v)) return
  const next = [...prev, v].slice(-200)
  localStorage.setItem(key, JSON.stringify(next))
}

/** Deduped merge: presets first, then user extras, then current value */
export function mergePicklist(presets, storageKey, currentValue) {
  const extra = loadUserExtras(storageKey)
  const seen = new Set()
  const out = []
  for (const x of [...presets, ...extra, currentValue].filter(Boolean)) {
    const s = String(x).trim()
    if (!s || seen.has(s.toLowerCase())) continue
    seen.add(s.toLowerCase())
    out.push(s)
  }
  return out
}
