import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { apiSlice } from '../api/apiSlice'
import UserAvatar from './UserAvatar'
import { AppLogoMark } from './AppLogo'
import { useGetCurrentUserQuery } from '../api/authApi'
import ConfirmDialog from './ConfirmDialog'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium ${
    isActive
      ? 'bg-violet-600 text-white'
      : 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  }`

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const dispatch = useDispatch()
  const reduxUser = useSelector((s) => s.auth.user)
  const { data: me } = useGetCurrentUserQuery()
  const user = me || reduxUser

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex min-h-[3.5rem] items-center justify-between border-b border-slate-200 bg-white/95 px-3 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:px-4 md:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <AppLogoMark size={32} />
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-violet-300 dark:to-fuchsia-300">
            AlgoForge
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-violet-500/30"
            aria-label="Profile"
          >
            <UserAvatar user={user || {}} size={36} className="!rounded-full !ring-0" />
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/journeys" className={linkClass} onClick={() => setOpen(false)}>
                Journeys
              </NavLink>
              <NavLink to="/settings" className={linkClass} onClick={() => setOpen(false)}>
                Settings
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
            </div>
            <div className="border-t border-slate-200 p-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          dispatch(logout())
          dispatch(apiSlice.util.resetApiState())
          setOpen(false)
          setLogoutOpen(false)
        }}
        title="Log out?"
        message="You’ll need to sign in again to access your account."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
      />
    </>
  )
}
