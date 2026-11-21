import { cn } from '@/lib/utils'

type WordmarkProps = {
  className?: string
}

// "일세" 글자 로고. 높이만 정하면 폭은 이미지 비율(141:71)을 따른다
export default function Wordmark({ className }: WordmarkProps) {
  return <img src="/assets/wordmark.png" alt="일세" className={cn('block h-6.5 w-auto', className)} />
}
