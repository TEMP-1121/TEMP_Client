import { X } from 'lucide-react';
import { useNavigate } from 'react-router';

import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/useChatStore';
import {
  MAX_PHILOSOPHERS,
  usePhilosopherStore,
} from '@/stores/usePhilosopherStore';

export default function PhilosopherSelectPage() {
  const philosophers = usePhilosopherStore((s) => s.philosophers);
  const selected = usePhilosopherStore((s) => s.selectedIds);
  const togglePhilosopher = usePhilosopherStore((s) => s.toggleSelect);
  const createConversation = useChatStore((s) => s.createConversation);
  const creating = useChatStore((s) => s.creating);
  const navigate = useNavigate();
  const draft = useChatStore((s) => s.draft);
  const setDraft = useChatStore((s) => s.setDraft);
  const isFull = selected.length === MAX_PHILOSOPHERS;

  function openRoom() {
    createConversation(selected, draft.trim() || undefined).then((id) => {
      if (id) setDraft('', '');
    });
    navigate('/chat');
  }

  return (
    <section className='flex min-h-0 flex-1 flex-col bg-background-surface'>
      <div
        className='flex h-12 shrink-0 items-center justify-between px-5 text-sm font-semibold text-text-primary'
        aria-hidden
      >
        {/* <span>9:41</span> */}
        <div className='flex items-center gap-1.5'></div>
      </div>

      <header className='relative flex shrink-0 flex-col items-center px-12 pb-5 pt-1'>
        <h1 className='text-body-16-semibold'>철학자 고르기</h1>
        <p className='mt-1 text-caption-12-regular text-text-tertiary'>
          함께 이야기할 철학자 {MAX_PHILOSOPHERS}명을 골라 주세요
        </p>
        <button
          type='button'
          onClick={() => navigate('/home')}
          aria-label='닫기'
          className='absolute right-4 top-0 flex size-9 items-center justify-center text-icon-primary'
        >
          <X className='size-6' aria-hidden />
        </button>
      </header>

      <div className='grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto px-4 pb-4'>
        {philosophers.map((philosopher) => {
          const isSelected = selected.includes(philosopher.key);
          const isDisabled = !isSelected && isFull;

          return (
            <label
              key={philosopher.key}
              className={cn(
                // relative가 없으면 sr-only 체크박스가 스크롤 영역 밖(레이아웃 기준)에 놓여, 누를 때 페이지 전체가 스크롤된다
                'relative flex h-58 cursor-pointer flex-col rounded-xl border-2 bg-background-base p-3 transition-colors',
                isSelected ? 'border-accent-primary' : 'border-transparent',
                isDisabled && 'cursor-not-allowed opacity-45',
              )}
            >
              <div className='flex items-start justify-between'>
                <div
                  className='size-24 rounded-full bg-palette-neutral-200'
                  aria-hidden
                />
                <input
                  type='checkbox'
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => togglePhilosopher(philosopher.key)}
                  aria-label={`${philosopher.name} 선택`}
                  className='peer sr-only'
                />
                <span
                  aria-hidden
                  className={cn(
                    'flex size-5 items-center justify-center rounded-[3px] border-2 text-xs font-bold peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary peer-focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-accent-primary bg-accent-primary text-text-inverse'
                      : 'border-palette-neutral-700 bg-background-base text-transparent',
                  )}
                >
                  ✓
                </span>
              </div>

              <div className='mt-auto min-w-0'>
                <h2 className='truncate text-body-14-bold text-text-primary'>
                  {philosopher.name}
                </h2>
                <p className='mt-1 line-clamp-2 text-caption-12-regular text-text-secondary'>
                  {philosopher.description}
                </p>
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  {philosopher.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-accent-primary px-2 py-0.5 text-[10px] leading-4 text-text-brand'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <footer className='shrink-0 border-t border-border-normal bg-background-base px-4 pb-4 pt-3'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-caption-12-regular text-text-tertiary'>
              선택한 철학자
            </span>
            <div className='flex -space-x-1.5' aria-hidden>
              {Array.from({ length: MAX_PHILOSOPHERS }, (_, index) => (
                <span
                  key={selected[index] ?? index}
                  className={cn(
                    'size-6 rounded-full border-2 border-background-base',
                    selected[index]
                      ? 'bg-palette-neutral-300'
                      : 'bg-background-subtle',
                  )}
                />
              ))}
            </div>
          </div>
          <span className='text-caption-12-regular tabular-nums text-text-tertiary'>
            {selected.length}/{MAX_PHILOSOPHERS}
          </span>
        </div>
        <button
          type='button'
          disabled={!isFull || creating}
          onClick={openRoom}
          className='flex h-12 w-full items-center justify-center rounded-xl bg-accent-primary text-body-14-semibold text-text-inverse active:bg-accent-pressed disabled:cursor-not-allowed disabled:bg-accent-disabled'
        >
          상담 시작할게요
        </button>
      </footer>
    </section>
  );
}
