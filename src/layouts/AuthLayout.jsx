import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-slate-100 p-4 dark:bg-slate-950 sm:p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-8">
        <h1 className="mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-center text-xl font-semibold text-transparent dark:from-violet-300 dark:to-fuchsia-300">
          AlgoForge
        </h1>
        <Outlet />
      </div>
    </div>
  )
}
