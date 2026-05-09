// src/app/api/employee/books/[bookId]/pages/upload/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(
  req: Request,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    // ✅ FIX 1: unwrap params (Next.js 15 fix)
    const { bookId } = await context.params

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    // 🔥 FIX 2: your bookId is actually PUBLICATION ID in your system
    const publication = await prisma.publication.findUnique({
      where: { id: bookId },
    })

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      )
    }

    // get last page number
    let lastPage = await prisma.publicationPage.count({
      where: { publicationId: publication.id },
    })

    for (const file of files) {
      const buffer = new Uint8Array(await file.arrayBuffer())

      await prisma.publicationPage.create({
        data: {
          publicationId: publication.id,
          pageNumber: ++lastPage,
          imageData: buffer,
          mimeType: file.type,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("UPLOAD ERROR:", error)

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}