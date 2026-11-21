import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import OnboardingPhilosopherCard from '@/components/widgets/onboarding/OnboardingPhilosopherCard';
import { PHILOSOPHERS } from '@/lib/philosophers';
import { useAuthStore } from '@/stores/useAuthStore';

// 같은 줄을 두 번 이어 붙이고 절반(-50%)만큼 흘려 보내면 끝과 처음이 맞물려 끊김 없이 반복된다
const WAVE_CARDS = [...PHILOSOPHERS, ...PHILOSOPHERS];
const WAVE_STEP_S = 1.3;
// 이보다 짧게 밀면 버튼 누르기·살짝 건드림으로 보고 넘기지 않는다
const SWIPE_MIN_PX = 50;

const slides = [
  {
    title: '일이 지루하게 느껴질 때',
    description:
      '매일 비슷한 일, 무엇이 나를 지치게 하는지\n철학자와 함께 들여다보세요.',
  },
  {
    title: '나에게 맞는\n철학자를 골라 보세요',
    description:
      '철학자마다 성격과 질문하는 방식이 달라요.\n특징을 보고 마음에 드는 사수를 직접 선택해 보세요.',
  },
  {
    title: '새로운 시선을\n일상에서 시험해 보세요',
    description: '대화를 나누고 나면 지금 나에게 맞는 제품을 추천해 드려요!',
  },
];

export default function OnboardingPage() {
  const [page, setPage] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const navigate = useNavigate();
  const slide = slides[page];
  const isLast = page === slides.length - 1;
  const userName = useAuthStore((s) => s.userName);

  function finishOnboarding() {
    navigate('/home');
  }

  return (
    <section
      className='relative flex min-h-0 flex-1 flex-col bg-background-base px-4 pb-4'
      onTouchStart={(e) => {
        swipeStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (swipeStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - swipeStartX.current;
        swipeStartX.current = null;
        if (dx <= -SWIPE_MIN_PX && !isLast) setPage((current) => current + 1);
        if (dx >= SWIPE_MIN_PX && page > 0) setPage((current) => current - 1);
      }}
    >
      {!isLast && (
        <button
          type='button'
          onClick={finishOnboarding}
          className='absolute right-4 top-5 z-10 px-2 py-2 text-[12px] text-text-tertiary transition-colors hover:text-text-primary'
        >
          건너뛰기
        </button>
      )}

      <div className='flex min-h-0 flex-1 flex-col'>
        {page === 0 ? (
          <div aria-hidden className='relative -mx-4 mt-14 h-93 shrink-0 overflow-hidden pl-4'>
            {/* 왼쪽 여백은 바깥에 둔다. 줄 안에 있으면 -50%에 섞여 반복될 때 카드가 튄다 */}
            <div className='flex w-max items-start pt-16 motion-safe:animate-marquee'>
              {WAVE_CARDS.map((philosopher, index) => (
                <OnboardingPhilosopherCard
                  key={`${philosopher.key}-${index}`}
                  philosopher={philosopher}
                  className='mr-5 motion-safe:animate-float'
                  // 카드 순서마다 박자를 어긋나게 해야 물결이 된다. 값이 카드마다 달라 Tailwind 클래스로 만들 수 없다
                  style={{ animationDelay: `${-index * WAVE_STEP_S}s` }}
                />
              ))}
            </div>
          </div>
        ) : page === 1 ? (
          // 첫 장의 카드 영역과 같은 높이라 장을 넘겨도 제목 위치가 그대로다. 시안처럼 아래 대화가 흐려지며 사라진다
          <div aria-hidden className='mt-14 flex h-93 shrink-0 justify-center pt-10'>
            <img src='/assets/onboarding2.png' alt='' className='h-fit w-full max-w-84.25 mask-b-from-60%' />
          </div>
        ) : (
          <div aria-hidden className='mt-14 flex h-93 shrink-0 items-center justify-center pt-14'>
            <img src='/assets/onboarding3.png' alt='' className='w-33' />
          </div>
        )}

        <div className='mt-6 px-0.5'>
          {page === 0 && userName && (
            <p className='mb-2 text-body-14-bold text-text-brand'>{userName}님, 안녕하세요!</p>
          )}
          <h1 className='whitespace-pre-line font-a2z text-title-24-bold text-text-primary'>
            {slide.title}
          </h1>
          <p className='mt-8 whitespace-pre-line text-body-15-regular text-text-secondary'>
            {slide.description}
          </p>
        </div>

        <div className='flex-1' />

        <div
          className='flex h-8 shrink-0 items-center justify-center gap-1.5'
          aria-label={`온보딩 ${page + 1} / ${slides.length}`}
        >
          {slides.map((item, index) => (
            <span
              key={item.title}
              aria-current={index === page ? 'step' : undefined}
              className={`size-2 rounded-full ${index === page ? 'bg-accent-primary' : 'bg-palette-neutral-400'}`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={() =>
            isLast ? finishOnboarding() : setPage((current) => current + 1)
          }
          className='flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-accent-primary text-[15px] font-semibold text-text-inverse transition-colors hover:bg-accent-pressed active:bg-accent-pressed'
        >
          {isLast ? '일세 시작하기!' : '다음'}
        </button>
      </div>
    </section>
  );
}
