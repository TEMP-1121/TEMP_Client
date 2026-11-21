import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import LoadingScreen from '@/components/common/LoadingScreen'
import SplashPage from '@/pages/SplashPage'
import { useAuthStore } from '@/stores/useAuthStore'

const SPLASH_MIN_MS = 1500

// 로그인 화면(/)을 감싼다. 셸 앱은 항상 /로 시작하므로, 처음 들어오면 스플래시를 보여 주는 동안 로그인 유지 여부를 확인해
// 로그인돼 있으면 홈으로, 아니면 로그인 화면으로 보낸다. 앱 안에서 로그인 화면으로 보내질 때(만료 등)는 스플래시를 다시 띄우지 않는다
export default function GuestOnly() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken)
  const navigate = useNavigate()
  const { key } = useLocation()
  // react-router는 페이지를 처음 열었을 때(앱 실행·새로고침) location.key가 'default'다
  const [firstEntry] = useState(() => key === 'default')
  // 토큰이 바뀌어 확인을 다시 해도 최소 표시 시간이 늘어나지 않게 한 번만 만든다
  const [splashDone] = useState(() =>
    firstEntry ? new Promise<void>((resolve) => window.setTimeout(resolve, SPLASH_MIN_MS)) : Promise.resolve(),
  )
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([accessToken ? Promise.resolve(accessToken) : refreshAccessToken(), splashDone]).then(([token]) => {
      if (cancelled) return
      if (token) navigate('/home', { replace: true })
      else setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [accessToken, refreshAccessToken, navigate, splashDone])

  if (checked) return <Outlet />
  return firstEntry ? <SplashPage /> : <LoadingScreen />
}
