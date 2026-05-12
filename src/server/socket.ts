// src/server/socket.ts
import { Server } from "socket.io"
import { prisma } from "@/lib/prisma"

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  })

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id)

    // =========================
    // JOIN USER ROOM
    // =========================
    socket.on("join_user", ({ userId }) => {
      if (!userId) return
      socket.join(userId)
    })

    // =========================
    // JOIN CONVERSATION ROOM
    // =========================
    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return
      socket.join(conversationId)
    })

    // =========================
    // SEND MESSAGE (CLEAN + SAFE)
    // =========================
    socket.on("send_message", async (data) => {
      try {
        if (!data?.conversationId || !data?.senderId || !data?.content) {
          return
        }

        // 1. SAVE TO DB
        const message = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
                image: true,
              },
            },
          },
        })

        // 2. EMIT TO CONVERSATION (MAIN CHAT ROOM)
        io.to(data.conversationId).emit("new_message", message)

        // 3. NOTIFY RECEIVER (optional badge system)
        if (data.receiverId) {
          io.to(data.receiverId).emit("message_notification", message)
        }

      } catch (error) {
        console.error("SEND_MESSAGE_ERROR:", error)
      }
    })

    // =========================
    // READ RECEIPT
    // =========================
    socket.on("mark_read", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return

      io.to(conversationId).emit("message_read", {
        conversationId,
        userId,
      })
    })

    // =========================
    // TYPING
    // =========================
    socket.on("typing", ({ conversationId, userId }) => {
      if (!conversationId) return
      socket.to(conversationId).emit("typing", { userId })
    })

    socket.on("stop_typing", ({ conversationId, userId }) => {
      if (!conversationId) return
      socket.to(conversationId).emit("stop_typing", { userId })
    })

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id)
    })
  })

  return io
}