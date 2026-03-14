export function getInitials(user) {
  if (!user || typeof user !== 'object') return '?'
  const raw =
    user.displayName ||
    user.name ||
    user.username ||
    user.email ||
    ''
  const s = String(raw).trim()
  if (!s) return '?'
  const parts = s.split(/\s+/).filter(Boolean)
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return s.slice(0, 2).toUpperCase()
}

const PHOTO_KEYS = ['avatar', 'avatarUrl', 'photo', 'photoURL', 'image', 'picture']

export function getAvatarUrl(user) {
  if (!user || typeof user !== 'object') return null
  for (const k of PHOTO_KEYS) {
    const v = user[k]
    if (typeof v === 'string' && v.trim().length > 0) {
      const t = v.trim()
      if (t.startsWith('http') || t.startsWith('/')) return t
    }
  }
  return null
}
