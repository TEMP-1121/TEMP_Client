import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage';
import PhilosopherSelectCard from '@/components/widgets/philosopher/PhilosopherSelectCard';
import { useChatStore } from '@/stores/useChatStore';
import {
  MAX_PHILOSOPHERS,
  usePhilosopherStore,
} from '@/stores/usePhilosopherStore';

export default function PhilosopherSelectPage() {
  const philosophers = usePhilosopherStore((s) => s.philosophers);
  const fetchPersonas = usePhilosopherStore((s) => s.fetchPersonas);
  const selected = usePhilosopherStore((s) => s.selectedIds);
  const togglePhilosopher = usePhilosopherStore((s) => s.toggleSelect);
  const createConversation = useChatStore((s) => s.createConversation);
  const creating = useChatStore((s) => s.creating);
  const navigate = useNavigate();
  const draft = useChatStore((s) => s.draft);
  const setDraft = useChatStore((s) => s.setDraft);
  const isFull = selected.length === MAX_PHILOSOPHERS;

  useEffect(() => {
    void fetchPersonas();
  }, [fetchPersonas]);

  function openRoom() {
    createConversation(selected, draft.trim() || undefined).then((id) => {
      if (id) setDraft('', '');
    });
    navigate('/chat');
  }

  return (
    <section className='flex min-h-0 flex-1 flex-col bg-background-surface'>
      <header className='shrink-0 pb-5.5'>
        <div className='grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-end px-2'>
          <h1 className='col-start-2 text-center text-heading-20-bold text-text-primary'>
            철학자 고르기
          </h1>
          <button
            type='button'
            onClick={() => navigate('/home')}
            aria-label='닫기'
            className='flex size-10 items-center justify-center text-icon-secondary'
          >
            <X className='size-6' aria-hidden />
          </button>
        </div>
        <p className='mt-0.5 text-center text-caption-13-regular text-text-tertiary'>
          함께 이야기할 철학자 {MAX_PHILOSOPHERS}명을 골라 주세요
        </p>
      </header>

      <div className='grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto px-4 pb-4'>
        {philosophers.map((philosopher) => {
          const isSelected = selected.includes(philosopher.key);
          return (
            <PhilosopherSelectCard
              key={philosopher.key}
              philosopher={philosopher}
              selected={isSelected}
              disabled={!isSelected && isFull}
              onToggle={() => togglePhilosopher(philosopher.key)}
            />
          );
        })}
      </div>

      {/* 시안 아래 여백 42px에는 아이폰 홈 인디케이터 자리가 포함돼 있다 */}
      <footer className='shrink-0 border-t border-border-normal bg-background-base px-4 pt-3 pb-10.5'>
        <div className='mb-2.5 flex items-center justify-between'>
          <div className='flex items-center gap-1.25'>
            <span className='text-caption-12-regular text-text-tertiary'>
              선택한 철학자
            </span>
            <div className='flex -space-x-1.5' aria-hidden>
              {Array.from({ length: MAX_PHILOSOPHERS }, (_, index) => (
                <span
                  key={selected[index] ?? index}
                  className='flex size-6.5 items-center justify-center overflow-hidden rounded-full border-2 border-border-inverse bg-background-subtle'
                >
                  {selected[index] && (
                    <PhilosopherImage personaKey={selected[index]} className='size-4' />
                  )}
                </span>
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
          className='flex h-12 w-full items-center justify-center rounded-xl bg-accent-primary text-body-15-bold text-text-inverse active:bg-accent-pressed disabled:cursor-not-allowed disabled:bg-accent-disabled'
        >
          상담 시작할게요
        </button>
      </footer>
    </section>
  );
}
