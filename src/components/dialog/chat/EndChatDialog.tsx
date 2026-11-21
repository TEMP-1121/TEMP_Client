type EndChatDialogProps = {
  onCancel: () => void
  onConfirm: () => void
}

// window.confirm은 Android WebView에서 셸이 처리하지 않으면 뜨지 않아 웹에서 직접 그린다
export default function EndChatDialog({ onCancel, onConfirm }: EndChatDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-chat-title"
      className="fixed inset-0 z-20 flex items-center justify-center bg-background-scrim p-6"
      onClick={onCancel}
    >
      <div className="w-full max-w-80 bg-background-base p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="end-chat-title" className="text-heading-18-bold">
          대화를 종료할까요?
        </h2>
        <p className="mt-2 text-body-14-regular text-text-secondary">
          종료하면 더 이상 대화할 수 없어요. 철학자들이 한 명씩 선물을 골라 줄 거예요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button onClick={onCancel} className="border border-border-strong py-3 text-body-16-medium">
            취소
          </button>
          <button
            onClick={onConfirm}
            className="bg-accent-primary py-3 text-body-16-semibold text-text-inverse active:bg-accent-pressed"
          >
            종료하기
          </button>
        </div>
      </div>
    </div>
  )
}
