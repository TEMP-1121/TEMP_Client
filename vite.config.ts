import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // 구형 Android WebView 대비
  build: { target: 'es2020' },
  // 같은 와이파이의 휴대폰 브라우저로 미리 보기용 (http라 APK 셸에서는 안 열림)
  server: { host: true },
})
