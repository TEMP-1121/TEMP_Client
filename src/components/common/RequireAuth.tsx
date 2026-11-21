import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { rememberReturnTo } from '@/lib/authRedirect'
import { useAuthStore } from '@/stores/useAuthStore'

// 로그인이 필요한 화면을 감싼다. 새로고침·앱 재실행으로 메모리의 토큰이 없으면 refresh 쿠키로 한 번 확인하고,
// 그래도 없으면(또는 사용 중 refresh까지 만료되면) 가려던 경로를 기억해 둔 채 로그인 화면으로 보낸다
export default function RequireAuth() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken)
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (accessToken) return
    let cancelled = false
    refreshAccessToken().finally(() => {
      if (!cancelled) setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [accessToken, refreshAccessToken])

  useEffect(() => {
    if (accessToken || !checked) return
    rememberReturnTo(pathname + search)
    navigate('/', { replace: true })
  }, [accessToken, checked, pathname, search, navigate])

  if (accessToken) return <Outlet />
  return (
    <section className="flex flex-1 items-center justify-center p-4">
      <p className="text-body-14-regular text-text-tertiary">로그인 확인 중…</p>
    </section>
  )
}
