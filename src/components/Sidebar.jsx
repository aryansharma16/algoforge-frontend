import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { apiSlice } from '../api/apiSlice'
import UserAvatar from './UserAvatar'
import { AppLogoMark } from './AppLogo'
import { useGetCurrentUserQuery } from '../api/authApi'

function IconDashboard({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconJourneys({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
function IconUser({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function IconLogout({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
function IconChevrons({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  )
}

const itemBase =
  'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors min-h-[2.75rem]'
const linkCollapsed = `${itemBase} justify-center px-0 w-full`
const linkExpanded = `group/side:hover:justify-start group/side:hover:px-3`
const active =
  'bg-violet-600/25 text-violet-200 border border-violet-500/20'
const inactive = 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 border border-transparent'

export default function Sidebar() {
  const dispatch = useDispatch()
  const reduxUser = useSelector((s) => s.auth.user)
  const { data: me } = useGetCurrentUserQuery()
  const user = me || reduxUser
  const displayName = user?.displayName?.trim() || user?.username || 'Profile'

  function handleLogout() {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
  }

  return (
    <aside
      className="group/side relative z-30 hidden h-[100dvh] max-h-[100dvh] w-14 shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900/95 backdrop-blur-sm transition-[width,box-shadow] duration-200 ease-out hover:w-56 hover:shadow-[8px_0_32px_rgba(0,0,0,0.35)] md:sticky md:top-0 md:flex"
      aria-label="Main navigation"
    >
      {/* Top: logo — does not shrink */}
      <div className="shrink-0 border-b border-slate-800">
        <Link
          to="/dashboard"
          className="flex flex-col items-center gap-1 py-3 transition-colors hover:bg-slate-800/40 group-hover/side:items-stretch group-hover/side:px-3"
          title="AlgoForge — hover to expand"
        >
          <div className="flex w-full items-center justify-center gap-2 group-hover/side:justify-between">
            <AppLogoMark size={34} className="shrink-0 drop-shadow-md" />
            <IconChevrons className="hidden shrink-0 text-slate-500 opacity-0 transition-opacity group-hover/side:block group-hover/side:opacity-100" />
          </div>
          <span className="max-h-0 max-w-0 overflow-hidden text-center text-[10px] font-semibold uppercase tracking-widest text-slate-500 opacity-0 transition-all group-hover/side:max-h-6 group-hover/side:max-w-full group-hover/side:py-1 group-hover/side:opacity-100">
            Expand
          </span>
          <span className="max-w-0 truncate bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-left text-base font-bold tracking-tight text-transparent opacity-0 transition-all duration-200 group-hover/side:max-w-[10rem] group-hover/side:opacity-100">
            AlgoForge
          </span>
        </Link>
      </div>

      {/* Middle: nav only — scrolls if many items later */}
      <nav className="scrollbar-themed min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-3">
        <div className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            title="Dashboard"
            className={({ isActive }) =>
              `${linkCollapsed} ${linkExpanded} ${isActive ? active : inactive}`
            }
          >
            <IconDashboard className="shrink-0 text-current" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/side:max-w-[11rem] group-hover/side:opacity-100">
              Dashboard
            </span>
          </NavLink>
          <NavLink
            to="/journeys"
            title="Learning Journeys"
            className={({ isActive }) =>
              `${linkCollapsed} ${linkExpanded} ${isActive ? active : inactive}`
            }
          >
            <IconJourneys className="shrink-0 text-current" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/side:max-w-[11rem] group-hover/side:opacity-100">
            Learning Journeys
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Bottom: profile + logout — always at bottom of viewport */}
      <div className="mt-auto shrink-0 border-t border-slate-800 bg-slate-900/80">
        <Link
          to="/profile"
          title={displayName}
          className="flex flex-col items-center gap-1.5 px-1 py-4 transition-colors hover:bg-slate-800/80 group-hover/side:flex-row group-hover/side:items-center group-hover/side:gap-3 group-hover/side:px-3 group-hover/side:py-3"
        >
          <UserAvatar user={user || {}} size={40} className="shrink-0 ring-2 ring-slate-700" />
          <div className="flex min-w-0 flex-1 flex-col items-center group-hover/side:items-start">
            <p className="w-full max-w-[3.25rem] truncate text-center text-[10px] font-semibold text-slate-200 group-hover/side:max-w-[9rem] group-hover/side:text-left group-hover/side:text-sm">
              {displayName}
            </p>
            <p className="hidden text-xs text-slate-500 group-hover/side:block">View profile</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`${linkCollapsed} ${linkExpanded} mb-3 w-full border-t border-slate-800/80 pt-3 text-red-400/90 hover:bg-red-950/30 hover:text-red-300`}
        >
          <IconLogout className="shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/side:max-w-[11rem] group-hover/side:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
