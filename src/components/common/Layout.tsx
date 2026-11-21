import { Outlet, useLocation } from 'react-router'

import BottomNavigation from '@/components/common/BottomNavigation'
import Header from '@/components/common/Header'

export default function Layout() {
  const { pathname } = useLocation()
  // 온보딩·철학자 선택·단톡방은 자체 헤더를 쓰고 하단 탭을 숨긴다
  const bare = pathname === '/' || pathname === '/philosophers' || pathname === '/chat'

  return (
    <div className="min-h-dvh bg-background-subtle">
      <div className="mx-auto flex h-dvh max-w-117 flex-col bg-background-base">
        {!bare && <Header />}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
        {!bare && <BottomNavigation />}
      </div>
    </div>
  )
}
