// src/app/api/chat/upload/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 })
  }

  // TEMP: store locally (upgrade to S3 later)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filePath = `/uploads/${Date.now()}-${file.name}`

  // write file (node fs)
  const fs = require("fs")
  fs.writeFileSync(`./public${filePath}`, buffer)

  return NextResponse.json({
    url: filePath,
    type: file.type,
  })
}