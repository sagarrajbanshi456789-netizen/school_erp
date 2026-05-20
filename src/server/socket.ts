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

  // Track user → sockets (multi-tab safe)
  const userSockets = new Map<string, Set<string>>()

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id)

    let currentUserId: string | null = null

    // =========================
    // USER ONLINE
    // =========================
    socket.on("join_user", ({ userId }) => {
      if (!userId) return

      currentUserId = userId
      socket.join(`user:${userId}`)

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set())
      }

      userSockets.get(userId)!.add(socket.id)

      console.log(`👤 User online: ${userId}`)

      // safer broadcast (can later scope by friends only)
      io.emit("user_online", { userId })
    })

    // =========================
    // CHAT ROOM
    // =========================
    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return

      socket.join(`conv:${conversationId}`)

      console.log(`💬 Joined conversation: ${conversationId}`)
    })

    // =========================
    // CHESS ROOM (NEW)
    // =========================
    socket.on("join_game", ({ gameId }) => {
      if (!gameId) return

      socket.join(`game:${gameId}`)

      console.log(`♟ Joined game: ${gameId}`)
    })

    // =========================
    // SEND MESSAGE (CHAT)
    // =========================
    socket.on("send_message", async (data) => {
      try {
        if (!data?.conversationId || !data?.senderId || !data?.content) return

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

        io.to(`conv:${data.conversationId}`).emit(
          "new_message",
          message
        )

        if (data.receiverId) {
          io.to(`user:${data.receiverId}`).emit(
            "message_notification",
            message
          )
        }
      } catch (error) {
        console.error("❌ SEND_MESSAGE_ERROR:", error)
      }
    })

    // =========================
    // READ RECEIPT
    // =========================
    socket.on("mark_read", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return

      io.to(`conv:${conversationId}`).emit("message_read", {
        conversationId,
        userId,
      })
    })

    // =========================
    // TYPING
    // =========================
    socket.on("typing", ({ conversationId, userId }) => {
      if (!conversationId) return

      socket.to(`conv:${conversationId}`).emit("typing", {
        userId,
      })
    })

    socket.on("stop_typing", ({ conversationId, userId }) => {
      if (!conversationId) return

      socket.to(`conv:${conversationId}`).emit("stop_typing", {
        userId,
      })
    })

    // =========================
    // CHESS MOVE (READY HOOK)
    // =========================
    socket.on("make_move", async (data) => {
      try {
        const { gameId, move } = data
        if (!gameId || !move) return

        // ⚠️ later: validate move server-side with chess engine

        io.to(`game:${gameId}`).emit("move_made", {
          gameId,
          move,
        })
      } catch (err) {
        console.error("❌ MOVE_ERROR:", err)
      }
    })

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id)

      if (!currentUserId) return

      const sockets = userSockets.get(currentUserId)
      if (sockets) {
        sockets.delete(socket.id)

        if (sockets.size === 0) {
          userSockets.delete(currentUserId)

          console.log(`👤 User offline: ${currentUserId}`)

          io.emit("user_offline", { userId: currentUserId })
        }
      }
    })
  })

  return io
}