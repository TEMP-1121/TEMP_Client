import { House, MessageCircle, User, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'

import { cn } from '@/lib/utils'

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/home', label: '홈', icon: House },
  { to: '/chat', label: '채팅', icon: MessageCircle },
  { to: '/mypage', label: '마이', icon: User },
]

export default function BottomNavigation() {
  return (
    <nav className="sticky bottom-0 z-10 flex h-16 border-t border-neutral-200 bg-white">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-xs',
              isActive ? 'font-semibold text-neutral-900' : 'text-neutral-400',
            )
          }
        >
          <Icon className="size-6" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
