import { Server } from "socket.io"

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*", // in production restrict this
    },
  })

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id)

    // =========================
    // JOIN USER ROOM
    // =========================
    socket.on("join_user", ({ userId }) => {
      socket.join(userId)
    })

    // =========================
    // JOIN CONVERSATION ROOM
    // =========================
    socket.on("join_conversation", ({ conversationId }) => {
      socket.join(conversationId)
    })

    // =========================
    // SEND MESSAGE
    // =========================
    socket.on("send_message", (data) => {
      /*
        data = {
          conversationId,
          senderId,
          receiverId,
          content
        }
      */

      // send to conversation room
      io.to(data.conversationId).emit("new_message", data)

      // notify receiver directly
      io.to(data.receiverId).emit("message_notification", data)
    })

    // =========================
    // READ RECEIPT
    // =========================
    socket.on("mark_read", ({ conversationId, userId }) => {
      io.to(conversationId).emit("message_read", {
        conversationId,
        userId,
      })
    })

    // =========================
    // TYPING INDICATOR
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