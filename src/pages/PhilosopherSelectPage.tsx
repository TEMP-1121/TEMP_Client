import { X } from 'lucide-react';
import { useNavigate } from 'react-router';

import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar';
import PhilosopherCard from '@/components/widgets/philosopher/PhilosopherCard';
import PhilosopherGrid from '@/components/widgets/philosopher/PhilosopherGrid';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/useChatStore';
import { MAX_PHILOSOPHERS, usePhilosopherStore } from '@/stores/usePhilosopherStore';

export default function PhilosopherSelectPage() {
  const philosophers = usePhilosopherStore((s) => s.philosophers);
  const selected = usePhilosopherStore((s) => s.selectedIds);
  const togglePhilosopher = usePhilosopherStore((s) => s.toggleSelect);
  const createConversation = useChatStore((s) => s.createConversation);
  const navigate = useNavigate();
  const draft = useChatStore((s) => s.draft);
  const setDraft = useChatStore((s) => s.setDraft);
  const isFull = selected.length === MAX_PHILOSOPHERS;

  function openRoom() {
    createConversation(selected, draft.trim() || undefined);
    setDraft('', '');
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

      <div className='flex-1 overflow-y-auto px-5 pb-4'>
        <PhilosopherGrid
          philosophers={philosophers}
          renderItem={(philosopher) => {
            const isSelected = selected.includes(philosopher.key);
            const isDisabled = !isSelected && isFull;

            return (
              <label
                key={philosopher.key}
                className={cn('cursor-pointer', isDisabled && 'cursor-not-allowed opacity-45')}
              >
                <PhilosopherCard
                  philosopher={philosopher}
                  selected={isSelected}
                  topRight={
                    <input
                      type='checkbox'
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => togglePhilosopher(philosopher.key)}
                      aria-label={`${philosopher.name} 선택`}
                      className='size-5 cursor-pointer accent-accent-primary disabled:cursor-not-allowed'
                    />
                  }
                />
              </label>
            );
          }}
        />
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
