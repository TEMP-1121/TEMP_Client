import { useState } from 'react';
import { useNavigate } from 'react-router';

const slides = [
  {
    title: '일이 지루하게 느껴질 때',
    description:
      '매일 비슷한 일, 무엇이 나를 지치게 하는지 철학자와 함께 들여다보세요.',
  },
  {
    title: '나에게 맞는\n철학자를 골라 보세요',
    description:
      '철학자마다 성격과 질문하는 방식이 달라요. 특징을 보고 마음에 드는 사수를 직접 선택해 보세요.',
  },
  {
    title: '새로운 시선을\n일상에서 시험해 보세요',
    description: '대화를 나누고 나면 지금 나에게 맞는 제품을 추천해 드려요!',
  },
];

export default function OnboardingPage() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const slide = slides[page];
  const isLast = page === slides.length - 1;

  function finishOnboarding() {
    navigate('/home');
  }

  return (
    <section className='relative flex min-h-0 flex-1 flex-col bg-background-base px-4 pb-4'>
      {!isLast && (
        <button
          type='button'
          onClick={finishOnboarding}
          className='absolute right-4 top-16 z-10 px-2 py-2 text-[12px] text-text-tertiary transition-colors hover:text-text-primary'
        >
          건너뛰기
        </button>
      )}

      <div className='flex min-h-0 flex-1 flex-col'>
        <div
          className='mt-29 flex aspect-4/3 max-h-72 min-h-56 shrink-0 bg-palette-neutral-100'
          aria-hidden
        />

        <div className='mt-6 px-0.5'>
          <h1 className='whitespace-pre-line text-[24px] font-semibold leading-[1.35] tracking-[-0.03em] text-text-primary'>
            {slide.title}
          </h1>
          <p className='mt-8 text-[15px] leading-[1.4] text-text-tertiary'>
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
