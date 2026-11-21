import { X } from 'lucide-react'

type ChatHeaderProps = {
  title?: string
  names?: string[]
  onClose: () => void
}

export default function ChatHeader({ title, names, onClose }: ChatHeaderProps) {
  return (
    <header className="grid h-14 shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b border-border-normal px-2">
      <span aria-hidden />
      <div className="flex min-w-0 flex-col items-center">
        {title && <h1 className="max-w-full truncate text-body-14-bold text-text-primary">{title}</h1>}
        {names && (
          <p className="max-w-full truncate text-caption-10-regular text-text-tertiary">{names.join(' · ')}</p>
        )}
      </div>
      <button onClick={onClose} aria-label="닫기" className="flex size-10 items-center justify-center">
        <X className="size-6 text-icon-secondary" />
      </button>
    </header>
  )
}
