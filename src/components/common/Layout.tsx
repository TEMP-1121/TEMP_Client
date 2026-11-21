import { Outlet, useLocation } from 'react-router'

import BottomNavigation from '@/components/common/BottomNavigation'
import Header from '@/components/common/Header'

export default function Layout() {
  const { pathname } = useLocation()
  const isOnboarding = pathname === '/' || pathname === '/philosophers'

  return (
    <div className="min-h-dvh bg-background-subtle">
      <div className="mx-auto flex h-dvh max-w-117 flex-col bg-background-base">
        {!isOnboarding && <Header />}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
        {!isOnboarding && <BottomNavigation />}
      </div>
    </div>
  )
}
