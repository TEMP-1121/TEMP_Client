import KakaoLoginButton from '@/components/widgets/auth/KakaoLoginButton'
import { useAuthStore } from '@/stores/useAuthStore'

export default function HomePage() {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin)

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <KakaoLoginButton onClick={startKakaoLogin} />
    </section>
  )
}
