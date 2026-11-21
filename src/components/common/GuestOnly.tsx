import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

import LoadingScreen from '@/components/common/LoadingScreen'
import { useAuthStore } from '@/stores/useAuthStore'

// 로그인 화면(/)을 감싼다. 셸 앱은 항상 /로 시작하므로, 이미 로그인돼 있으면 로그인 화면을 건너뛰고 홈으로 보낸다
export default function GuestOnly() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken)
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(accessToken ? Promise.resolve(accessToken) : refreshAccessToken()).then((token) => {
      if (cancelled) return
      if (token) navigate('/home', { replace: true })
      else setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [accessToken, refreshAccessToken, navigate])

  return checked ? <Outlet /> : <LoadingScreen />
}
