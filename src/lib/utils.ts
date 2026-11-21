import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// index.css의 @utility 글자 스타일(text-body-16-regular 등)을 모르면 글자 색으로 보고 text-text-primary와 합칠 때 지워 버린다
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [(value: string) => /^(title|heading|body|caption)-\d+-/.test(value)] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uuid() {
  // randomUUID는 https·localhost에서만 있어서, 휴대폰으로 http 개발 서버(Network 주소)에 접속하면 없다
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
  )
}
