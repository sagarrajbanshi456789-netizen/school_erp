// src/app/api/chat/message/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { io } from "@/server/socket-instance"

// =========================
// DEBUG CONFIG
// =========================
const DEBUG = true

function log(step: string, data?: any) {
  if (!DEBUG) return
  console.log(`\n🟢 [CHAT API DEBUG] ${step}`)
  if (data !== undefined) {
    console.dir(data, { depth: null })
  }
}

function errorLog(step: string, error: any) {
  console.error(`\n🔴 [CHAT API ERROR] ${step}`)
  console.error(error)
}

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10)

  log("REQUEST START", {
    requestId,
    url: req.url,
    method: req.method,
  })

  try {
    // =========================
    // AUTH CHECK
    // =========================
    log("AUTH CHECK START")

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    const user = session?.user

    log("SESSION RESULT", {
      hasSession: !!session,
      user,
    })

    if (!user) {
      log("AUTH FAILED - NO USER")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // =========================
    // PARSE BODY
    // =========================
    log("PARSING BODY")

    const body = await req.json()

    log("REQUEST BODY", body)

    const { conversationId, content } = body

    // =========================
    // VALIDATION
    // =========================
    log("VALIDATION START", { conversationId, content })

    if (!conversationId || !content?.trim()) {
      log("VALIDATION FAILED")
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // =========================
    // DATABASE INSERT
    // =========================
    log("CREATING MESSAGE IN DB")

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
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

    log("MESSAGE CREATED SUCCESSFULLY", message)

    // =========================
    // SOCKET EMIT
    // =========================
    log("EMITTING SOCKET EVENTS", {
      conversationId,
      userId: user.id,
    })

    try {
      io.to(conversationId).emit("new_message", message)
      log("EMIT: new_message SUCCESS")

      io.to(user.id).emit("message_sent", message)
      log("EMIT: message_sent SUCCESS")
    } catch (socketError) {
      errorLog("SOCKET EMIT FAILED", socketError)
    }

    // =========================
    // RESPONSE
    // =========================
    log("REQUEST SUCCESS END", { requestId })

    return NextResponse.json({
      success: true,
      requestId,
      message,
    })

  } catch (error) {
    errorLog("FATAL ERROR IN CHAT API", error)

    return NextResponse.json(
      {
        error: "Failed to send message",
        requestId,
      },
      { status: 500 }
    )
  }
}