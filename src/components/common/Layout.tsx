import { Outlet } from 'react-router'

import BottomNavigation from '@/components/common/BottomNavigation'
import Header from '@/components/common/Header'

export default function Layout() {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <div className="mx-auto flex min-h-dvh max-w-117 flex-col bg-white">
        <Header />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}
