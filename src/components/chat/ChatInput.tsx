'use client'

import { useState } from "react"

type MessagePayload = {
  text: string
  from: string
  to: string
}

interface Props {
  onSend: (msg: MessagePayload) => void
  from: string
  to: string
}

export default function ChatInput({ onSend, from, to }: Props) {
  const [text, setText] = useState("")

  const send = () => {
    if (!text.trim()) return

    onSend({
      text,
      from,
      to
    })

    setText("")
  }

  return (
    <div className="flex gap-2 border-t p-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  )
}