// src/components/chat/MessageBubble.tsx
'use client'

type Message = {
  text?: string
  content?: string
  from: string
  to: string
  role?: "admin" | "user"
  status?: "sending" | "sent"
}

interface Props {
  msg: Message
  isOwn: boolean
}

export default function MessageBubble({
  msg,
  isOwn,
}: Props) {
  return (
    <div
      className={`flex flex-col mb-5 ${
        isOwn ? "items-end" : "items-start"
      }`}
    >
      {/* MESSAGE BUBBLE */}
      <div
        className={`
          relative px-4 py-2 rounded-2xl max-w-xs break-words shadow-sm
          ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-200 dark:bg-gray-700 rounded-bl-md"
          }
        `}
      >
        {msg.text || msg.content}
      </div>

      {/* MESSAGE STATUS */}
      {isOwn && msg.status && (
        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {msg.status === "sending"
            ? "Sending..."
            : "Sent"}
        </span>
      )}
    </div>
  )
}