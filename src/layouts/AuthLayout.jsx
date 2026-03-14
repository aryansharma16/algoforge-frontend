import { Outlet } from 'react-router-dom'
import AppLogo from '../components/AppLogo'
import AuthHero from '../components/AuthHero'

export default function AuthLayout() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-slate-100 dark:bg-slate-950 md:flex-row">
      {/* Left: form — centered card, content left-aligned */}
      <div className="flex min-h-[100dvh] flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:min-h-0 md:justify-center md:py-12">
        <div className="w-full max-w-[400px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-8 md:shadow-md">
          <header className="mb-6">
            <AppLogo size={32} showWordmark className="font-semibold" />
          </header>
          <Outlet />
        </div>
      </div>
      {/* Right: hero — full height, content vertically centered and left-aligned */}
      <div className="hidden min-h-[320px] flex-1 bg-gradient-to-br from-indigo-700 via-violet-800 to-slate-900 md:flex md:min-h-[100dvh] md:flex-col">
        <AuthHero />
      </div>
    </div>
  )
}
