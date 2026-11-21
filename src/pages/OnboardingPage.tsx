import { useState } from 'react';
import { useNavigate } from 'react-router';

const slides = [
  {
    title: '일이 지루하게 느껴질 때',
    description:
      '매일 비슷한 일, 무엇이 나를 지치게 하는지 철학자와 함께 들여다보세요.',
  },
  {
    title: '나에게 맞는 철학자를 골라 보세요',
    description:
      '철학자마다 성격과 질문하는 방식이 달라요. 마음에 드는 사수를 직접 선택해 보세요.',
  },
  {
    title: '새로운 시선으로 일상을 시험해 보세요',
    description:
      '대화를 나누고 나면 지금 나에게 맞는 활동과 물건을 추천해 드려요.',
  },
];

export default function OnboardingPage() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const isWelcome = page === 0;
  const slide = slides[page - 1];

  function finishOnboarding() {
    navigate('/philosophers');
  }

  return (
    <section className='flex flex-1 flex-col bg-[#f8f9fb] px-5 pb-5'>
      <div className='h-12' aria-hidden />

      <div className='flex h-10 items-center justify-end'>
        {!isWelcome && page < slides.length && (
          <button
            type='button'
            onClick={finishOnboarding}
            className='px-2 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700'
          >
            건너뛰기
          </button>
        )}
      </div>

      <div className='flex flex-1 flex-col justify-center pb-4'>
        <div className='mb-7 h-[min(46vh,390px)] min-h-64' aria-hidden />

        <div className='min-h-28 px-1'>
          {isWelcome ? (
            <>
              <h1 className='text-[21px] font-semibold leading-snug tracking-[-0.04em] text-neutral-800'>
                일상에 오신 직장인 여러분,
                <br />
                환영합니다.
              </h1>
              <p className='mt-3 max-w-72 text-xs leading-relaxed text-neutral-500'>
                매일 똑같은 일에 지쳤다면, 몇백 년 먼저 태어난 철학자 사수에게
                말을 걸어보세요.
              </p>
            </>
          ) : (
            <>
              <h1 className='text-[20px] font-semibold leading-snug tracking-[-0.04em] text-neutral-900'>
                {slide.title}
              </h1>
              <p className='mt-3 text-xs leading-relaxed text-neutral-500'>
                {slide.description}
              </p>
            </>
          )}
        </div>
      </div>

      <div
        className='flex h-8 items-center justify-center gap-1.5'
        aria-label={isWelcome ? undefined : `온보딩 ${page} / ${slides.length}`}
      >
        {!isWelcome &&
          slides.map((item, index) => (
            <span
              key={item.title}
              className={`h-1.5 rounded-full transition-all ${index === page - 1 ? 'w-5 bg-neutral-900' : 'w-1.5 bg-neutral-300'}`}
            />
          ))}
      </div>

      <button
        type='button'
        onClick={() =>
          page === slides.length
            ? finishOnboarding()
            : setPage((current) => current + 1)
        }
        className='flex h-14 w-full items-center justify-center rounded-none bg-neutral-900 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 active:bg-neutral-700'
      >
        {isWelcome ? '시작하기' : page === slides.length ? '시작하기' : '다음'}
      </button>
    </section>
  );
}
