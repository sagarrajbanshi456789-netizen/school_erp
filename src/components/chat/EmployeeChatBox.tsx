"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import io from "socket.io-client"

let socket: any

export default function EmployeeChatBox() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    socket = io({ path: "/api/socket" })

    socket.emit("join", session?.user?.id)

    socket.on("receive-message", (msg: any) => {
      setMessages(prev => [...prev, msg])
    })

    return () => socket.disconnect()
  }, [session])

  const sendMessage = async () => {
    if (!text.trim()) return

    const msg = {
      from: session?.user?.id,
      to: "ADMIN", // 🔥 always admin
      text,
      role: "employee",
    }

    socket.emit("send-message", msg)
    setMessages(prev => [...prev, msg])
    setText("")
  }

  return (
    <div className="border rounded-lg h-[500px] flex flex-col">
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-xs ${
              m.from === session?.user?.id
                ? "ml-auto bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t flex">
        <input
          className="flex-1 p-2 outline-none"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message admin..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-green-600 text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}