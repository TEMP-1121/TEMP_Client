import Logo from '@/components/common/Logo';

export default function SplashPage() {
  return (
    <section className='flex flex-1 flex-col bg-background-base px-4'>
      <div className='flex flex-1 flex-col items-center justify-center pb-24'>
        <Logo className='size-24' />
        <h1 className='mt-6 text-4xl font-bold leading-tight tracking-[-0.02em] text-text-primary'>
          일세
        </h1>
        <p className='mt-1 text-sm text-text-tertiary'>ILSE</p>
      </div>

      <p className='mb-26 text-center text-sm text-text-primary'>
        일고민 하나, 철학자는 셋! <span className='font-semibold text-accent-primary'>일세</span>
      </p>
    </section>
  );
}
