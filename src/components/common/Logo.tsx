import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return <img src="/assets/logo.png" alt="일세" className={cn('size-18 object-contain', className)} />
}
