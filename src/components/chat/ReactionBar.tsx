interface Props {
  onReact: (emoji: string) => void
}

export default function ReactionBar({ onReact }: Props) {
  const emojis = ["👍", "❤️", "🔥", "😂"]

  return (
    <div className="flex gap-2 text-sm mt-1">
      {emojis.map(e => (
        <button key={e} onClick={() => onReact(e)}>
          {e}
        </button>
      ))}
    </div>
  )
}