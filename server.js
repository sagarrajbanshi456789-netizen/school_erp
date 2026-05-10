// server.js
const { createServer } = require("http")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("send-message", (data) => {
      io.emit("receive-message", data)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
  })
})