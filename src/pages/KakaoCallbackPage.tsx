import { CircleCheck, LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import KakaoRetry from '@/components/widgets/auth/KakaoRetry'
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
    // 인가 코드가 담긴 콜백 주소로 뒤로 가기 하면 같은 코드를 다시 쓰게 되므로 replace로 이동한다
    if (status === 'signupRequired') navigate('/signup', { replace: true })
  }, [status, navigate])

  if (status === 'failed') {
    return (
      <section className="flex flex-1 flex-col p-6">
        <KakaoRetry message={error ?? '카카오 인증에 실패했어요.'} />
      </section>
    )
  }

  if (status === 'existing') {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <CircleCheck className="size-10 text-neutral-900" aria-hidden />
        <h2 className="text-lg font-bold">이미 가입된 계정이에요</h2>
        <Link to="/" replace className="rounded-2xl bg-neutral-900 px-6 py-3 font-semibold text-white">
          홈으로
        </Link>
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
