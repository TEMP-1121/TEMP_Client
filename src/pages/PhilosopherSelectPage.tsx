import { useState } from 'react';
import { useNavigate } from 'react-router';

const philosophers = [
  {
    name: '에픽테토스',
    description: '내게 달린 선택에 집중해요.',
    tags: '#통제 #선택',
  },
  {
    name: '니체',
    description: '남의 성공 기준을 의심하고 내 기준을 세워요.',
    tags: '#내기준 #자기극복',
  },
  {
    name: '마르쿠스',
    description: '누가 일을 결정하는지 보고, 바꿀 조건을 찾아요.',
    tags: '#노동 #구조',
  },
  {
    name: '카뮈',
    description: '답이 없는 반복 속에서 내가 취할 태도를 찾아요.',
    tags: '#반복 #태도',
  },
  {
    name: '장자',
    description: '당연한 기준을 뒤집어 다른 길을 보여줘요.',
    tags: '#관점전환 #자유',
  },
  {
    name: '에피쿠로스',
    description: '꼭 필요한 욕구와 불안을 키우는 욕구를 나눠요.',
    tags: '#욕구 #작은행복',
  },
  {
    name: '아리스토텔레스',
    description: '되고 싶은 사람에 가까워지는 습관을 제안해요.',
    tags: '#습관 #성장',
  },
  {
    name: '한나 아렌트',
    description: '동료와 함께 새롭게 시작할 일을 찾아요.',
    tags: '#협업 #새시작',
  },
  {
    name: '시몬 베유',
    description: '일하는 사람을 지치게 하는 업무 조건을 짚어요.',
    tags: '#업무조건 #번아웃',
  },
];

export default function PhilosopherSelectPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const canContinue = selected.length === 3;

  function togglePhilosopher(name: string) {
    setSelected((current) => {
      if (current.includes(name)) {
        return current.filter((item) => item !== name);
      }
      if (current.length === 3) {
        return current;
      }
      return [...current, name];
    });
  }

  return (
    <section className='flex min-h-0 flex-1 flex-col bg-white'>
      <div className='h-12 shrink-0' aria-hidden />

      <header className='grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5'>
        <span aria-hidden />
        <h1 className='text-base font-semibold text-neutral-900'>
          철학자 고르기
        </h1>
        <button
          type='button'
          onClick={() => navigate('/home')}
          aria-label='닫기'
          className='flex size-9 items-center justify-center justify-self-end text-3xl leading-none text-neutral-800'
        >
          ×
        </button>
      </header>

      <div className='shrink-0 px-5 pb-4 pt-1'>
        <p className='text-sm font-semibold text-neutral-900'>
          함께 이야기할 철학자 3명을 골라 주세요
        </p>
      </div>

      <div className='grid flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto px-5 pb-4'>
        {philosophers.map((philosopher) => {
          const isSelected = selected.includes(philosopher.name);
          const isDisabled = !isSelected && selected.length === 3;

          return (
            <label
              key={philosopher.name}
              className={`flex min-h-36 cursor-pointer flex-col border p-3 transition-colors ${
                isSelected
                  ? 'border-2 border-neutral-900 p-2.75'
                  : 'border-neutral-200'
              } ${isDisabled ? 'cursor-not-allowed opacity-45' : ''}`}
            >
              <div className='mb-2 flex items-start justify-between'>
                <div
                  aria-hidden
                  className='size-12 shrink-0 rounded-full bg-neutral-200'
                />
                <input
                  type='checkbox'
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => togglePhilosopher(philosopher.name)}
                  aria-label={`${philosopher.name} 선택`}
                  className='size-5 cursor-pointer accent-neutral-900 disabled:cursor-not-allowed'
                />
              </div>
              <span className='text-sm font-semibold leading-tight text-neutral-900'>
                {philosopher.name}
              </span>
              <span className='mt-1.5 text-xs leading-[1.35] text-neutral-600'>
                {philosopher.description}
              </span>
              <span className='mt-auto pt-2 text-[10px] text-neutral-400'>
                {philosopher.tags}
              </span>
            </label>
          );
        })}
      </div>

      <footer className='shrink-0 border-t border-neutral-200 bg-white px-5 pb-5 pt-3'>
        <div className='mb-3 flex items-center justify-between text-xs'>
          <div className='flex items-center gap-3'>
            <span className='text-neutral-500'>선택한 철학자</span>
            <div className='flex -space-x-2' aria-hidden>
              {selected.map((name) => (
                <span
                  key={name}
                  className='size-6 rounded-full bg-neutral-300 ring-2 ring-white'
                />
              ))}
            </div>
          </div>
          <span className='font-semibold text-neutral-900'>
            {selected.length}/3
          </span>
        </div>
        <button
          type='button'
          disabled={!canContinue}
          onClick={() => navigate('/home')}
          className='flex h-12 w-full items-center justify-center bg-neutral-900 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300'
        >
          선택 완료 · 단톡방 열기
        </button>
      </footer>
    </section>
  );
}
