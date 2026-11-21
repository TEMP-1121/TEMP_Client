import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type SignupTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

export default function SignupTextField({ id, label, error, className, ...rest }: SignupTextFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-12 rounded-xl border border-neutral-300 px-4 text-base outline-none focus:border-neutral-900 disabled:bg-neutral-100',
          error && 'border-red-500 focus:border-red-500',
          className,
        )}
        {...rest}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
