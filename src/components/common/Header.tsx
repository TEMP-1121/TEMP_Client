import { Menu } from 'lucide-react'
import { useState } from 'react'

import ConversationSidebar from '@/components/common/ConversationSidebar'

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-background-base px-2">
        <button
          type="button"
          aria-label="대화 보관함 열기"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
          className="flex size-10 items-center justify-center"
        >
          <Menu className="size-6 text-icon-secondary" aria-hidden />
        </button>
        <h1 className="text-center text-heading-18-bold text-text-primary">일세</h1>
      </header>
      {sidebarOpen && <ConversationSidebar onClose={() => setSidebarOpen(false)} />}
    </>
  )
}
