import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-slate-950 text-slate-100">
      <MobileNav />

      {/* Desktop: sidebar is full viewport height; main scrolls independently */}
      <div className="flex min-h-0 flex-1 pt-14 lg:min-h-[100dvh] lg:pt-0">
        <Sidebar />
        <main className="scrollbar-themed min-h-0 min-w-0 w-full flex-1 basis-0 overflow-x-hidden overflow-y-auto lg:min-h-[100dvh]">
          <div className="mx-auto w-full max-w-[100vw] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
