import { cn } from '@/lib/utils'

// 점마다 시작을 늦춰 앞에서부터 차례로 튀게 한다. Tailwind에 animation-delay 스케일이 없어 임의값을 쓴다
const DOT_DELAYS = ['motion-safe:[animation-delay:0ms]', 'motion-safe:[animation-delay:150ms]', 'motion-safe:[animation-delay:300ms]']

export default function LoadingScreen() {
  return (
    <section role="status" className="flex flex-1 flex-col items-center justify-center gap-4.25 p-4">
      <span aria-hidden className="flex gap-2">
        {DOT_DELAYS.map((delay) => (
          <span key={delay} className={cn('size-1.5 rounded-full bg-accent-primary motion-safe:animate-typing-dot', delay)} />
        ))}
      </span>
      <p className="rounded-2xl rounded-tr-xs bg-accent-primary px-4 py-2.5 text-body-14-medium text-text-inverse">
        잠시만 기다려 주세요
      </p>
    </section>
  )
}
