import { MessageCircle } from 'lucide-react';

import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin);

  return (
    <section className='flex flex-1 flex-col bg-background-base px-4 pb-8'>
      <div className='h-12 shrink-0' aria-hidden />

      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='size-18 bg-palette-neutral-300' aria-hidden />
        <h1 className='mt-8 text-4xl font-bold leading-tight tracking-[-0.02em] text-text-primary'>
          일세
        </h1>
        <div className='relative'>
          <p className='mt-1 text-sm text-text-secondary'>
            일고민 하나, 철학자는 셋 <span className='font-semibold text-accent-primary'>일세</span>
          </p>
        </div>
      </div>

      <footer className='flex shrink-0 flex-col items-center gap-8'>
        <button
          type='button'
          onClick={startKakaoLogin}
          className='grid h-14 w-full grid-cols-[2.5rem_1fr_2.5rem] items-center rounded-full border border-static-black bg-background-base px-3 text-sm font-medium text-text-primary transition-colors hover:bg-accent-light active:bg-accent-light'
        >
          <MessageCircle className='ml-1 size-5 fill-current text-static-black' aria-hidden />
          <span className='text-center'>카카오로 시작하기</span>
          <span aria-hidden />
        </button>
        <p className='text-xs text-text-tertiary underline underline-offset-2'>
          개인정보처리방침
        </p>
      </footer>
    </section>
  );
}
