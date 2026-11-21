import { cn } from '@/lib/utils'

const CRISIS_LINE = '109'

type ChatPauseNoticeProps = {
  className?: string
}

export default function ChatPauseNotice({ className }: ChatPauseNoticeProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex w-full max-w-79 flex-col gap-6 rounded-xl bg-background-subtle px-5 pt-5 pb-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 text-text-primary">
        <p className="text-heading-18-bold">잠시 대화를 멈출게요</p>
        <p className="text-body-14-regular">
          지금 많이 힘드신가요? 혼자 견디지 않으셔도 돼요.
          <br />
          전문 상담사와 바로 이야기해 보세요.
        </p>
      </div>
      {/* tel: 링크는 셸이 우리 도메인 밖 링크로 보고 휴대폰 전화 앱(번호 입력 화면)으로 넘긴다 */}
      <a
        href={`tel:${CRISIS_LINE}`}
        className="flex h-10 items-center justify-center rounded-[10px] bg-icon-secondary text-body-14-bold text-text-inverse active:bg-icon-primary"
      >
        {CRISIS_LINE} 자살예방상담전화 연결
      </a>
    </div>
  )
}
