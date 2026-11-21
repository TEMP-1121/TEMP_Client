export type SignupForm = {
  name: string
  email: string
  phone: string
}

export type SignupField = keyof SignupForm

export type SignupFieldErrors = Partial<Record<SignupField, string>>
