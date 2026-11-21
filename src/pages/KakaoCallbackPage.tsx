import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import LoadingScreen from '@/components/common/LoadingScreen'
import KakaoRetry from '@/components/widgets/auth/KakaoRetry'
import { takeReturnTo } from '@/lib/authRedirect'
import { useAuthStore } from '@/stores/useAuthStore'

export default function KakaoCallbackPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const status = useAuthStore((s) => s.callbackStatus)
  const error = useAuthStore((s) => s.callbackError)
  const completeKakaoCallback = useAuthStore((s) => s.completeKakaoCallback)
  const justSignedUp = useAuthStore((s) => s.userName !== null)

  useEffect(() => {
    void completeKakaoCallback(search)
  }, [search, completeKakaoCallback])

  useEffect(() => {
    // 뒤로 가기로 콜백 화면에 돌아오면 확인을 다시 하게 되므로 replace로 이동한다
    if (status !== 'done') return
    // 방금 가입한 계정에는 예전에 보던 방이 없다(다른 계정의 방이면 404). 처음 온 사람은 기억한 주소를 버리고 온보딩부터 본다
    const returnTo = takeReturnTo()
    navigate((!justSignedUp && returnTo) || '/onboarding', { replace: true })
  }, [status, justSignedUp, navigate])

  if (status === 'failed') {
    return (
      <section className="flex flex-1 flex-col p-6">
        <KakaoRetry message={error ?? '카카오 인증에 실패했어요.'} />
      </section>
    )
  }

  return <LoadingScreen />
}
