import { Server } from "socket.io"

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    transports: ["websocket"], // 🔥 IMPORTANT FIX
  })

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id)

    // =========================
    // JOIN USER ROOM
    // =========================
    socket.on("join_user", ({ userId }) => {
      if (!userId) return
      socket.join(userId)
      console.log("Joined user room:", userId)
    })

    // =========================
    // JOIN CONVERSATION ROOM
    // =========================
    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return
      socket.join(conversationId)
      console.log("Joined conversation:", conversationId)
    })

    // =========================
    // SEND MESSAGE (FIXED)
    // =========================
    socket.on("send_message", (data) => {
      if (!data?.conversationId) return

      console.log("Message sent:", data)

      // 1. broadcast to conversation
      io.to(data.conversationId).emit("new_message", data)

      // 2. also notify receiver (optional UI badge)
      if (data.receiverId) {
        io.to(data.receiverId).emit("message_notification", data)
      }
    })

    // =========================
    // READ RECEIPT
    // =========================
    socket.on("mark_read", ({ conversationId, userId }) => {
      if (!conversationId) return

      io.to(conversationId).emit("message_read", {
        conversationId,
        userId,
      })
    })

    // =========================
    // TYPING
    // =========================
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing", { userId })
    })

    socket.on("stop_typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("stop_typing", { userId })
    })

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id)
    })
  })

  return io
}