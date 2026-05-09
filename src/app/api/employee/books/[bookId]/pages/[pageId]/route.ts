// src/app/api/employee/books/[bookId]/pages/[pageId]/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      bookId: string
      pageId: string
    }>
  }
) {
  try {
    const { bookId, pageId } = await context.params

    if (!pageId || !bookId) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      )
    }

    await prisma.publicationPage.delete({
      where: {
        id: pageId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Page deleted",
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to delete page",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}