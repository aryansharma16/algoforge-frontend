import UserAvatar from './UserAvatar'
import { getInitials } from '../utils/avatar'
import { SOCIAL_PROFILE_TYPES } from '../constants/socialProfiles'

function socialTypeLabel(type) {
  const t = (type || '').toLowerCase()
  return SOCIAL_PROFILE_TYPES.find((x) => x.value === t)?.label || type || 'Link'
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

function nonEmptyWork(w) {
  return (
    w &&
    (w.company?.trim() ||
      w.role?.trim() ||
      w.description?.trim() ||
      w.startDate ||
      w.current)
  )
}

function nonEmptyEdu(e) {
  return (
    e &&
    (e.institution?.trim() ||
      e.degree?.trim() ||
      e.field?.trim() ||
      e.description?.trim() ||
      e.startYear != null ||
      e.endYear != null)
  )
}

export default function ProfilePreview({ user, onEdit }) {
  const name =
    user.displayName?.trim() || user.username || getInitials(user)
  const title = [user.currentCompany, user.organisation].filter(Boolean).join(' · ')
  const skills = Array.isArray(user.skills) ? user.skills.filter(Boolean) : []
  const work = (user.workExperience || []).filter(nonEmptyWork)
  const edu = (user.education || []).filter(nonEmptyEdu)
  const location = [user.city, user.state, user.country].filter(Boolean).join(', ')
  const social = (user.socialProfiles || []).filter(
    (s) => s && typeof s.url === 'string' && s.url.trim()
  )

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/80 via-slate-900 to-slate-950 shadow-2xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative p-8 sm:flex sm:items-end sm:gap-10 sm:p-10">
          <UserAvatar user={user} size={120} className="ring-2 ring-white/20 shadow-2xl" />
          <div className="mt-6 min-w-0 flex-1 sm:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {name}
            </h1>
            {title && (
              <p className="mt-2 text-lg text-violet-200/90">{title}</p>
            )}
            <p className="mt-2 text-sm text-slate-400">{user.email}</p>
            {user.bio?.trim() && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
                {user.bio}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {user.number && (
                <span className="rounded-full bg-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
                  {user.number}
                </span>
              )}
              {location && (
                <span className="rounded-full bg-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
                  {location}
                </span>
              )}
              {typeof user.resume === 'string' &&
                user.resume.trim().startsWith('http') && (
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-violet-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
                >
                  Resume ↗
                </a>
              )}
            </div>
            {social.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {social.map((s, i) => (
                  <a
                    key={i}
                    href={s.url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-950/40 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-950/60"
                  >
                    <span className="text-cyan-400/90">
                      {socialTypeLabel(s.type)}
                    </span>
                    <span className="max-w-[10rem] truncate text-slate-300">
                      {s.label?.trim() || 'Open ↗'}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="mt-6 shrink-0 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/15 sm:mt-0"
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-violet-500/25 bg-gradient-to-r from-violet-950/80 to-fuchsia-950/50 px-4 py-2 text-sm font-medium text-violet-100 shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work */}
      {work.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Experience
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {work.map((w, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-violet-500/30 hover:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">
                      {w.company || 'Company'}
                    </h3>
                    <p className="mt-0.5 text-sm text-violet-300/90">{w.role}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                    {fmtDate(w.startDate)} —{' '}
                    {w.current ? 'Present' : fmtDate(w.endDate) || '—'}
                  </span>
                </div>
                {w.description?.trim() && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {w.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {edu.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Education
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {edu.map((e, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5"
              >
                <h3 className="font-semibold text-white">
                  {e.institution || 'Institution'}
                </h3>
                <p className="mt-1 text-sm text-fuchsia-300/80">
                  {[e.degree, e.field].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {e.startYear != null && e.endYear != null
                    ? `${e.startYear} — ${e.endYear}`
                    : e.startYear || e.endYear || ''}
                </p>
                {e.description?.trim() && (
                  <p className="mt-3 text-sm text-slate-400">{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length === 0 &&
        work.length === 0 &&
        edu.length === 0 &&
        social.length === 0 &&
        !user.bio?.trim() && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 py-16 text-center">
          <p className="text-slate-500">
            Add bio, skills, social links, work & education in edit mode.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 text-sm font-medium text-violet-400 hover:underline"
          >
            Edit profile →
          </button>
        </div>
      )}
    </div>
  )
}
