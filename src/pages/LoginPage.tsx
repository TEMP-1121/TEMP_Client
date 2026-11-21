import { MessageCircle } from 'lucide-react';

import Logo from '@/components/common/Logo';
import Wordmark from '@/components/common/Wordmark';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const startKakaoLogin = useAuthStore((s) => s.startKakaoLogin);

  return (
    // 시안의 상태 표시줄·홈 인디케이터 자리는 셸의 SafeAreaView가 차지해서 위아래 여백에서 뺐다
    <section className='flex flex-1 flex-col bg-background-base px-4 pt-44 pb-6'>
      <div className='flex flex-col items-center gap-9.25'>
        <div className='flex flex-col items-center gap-3.75'>
          {/* 로고 이미지에 흐림 번짐이 포함돼 시안의 87px 도형보다 크게 그리고, 번짐(약 10px)은 음수 여백으로 레이아웃에서 뺀다 */}
          <Logo className='-m-2.5 size-26.75' />
          <h1>
            <Wordmark />
          </h1>
        </div>
        <p className='text-center font-a2z text-body-14-regular text-text-primary'>
          일고민 하나, 철학자는 셋! <span className='font-a2z text-body-14-bold text-text-brand'>일세</span>
        </p>
      </div>

      <footer className='mt-auto flex shrink-0 flex-col items-center gap-5.5'>
        <button
          type='button'
          onClick={startKakaoLogin}
<<<<<<< HEAD
          className='relative flex h-14 w-full items-center justify-center rounded-full border border-icon-primary bg-background-base text-body-14-semibold text-text-primary transition-colors active:bg-background-subtle'
=======
          className='grid h-14 w-full grid-cols-[2.5rem_1fr_2.5rem] items-center rounded-full border border-static-black bg-background-base px-3 text-sm font-medium text-text-primary transition-colors hover:bg-accent-light active:bg-accent-light'
>>>>>>> d28eb2c4dbf1de540c05ec48b197f869a0757d67
        >
          <MessageCircle className='absolute left-10.25 size-5 fill-current text-static-black' aria-hidden />
          카카오로 시작하기
        </button>
        <p className='p-2.5 text-caption-12-regular text-text-placeholder underline'>개인정보처리방침</p>
      </footer>
    </section>
  );
}
