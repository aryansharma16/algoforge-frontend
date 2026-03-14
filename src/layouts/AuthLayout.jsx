import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-slate-950 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl sm:p-8">
        <h1 className="text-center text-xl font-semibold text-white mb-6">
          AlgoForge
        </h1>
        <Outlet />
      </div>
    </div>
  )
}
