import PhilosopherMessage from '@/components/widgets/chat/PhilosopherMessage'
import UserMessage from '@/components/widgets/chat/UserMessage'

const USER_MESSAGE = '매일 같은 보고서만 써서 지겨워요'
const REPLIES = [
  { personaKey: 'epictetus', name: '에픽테토스', text: '보고서 주제는 자네 몫이 아니지만, 어떻게 쓸지는 자네 몫일세.' },
  { personaKey: 'nietzsche', name: '니체', text: '지겹다면 부숴 버리게! 같은 보고서도 자네 방식으로 쓰면 그건 창조일세.' },
  { personaKey: 'marx', name: '마르크스', text: '니체, 또 부수자는 건가. 진정하게.' },
]

// 온보딩 2장 예시 대화. 이미지 대신 실제 채팅 말풍선으로 그려 어떤 화면에서도 선명하다.
// 시안은 채팅 화면을 0.82배(폭 411 → 337)로 줄인 크기라 실제 크기로 그린 뒤 통째로 줄이고, 아래는 흐리게 사라지게 한다
export default function OnboardingChatPreview() {
  return (
    <div aria-hidden className="h-77.25 w-84.25 overflow-hidden mask-b-from-60%">
      <div className="flex w-102.75 origin-top-left scale-[0.82] flex-col gap-4">
        <UserMessage text={USER_MESSAGE} />
        {REPLIES.map((reply) => (
          <PhilosopherMessage key={reply.personaKey} {...reply} />
        ))}
      </div>
    </div>
  )
}
