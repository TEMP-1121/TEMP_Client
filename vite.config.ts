import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// 로그인 쿠키가 다른 사이트 쿠키로 막히지 않도록 백엔드를 웹과 같은 주소 아래로 붙인다 (배포는 vercel.json rewrites가 같은 일을 한다)
const PROXY_PATHS = ['/api', '/oauth2', '/login/oauth2']

export default defineConfig(({ mode }) => {
  // VITE_가 아닌 값이라 빌드 결과(JS)에는 들어가지 않는다
  const target = loadEnv(mode, process.cwd(), '').API_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    // 구형 Android WebView 대비
    build: { target: 'es2020' },
    server: {
      // 같은 와이파이의 휴대폰 브라우저로 미리 보기용 (http라 APK 셸에서는 안 열림)
      host: true,
      // Host를 그대로 두면 TLS 인증서 검사가 localhost 이름으로 실패해 Host는 백엔드로 바꾸고(changeOrigin),
      // 원래 주소는 X-Forwarded-Host로 넘겨 백엔드가 OAuth 리다이렉트 주소를 이 개발 서버 기준으로 만들게 한다
      proxy: target
        ? Object.fromEntries(
            PROXY_PATHS.map((path) => [path, { target, changeOrigin: true, xfwd: true }]),
          )
        : undefined,
    },
  }
})
