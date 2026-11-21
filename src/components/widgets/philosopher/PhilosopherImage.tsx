import { cn } from '@/lib/utils'

// 이미지에 흐림 번짐이 포함돼 도형보다 크다. 시안처럼 도형이 상자를 채우도록 철학자마다 번짐만큼 바깥으로 넘겨 그린다 (시안 값 그대로)
const BLEED: Record<string, string> = {
  epictetus: 'inset-[-6.67%]',
  nietzsche: 'inset-[-8.73%_0_-5.35%_0]',
  marx: 'inset-[-5%_-6.67%_-6.67%_-6.67%]',
  camus: 'inset-[-5%_-5.63%_-8.33%_-5.63%]',
  zhuangzi: 'inset-[-1.48%_-9.54%_-1.48%_-7.66%]',
  epicurus: 'inset-[-10%]',
  aristotle: 'inset-[-6.67%_-2.63%]',
  arendt: 'inset-[-6.67%_-5%]',
  weil: 'inset-[-10.25%_0_-5.43%_-8.36%]',
}

type PhilosopherImageProps = {
  personaKey: string
  className?: string
}

export default function PhilosopherImage({ personaKey, className }: PhilosopherImageProps) {
  return (
    <span aria-hidden className={cn('relative block size-22.75 shrink-0', className)}>
      <span className={cn('absolute', BLEED[personaKey] ?? 'inset-[-6.67%]')}>
        <img src={`/assets/philosophers/${personaKey}.png`} alt="" className="block size-full max-w-none object-contain" />
      </span>
    </span>
  )
}
