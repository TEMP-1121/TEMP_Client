import { CircleAlert } from 'lucide-react'

import KakaoLoginButton from '@/components/widgets/auth/KakaoLoginButton'
import { useAuthStore } from '@/stores/useAuthStore'

type KakaoRetryProps = {
  message: string
}

export default function KakaoRetry({ message }: KakaoRetryProps) {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <CircleAlert className="size-10 text-neutral-400" aria-hidden />
      <p className="text-base font-semibold whitespace-pre-line">{message}</p>
      <KakaoLoginButton onClick={startKakaoLogin} />
    </div>
  )
}
