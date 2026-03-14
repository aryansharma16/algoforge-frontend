import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

export default function AppLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-950 text-slate-100">
      <MobileNav />

      {/* Mobile: top nav offset. Tablet/desktop (md+): sidebar + main */}
      <div className="flex min-h-0 flex-1 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:min-h-[100dvh] md:pt-0">
        <Sidebar />
        <main className="scrollbar-themed min-h-0 min-w-0 w-full flex-1 basis-0 overflow-x-hidden overflow-y-auto md:min-h-[100dvh]">
          <div className="mx-auto w-full max-w-content px-3 py-4 xs:px-4 sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-9 xl:px-10 xl:py-10 2xl:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
