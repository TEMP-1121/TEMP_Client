import { useState, type SubmitEvent } from 'react'

import TextField from '@/components/common/TextField'
import { cn } from '@/lib/utils'
import { normalizeSignup, validateSignup } from '@/lib/validateSignup'
import { useAuthStore } from '@/stores/useAuthStore'
import type { SignupField, SignupForm as SignupFormValues } from '@/types/auth'

type SignupFormProps = {
  defaultName: string | null
  defaultEmail: string | null
}

export default function SignupForm({ defaultName, defaultEmail }: SignupFormProps) {
  const submitting = useAuthStore((s) => s.submitting)
  const signupError = useAuthStore((s) => s.signupError)
  const serverFieldErrors = useAuthStore((s) => s.fieldErrors)
  const submitSignup = useAuthStore((s) => s.submitSignup)

  const [form, setForm] = useState<SignupFormValues>({
    name: defaultName ?? '',
    email: defaultEmail ?? '',
    phone: '',
  })
  const [touched, setTouched] = useState<Partial<Record<SignupField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const clientErrors = validateSignup(form)
  const isValid = Object.keys(clientErrors).length === 0

  const errorOf = (field: SignupField) =>
    (submitted || touched[field] ? clientErrors[field] : undefined) ?? serverFieldErrors[field]

  const handleChange = (field: SignupField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: SignupField) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid || submitting) return
    void submitSignup(normalizeSignup(form))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-5">
      <TextField
        id="signup-name"
        label="이름"
        autoComplete="name"
        maxLength={100}
        value={form.name}
        disabled={submitting}
        error={errorOf('name')}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      <TextField
        id="signup-email"
        label="이메일"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={form.email}
        disabled={submitting}
        error={errorOf('email')}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
      />
      <TextField
        id="signup-phone"
        label="휴대폰 번호"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="01012345678"
        maxLength={11}
        value={form.phone}
        disabled={submitting}
        error={errorOf('phone')}
        onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
        onBlur={() => handleBlur('phone')}
      />

      {signupError && <p className="text-sm text-red-500">{signupError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'mt-auto h-14 rounded-2xl bg-neutral-900 font-semibold text-white disabled:opacity-50',
          !isValid && 'bg-neutral-400',
        )}
      >
        {submitting ? '가입 중…' : '가입하기'}
      </button>
    </form>
  )
}
