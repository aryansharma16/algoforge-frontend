import { Link, Outlet } from 'react-router-dom'
import AppLogo from '../components/AppLogo'
import AuthHero from '../components/AuthHero'

export default function AuthLayout() {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 md:flex-row">
      {/* Left: form — centered card + footer, no page scroll */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-6 md:py-8">
        <div className="flex w-full max-w-[400px] flex-1 flex-col items-center justify-center">
          <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-8 md:shadow-md">
            <header className="mb-6">
              <AppLogo size={32} showWordmark className="font-semibold" />
            </header>
            <Outlet />
          </div>
        </div>
        <footer className="shrink-0 w-full max-w-[400px] py-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Copyright © 2026 AlgoForge</span>
            <span>
              <Link to="/terms" className="hover:text-violet-600 hover:underline dark:hover:text-violet-400">
                Terms of Service
              </Link>
              {' · '}
              <Link to="/privacy-policy" className="hover:text-violet-600 hover:underline dark:hover:text-violet-400">
                Privacy Policy
              </Link>
            </span>
          </div>
        </footer>
      </div>
      {/* Right: hero — full height, no overflow */}
      <div className="hidden min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-800 to-slate-900 md:flex md:flex-col">
        <AuthHero />
      </div>
    </div>
  )
}
