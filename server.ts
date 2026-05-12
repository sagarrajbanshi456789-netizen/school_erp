import "dotenv/config"
console.log("ACC_DATABASE_URL:", process.env.ACC_DATABASE_URL) // should print the URL


import { createServer } from "http"
import next from "next"
import { initSocket } from "./src/server/socket.ts"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({
  dev,
  hostname,
  port,
})

const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  // SOCKET INIT
  initSocket(httpServer)

  console.log("🟢 Socket initialized")

  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`)
  })
})
