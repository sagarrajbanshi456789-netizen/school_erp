import { Server } from "socket.io"
import { prisma } from "@/lib/prisma"

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  })

  console.log("🟢 SOCKET SERVER INITIALIZED")

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id)

    let currentUserId: string | null = null

    // =========================
    // USER JOIN (ONLINE STATUS)
    // =========================
    socket.on("join_user", ({ userId }) => {
      if (!userId) return

      currentUserId = userId
      socket.join(userId)

      console.log(`👤 User online: ${userId}`)

      io.emit("user_online", userId)
    })

    // =========================
    // JOIN CONVERSATION
    // =========================
    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return

      socket.join(conversationId)

      console.log(`💬 Joined conversation: ${conversationId}`)
    })

    // =========================
    // SEND MESSAGE
    // =========================
    socket.on("send_message", async (data) => {
      try {
        if (
          !data?.conversationId ||
          !data?.senderId ||
          !data?.content
        ) {
          return
        }

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

        io.to(data.conversationId).emit(
          "new_message",
          message
        )

        if (data.receiverId) {
          io.to(data.receiverId).emit(
            "message_notification",
            message
          )
        }

      } catch (error) {
        console.error("❌ SEND_MESSAGE_ERROR:", error)
      }
    })

    // =========================
    // READ RECEIPT (✓✓)
    // =========================
    socket.on("mark_read", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return

      io.to(conversationId).emit("message_read", {
        conversationId,
        userId,
      })
    })

    // =========================
    // TYPING INDICATOR
    // =========================
    socket.on("typing", ({ conversationId, userId }) => {
      if (!conversationId) return

      socket.to(conversationId).emit("typing", {
        userId,
      })
    })

    socket.on("stop_typing", ({ conversationId, userId }) => {
      if (!conversationId) return

      socket.to(conversationId).emit("stop_typing", {
        userId,
      })
    })

    // =========================
    // DISCONNECT (OFFLINE STATUS)
    // =========================
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id)

      if (currentUserId) {
        console.log(`👤 User offline: ${currentUserId}`)

        io.emit("user_offline", currentUserId)
      }
    })
  })

  return io
}