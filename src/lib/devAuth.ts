// 개발 모드 전용. 카카오 콜백이 배포 주소(ilse.vercel.app)로만 등록돼 로컬에선 로그인할 수 없어,
// 배포 사이트에서 받은 Access Token을 콘솔로 붙여 넣어 로그인이 필요한 API를 로컬에서 테스트한다
import { useAuthStore } from '@/stores/useAuthStore'

declare global {
  interface Window {
    ilseToken?: (token: string) => void
  }
}

window.ilseToken = (token) => {
  useAuthStore.setState({ accessToken: token.trim() })
  console.info('[dev] Access Token을 넣었어요. 15분 뒤 만료되면 다시 넣어 주세요.')
}
