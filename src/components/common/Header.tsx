import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-background-base px-2">
      {/* 사이드바(대화 기록)는 아직 없다 */}
      <button aria-label="메뉴" className="flex size-10 items-center justify-center">
        <Menu className="size-6 text-icon-secondary" />
      </button>
      <h1 className="text-center text-heading-18-bold text-text-primary">일세</h1>
    </header>
  )
}
