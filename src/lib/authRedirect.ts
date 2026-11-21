// 카카오 로그인은 페이지 전체가 백엔드·카카오로 넘어갔다 돌아와 앱 상태가 사라진다.
// 로그인 전에 가려던 경로를 sessionStorage에 잠깐 두었다가 로그인 후 그곳으로 보낸다
const KEY = 'ilse:returnTo'

export function rememberReturnTo(path: string) {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // 저장소를 못 쓰면 로그인 후 기본 화면으로 간다
  }
}

export function takeReturnTo() {
  try {
    const path = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    // 다른 사이트로 보내지 않도록 우리 경로(/로 시작, //로 시작하지 않음)만 받는다
    return path && path.startsWith('/') && !path.startsWith('//') ? path : null
  } catch {
    return null
  }
}
