import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type KakaoLoginButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export default function KakaoLoginButton({ className, type = 'button', ...rest }: KakaoLoginButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'shrink-0 cursor-pointer rounded-lg transition-[filter] active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      <img src="/assets/kakao-login.png" alt="카카오 로그인" width={224} height={46} className="block w-56" />
    </button>
  )
}
