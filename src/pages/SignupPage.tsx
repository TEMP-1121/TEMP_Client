import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import KakaoRetry from '@/components/widgets/auth/KakaoRetry'
import SignupForm from '@/components/widgets/auth/SignupForm'
import { useAuthStore } from '@/stores/useAuthStore'

export default function SignupPage() {
  const navigate = useNavigate()
  const defaults = useAuthStore((s) => s.signupDefaults)
  const defaultsLoading = useAuthStore((s) => s.defaultsLoading)
  const signupExpired = useAuthStore((s) => s.signupExpired)
  const signupError = useAuthStore((s) => s.signupError)
  const accountId = useAuthStore((s) => s.accountId)
  const fetchSignupDefaults = useAuthStore((s) => s.fetchSignupDefaults)

  useEffect(() => {
    void fetchSignupDefaults()
  }, [fetchSignupDefaults])

  useEffect(() => {
    if (accountId) navigate('/onboarding', { replace: true })
  }, [accountId, navigate])

  if (accountId) return null

  if (signupExpired) {
    return (
      <section className="flex flex-1 flex-col p-6">
        <KakaoRetry message={'가입 가능 시간이 지났어요.\n카카오 인증부터 다시 진행해 주세요.'} />
      </section>
    )
  }

  if (!defaults) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        {defaultsLoading || !signupError ? (
          <LoaderCircle className="size-8 animate-spin text-neutral-400" aria-hidden />
        ) : (
          <>
            <p className="text-sm text-neutral-500">{signupError}</p>
            <button
              type="button"
              onClick={() => void fetchSignupDefaults()}
              className="rounded-2xl bg-neutral-900 px-6 py-3 font-semibold text-white"
            >
              다시 시도
            </button>
          </>
        )}
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">회원가입</h2>
        <p className="text-sm text-neutral-500">카카오 정보로 채워 두었어요. 필요하면 수정해 주세요.</p>
      </div>
      <SignupForm defaultName={defaults.name} defaultEmail={defaults.email} />
    </section>
  )
}
