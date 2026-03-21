type Message = {
  text: string
  from: string
  to: string
  role?: string
}

interface Props {
  msg: Message
  isOwn: boolean
}

export default function MessageBubble({ msg, isOwn }: Props) {
  return (
    <div
      className={`p-2 rounded max-w-xs ${
        isOwn
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      {msg.text}
    </div>
  )
}