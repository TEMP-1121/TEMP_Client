import { MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin);
  const location = useLocation();
  const navigate = useNavigate();
  const signupComplete = (location.state as { signupComplete?: boolean } | null)?.signupComplete ?? false;

  useEffect(() => {
    if (!signupComplete) return

    const timeout = window.setTimeout(() => {
      navigate('/onboarding', { replace: true });
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [navigate, signupComplete]);

  return (
    <section className='flex flex-1 flex-col bg-background-base px-3 pb-8'>
      <div className='h-12 shrink-0' aria-hidden />

      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='size-15 bg-palette-neutral-300' aria-hidden />
        <h1 className='mt-6 text-[28px] font-bold leading-tight tracking-[-0.02em] text-text-primary'>
          일세
        </h1>
        <div className='relative'>
          <p className='mt-1 text-[11px] text-text-secondary'>
            일고민 하나, 철학자는 셋 <span className='font-semibold text-accent-primary'>일세</span>
          </p>
          {signupComplete && (
            <div
              role='status'
              className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full bg-accent-primary px-3 py-1.5 text-[10px] font-medium text-text-inverse shadow-sm'
            >
              일세 회원가입 완료!
            </div>
          )}
        </div>
      </div>

      <footer className='flex shrink-0 flex-col items-center gap-6 px-2'>
        <button
          type='button'
          onClick={startKakaoLogin}
          className='grid h-12 w-full grid-cols-[2.5rem_1fr_2.5rem] items-center rounded-full border border-accent-primary bg-background-base px-3 text-[11px] font-medium text-text-primary transition-colors hover:bg-accent-light active:bg-accent-light'
        >
          <MessageCircle className='ml-1 size-4 fill-current text-static-black' aria-hidden />
          <span className='text-center'>카카오로 시작하기</span>
          <span aria-hidden />
        </button>
        <p className='text-[9px] text-text-tertiary underline underline-offset-2'>
          개인정보처리방침
        </p>
      </footer>
    </section>
  );
}
