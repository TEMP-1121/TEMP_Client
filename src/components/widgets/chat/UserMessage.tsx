type UserMessageProps = {
  text: string
}

export default function UserMessage({ text }: UserMessageProps) {
  return (
    <p className="max-w-69.5 self-end rounded-2xl rounded-tr-sm bg-accent-primary px-3.5 py-2.5 text-body-14-medium whitespace-pre-wrap text-text-inverse">
      {text}
    </p>
  )
}
