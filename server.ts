// server.ts
import "dotenv/config"

console.log(
  "ACC_DATABASE_URL:",
  process.env.ACC_DATABASE_URL
)

import { createServer } from "http"
import next from "next"
import os from "os"

import { initSocket } from "./src/server/socket.ts"

const dev = process.env.NODE_ENV !== "production"

const hostname = "0.0.0.0"
const port = 3000

const app = next({
  dev,
  hostname,
  port,
})

const handler = app.getRequestHandler()

// =========================
// GET LOCAL IP
// =========================
function getLocalIP() {
  const interfaces = os.networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (
        net.family === "IPv4" &&
        !net.internal
      ) {
        return net.address
      }
    }
  }

  return "localhost"
}

app.prepare().then(() => {
  const httpServer = createServer(handler)

  // SOCKET INIT
  initSocket(httpServer)

  console.log("🟢 Socket initialized")

  httpServer.listen(port, hostname, () => {

    const localIP = getLocalIP()

    console.log("\n🚀 Server ready:")
    console.log(
      `➡ Local:   http://localhost:${port}`
    )

    console.log(
      `➡ Network: http://${localIP}:${port}`
    )
  })
})