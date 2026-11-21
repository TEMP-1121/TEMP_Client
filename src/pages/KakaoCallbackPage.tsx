import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import KakaoRetry from '@/components/widgets/auth/KakaoRetry'
import { takeReturnTo } from '@/lib/authRedirect'
import { useAuthStore } from '@/stores/useAuthStore'

export default function KakaoCallbackPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const status = useAuthStore((s) => s.callbackStatus)
  const error = useAuthStore((s) => s.callbackError)
  const completeKakaoCallback = useAuthStore((s) => s.completeKakaoCallback)

  useEffect(() => {
    void completeKakaoCallback(search)
  }, [search, completeKakaoCallback])

  useEffect(() => {
    // 뒤로 가기로 콜백 화면에 돌아오면 확인을 다시 하게 되므로 replace로 이동한다
    if (status === 'signupRequired') navigate('/signup', { replace: true })
    if (status === 'existing') navigate(takeReturnTo() ?? '/onboarding', { replace: true })
  }, [status, navigate])

  if (status === 'failed') {
    return (
      <section className="flex flex-1 flex-col p-6">
        <KakaoRetry message={error ?? '카카오 인증에 실패했어요.'} />
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
      <LoaderCircle className="size-8 animate-spin text-neutral-400" aria-hidden />
      <p className="text-sm text-neutral-500">카카오 인증을 확인하고 있어요</p>
    </section>
  )
}
