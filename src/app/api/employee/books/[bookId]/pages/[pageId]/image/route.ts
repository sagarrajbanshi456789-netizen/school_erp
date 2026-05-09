// src/app/api/employee/books/[bookId]/pages/[pageId]/image/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      bookId: string
      pageId: string
    }>
  }
) {
  try {
    const { pageId } = await context.params

    const formData = await req.formData()

    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      )
    }

    /* ---------------- VALIDATION ---------------- */

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ]

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
        },
        {
          status: 400,
        }
      )
    }

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "File too large",
        },
        {
          status: 400,
        }
      )
    }

    /* ---------------- BUFFER ---------------- */

    const arrayBuffer = await file.arrayBuffer()

    // IMPORTANT: use Uint8Array for Prisma Bytes
    const imageData = new Uint8Array(arrayBuffer)

    /* ---------------- UPDATE ---------------- */

    const updatedPage =
      await prisma.publicationPage.update({
        where: {
          id: pageId,
        },

        data: {
          imageData,
          mimeType: file.type,
        },

        select: {
          id: true,
          pageNumber: true,
        },
      })

    return NextResponse.json({
      success: true,
      page: updatedPage,
    })
  } catch (error) {
    console.error("UPLOAD ERROR:", error)

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    )
  }
}