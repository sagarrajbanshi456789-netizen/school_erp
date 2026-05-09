import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ publicationId: string }> }
) {
  try {
    // ✅ FIX: must await params
    const { publicationId } = await context.params

    if (!publicationId) {
      return NextResponse.json(
        { error: "Missing publicationId" },
        { status: 400 }
      )
    }

    const pages = await prisma.publicationPage.findMany({
      where: { publicationId },
      orderBy: { pageNumber: "asc" },
      select: {
        id: true,
        publicationId: true,
        pageNumber: true,
        imageData: true,
      },
    })

    const result = pages.map((page) => ({
      id: page.id,
      pageNumber: page.pageNumber,

      // ✅ safe base64 conversion
      imageData: page.imageData
        ? Buffer.from(page.imageData).toString("base64")
        : null,

      imageUrl: `/api/public/page-image/${page.id}`,
    }))

    return NextResponse.json({
      pages: result,
    })
  } catch (err) {
    console.error("PUBLICATION PAGES API ERROR:", err)

    return NextResponse.json(
      { error: "Failed to load pages" },
      { status: 500 }
    )
  }
}