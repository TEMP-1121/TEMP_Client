import type { SignupField, SignupFieldErrors, SignupForm } from '@/types/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^010\d{8}$/

export const SIGNUP_FIELD_MESSAGES: Record<SignupField, string> = {
  name: '이름은 1~100자로 입력해 주세요.',
  email: '올바른 이메일 주소를 입력해 주세요.',
  phone: '010으로 시작하는 숫자 11자리로 입력해 주세요.',
}

export function isSignupFieldValid(field: SignupField, value: string) {
  const trimmed = value.trim()
  if (field === 'name') return trimmed.length >= 1 && trimmed.length <= 100
  if (field === 'email') return trimmed.length <= 254 && EMAIL_REGEX.test(trimmed)
  return PHONE_REGEX.test(value)
}

export function validateSignup(form: SignupForm): SignupFieldErrors {
  const errors: SignupFieldErrors = {}
  for (const field of Object.keys(form) as SignupField[]) {
    if (!isSignupFieldValid(field, form[field])) errors[field] = SIGNUP_FIELD_MESSAGES[field]
  }
  return errors
}

export function normalizeSignup(form: SignupForm): SignupForm {
  return { name: form.name.trim(), email: form.email.trim(), phone: form.phone }
}
