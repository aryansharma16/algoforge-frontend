import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { apiSlice } from '../api/apiSlice'
import UserAvatar from './UserAvatar'
import { AppLogoMark } from './AppLogo'
import { useGetCurrentUserQuery } from '../api/authApi'
import ConfirmDialog from './ConfirmDialog'

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
function IconSettings({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function IconAbout({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
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

const itemBase =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors min-h-[2.75rem]'
const active =
  'bg-violet-100 text-violet-900 border border-violet-400/60 shadow-sm dark:bg-violet-600/25 dark:text-violet-100 dark:border-violet-500/30 dark:shadow-none'
const inactive =
  'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'

export default function Sidebar() {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const reduxUser = useSelector((s) => s.auth.user)
  const { data: me } = useGetCurrentUserQuery()
  const user = me || reduxUser
  const displayName = user?.displayName?.trim() || user?.username || 'Profile'
  const onProfilePage = pathname === '/profile'
  const [logoutOpen, setLogoutOpen] = useState(false)

  function doLogout() {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
    setLogoutOpen(false)
  }

  return (
    <aside
      className="relative z-30 hidden h-[100dvh] w-56 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none md:sticky md:top-0 md:flex"
      aria-label="Main navigation"
    >
      <div className="shrink-0 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
        >
          <AppLogoMark size={34} className="shrink-0 drop-shadow-md" />
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-violet-300 dark:to-fuchsia-300">
            AlgoForge
          </span>
        </Link>
      </div>

      <nav className="scrollbar-themed min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <div className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${itemBase} ${isActive ? active : inactive}`
            }
          >
            <IconDashboard className="shrink-0 text-current" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/journeys"
            className={({ isActive }) =>
              `${itemBase} ${isActive ? active : inactive}`
            }
          >
            <IconJourneys className="shrink-0 text-current" />
            <span>Learning Journeys</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${itemBase} ${isActive ? active : inactive}`
            }
          >
            <IconSettings className="shrink-0 text-current" />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${itemBase} ${isActive ? active : inactive}`
            }
          >
            <IconAbout className="shrink-0 text-current" />
            <span>About</span>
          </NavLink>
        </div>
      </nav>

      <div className="mt-auto shrink-0 border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-4 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
            onProfilePage
              ? 'bg-violet-100 ring-1 ring-inset ring-violet-300 dark:bg-violet-950/40 dark:ring-violet-500/30'
              : ''
          }`}
        >
          <UserAvatar
            user={user || {}}
            size={40}
            className="shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-200">
              {displayName}
            </p>
            <p
              className={`text-xs dark:text-slate-500 ${
                onProfilePage
                  ? 'font-medium text-violet-700 dark:text-violet-300'
                  : 'text-slate-500'
              }`}
            >
              View profile
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className={`${itemBase} mb-3 w-full border-t border-slate-200 pt-3 text-red-600 hover:bg-red-50 dark:border-slate-800 dark:text-red-400/90 dark:hover:bg-red-950/30 dark:hover:text-red-300`}
        >
          <IconLogout className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={doLogout}
        title="Log out?"
        message="You’ll need to sign in again to access your account."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
      />
    </aside>
  )
}
