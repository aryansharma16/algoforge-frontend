import { useState } from 'react'
import { getAvatarUrl, getInitials } from '../utils/avatar'

export default function UserAvatar({ user, size = 96, className = '' }) {
  const url = getAvatarUrl(user)
  const initials = getInitials(user)
  const fontSize = Math.max(14, Math.round(size * 0.36))
  const [broken, setBroken] = useState(false)
  const showImg = url && !broken

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl shadow-xl ring-2 ring-white/15 ${className}`}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : null}
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 font-semibold text-white ${showImg ? 'hidden' : ''}`}
        style={{ fontSize }}
        aria-hidden
      >
        {initials}
      </div>
    </div>
  )
}
