import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'

type PhilosopherMessageProps = {
  personaKey: string
  name: string
  text: string
}

export default function PhilosopherMessage({ personaKey, name, text }: PhilosopherMessageProps) {
  return (
    <div className="flex gap-2">
      <PhilosopherAvatar personaKey={personaKey} name={name} className="size-7.5" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-caption-12-bold text-text-secondary">{name}</span>
        <p className="max-w-69.5 rounded-2xl rounded-tl-sm bg-background-subtle px-3.5 py-2.5 text-body-14-regular whitespace-pre-wrap text-text-primary">
          {text}
        </p>
      </div>
    </div>
  )
}
