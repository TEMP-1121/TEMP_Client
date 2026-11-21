import { Link } from 'react-router'

import KakaoLoginButton from '@/components/widgets/auth/KakaoLoginButton'
import { useAuthStore } from '@/stores/useAuthStore'

export default function LoginPage() {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin)

  return (
    <section className="flex flex-1 flex-col bg-background-base">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="size-18 bg-palette-neutral-300" aria-hidden />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[32px] leading-tight font-bold tracking-[-0.02em] text-text-primary">일세</h1>
          <p className="text-body-15-regular text-text-secondary">일고민 하나, 철학자는 셋!</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-4 pb-8">
        {/* 임시: 카카오 로그인 없이 온보딩을 확인하기 위한 버튼. 확인 끝나면 삭제 */}
        <Link
          to="/onboarding"
          className="text-body-14-medium w-full rounded-lg bg-background-subtle py-3 text-center text-text-secondary"
        >
          온보딩 페이지 이동
        </Link>
        <KakaoLoginButton onClick={startKakaoLogin} />
        <p className="text-center text-[11px] text-text-tertiary">
          시작하면 이용약관과 개인정보 처리방침에 동의하게 돼요.
        </p>
      </div>
    </section>
  )
}
