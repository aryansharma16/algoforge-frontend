import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="text-center text-xl font-semibold text-white mb-6">
          AlgoForge
        </h1>
        <Outlet />
      </div>
    </div>
  )
}
