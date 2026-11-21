import Logo from '@/components/common/Logo';
import Wordmark from '@/components/common/Wordmark';

export default function SplashPage() {
  return (
    <section className='flex flex-1 flex-col bg-background-base bg-linear-to-br from-transparent from-36% to-accent-primary/20 px-4'>
      <div className='flex flex-1 flex-col items-center justify-center pb-24'>
        <Logo className='size-24' />
        <h1 className='mt-6'>
          <Wordmark className='h-9' />
        </h1>
        <p className='mt-1 text-sm text-text-tertiary'>ILSE</p>
      </div>

      <p className='mb-26 text-center font-a2z text-body-14-regular text-text-primary'>
        일고민 하나, 철학자는 셋! <span className='font-a2z text-body-14-bold text-text-brand'>일세</span>
      </p>
    </section>
  );
}
