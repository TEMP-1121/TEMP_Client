import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/useChatStore';
import { MAX_PHILOSOPHERS, usePhilosopherStore } from '@/stores/usePhilosopherStore';

export default function PhilosopherSelectPage() {
  const philosophers = usePhilosopherStore((s) => s.philosophers);
  const selected = usePhilosopherStore((s) => s.selectedIds);
  const togglePhilosopher = usePhilosopherStore((s) => s.toggleSelect);
  const createConversation = useChatStore((s) => s.createConversation);
  const navigate = useNavigate();
  const message = (useLocation().state as { message?: string } | null)?.message;
  const isFull = selected.length === MAX_PHILOSOPHERS;

  function openRoom() {
    createConversation(selected, message);
    navigate('/chat');
  }

  return (
    <section className='flex min-h-0 flex-1 flex-col bg-background-base'>
      <header className='grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5'>
        <span aria-hidden />
        <h1 className='text-body-16-semibold'>철학자 고르기</h1>
        <button
          type='button'
          onClick={() => navigate('/home')}
          aria-label='닫기'
          className='flex size-9 items-center justify-center justify-self-end'
        >
          <X className='size-6 text-icon-primary' />
        </button>
      </header>

      <div className='shrink-0 px-5 pt-1 pb-4'>
        <p className='text-body-14-semibold'>
          함께 이야기할 철학자 {MAX_PHILOSOPHERS}명을 골라 주세요
        </p>
      </div>

      <div className='grid flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto px-5 pb-4'>
        {philosophers.map((philosopher) => {
          const isSelected = selected.includes(philosopher.key);
          const isDisabled = !isSelected && isFull;

          return (
            <label
              key={philosopher.key}
              className={cn(
                'flex min-h-36 cursor-pointer flex-col border border-border-normal p-3 transition-colors',
                isSelected && 'border-2 border-border-active p-2.75',
                isDisabled && 'cursor-not-allowed opacity-45',
              )}
            >
              <div className='mb-2 flex items-start justify-between'>
                <PhilosopherAvatar personaKey={philosopher.key} className='size-12' />
                <input
                  type='checkbox'
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => togglePhilosopher(philosopher.key)}
                  aria-label={`${philosopher.name} 선택`}
                  className='size-5 cursor-pointer accent-accent-primary disabled:cursor-not-allowed'
                />
              </div>
              <span className='text-body-14-semibold'>{philosopher.name}</span>
              <span className='mt-1.5 text-caption-12-regular text-text-secondary'>
                {philosopher.description}
              </span>
              <span className='mt-auto pt-2 text-caption-12-regular text-text-tertiary'>
                {philosopher.tags.map((tag) => `#${tag}`).join(' ')}
              </span>
            </label>
          );
        })}
      </div>

      <footer className='shrink-0 border-t border-border-normal bg-background-base px-5 pt-3 pb-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-caption-12-regular text-text-tertiary'>선택한 철학자</span>
            <div className='flex -space-x-2'>
              {selected.map((key) => (
                <PhilosopherAvatar key={key} personaKey={key} className='size-6' />
              ))}
            </div>
          </div>
          <span className='text-caption-12-semibold'>
            {selected.length}/{MAX_PHILOSOPHERS}
          </span>
        </div>
        <button
          type='button'
          disabled={!isFull}
          onClick={openRoom}
          className='flex h-12 w-full items-center justify-center bg-accent-primary text-body-14-semibold text-text-inverse active:bg-accent-pressed disabled:cursor-not-allowed disabled:bg-accent-disabled'
        >
          선택 완료 · 단톡방 열기
        </button>
      </footer>
    </section>
  );
}
