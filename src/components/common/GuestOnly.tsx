import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { useAuthStore } from '@/stores/useAuthStore'

// 로그인 화면(/)을 감싼다. 셸 앱은 항상 /로 시작하므로, 이미 로그인돼 있으면 로그인 화면을 건너뛰고 홈으로 보낸다.
// 회원가입 직후에는 로그인 화면이 "가입 완료" 안내를 띄운 뒤 직접 온보딩으로 보내므로 건드리지 않는다
export default function GuestOnly() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken)
  const navigate = useNavigate()
  const location = useLocation()
  const signupComplete = (location.state as { signupComplete?: boolean } | null)?.signupComplete ?? false
  const [checked, setChecked] = useState(signupComplete)

  useEffect(() => {
    if (signupComplete) return
    let cancelled = false
    ;(accessToken ? Promise.resolve(accessToken) : refreshAccessToken()).then((token) => {
      if (cancelled) return
      if (token) navigate('/home', { replace: true })
      else setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [accessToken, refreshAccessToken, signupComplete, navigate])

  if (!checked) {
    return (
      <section className="flex flex-1 items-center justify-center p-4">
        <p className="text-body-14-regular text-text-tertiary">로그인 확인 중…</p>
      </section>
    )
  }
  return <Outlet />
}
