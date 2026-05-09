// src/app/api/employee/books/[bookId]/pages/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      bookId: string
    }>
  }
) {
  try {
    console.log("============= PAGES API START =============")

    /* ---------------- PARAMS ---------------- */

    const { bookId } = await context.params

    console.log("📚 Book ID:", bookId)

    /* ---------------- QUERY PARAMS ---------------- */

    const publicationId = new URL(req.url).searchParams.get("publicationId")

    console.log("📚 Publication ID:", publicationId)

    /* ---------------- AUTH ---------------- */

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const employeeId = session.user.id

    console.log("👤 Employee ID:", employeeId)

    /* ---------------- VALIDATE ASSIGNED BOOK ---------------- */

    const assignedBook = await prisma.assignedBook.findFirst({
      where: {
        publicationId: bookId,
        employeeId,
      },
      include: {
        publication: true,
      },
    })

    if (!assignedBook) {
      return NextResponse.json(
        { error: "Book not found or not assigned" },
        { status: 404 }
      )
    }

    console.log("📖 Assigned publication:", assignedBook.publicationId)

    /* ---------------- FINAL PUBLICATION ---------------- */

    const finalPublicationId =
      publicationId || assignedBook.publicationId

    console.log("🎯 Final publication:", finalPublicationId)

    /* ---------------- FETCH PAGES (FIXED) ---------------- */

    const pages = await prisma.publicationPage.findMany({
      where: {
        publicationId: finalPublicationId,
      },
      orderBy: {
        pageNumber: "asc",
      },

      // ✅ FIX: include imageData
      select: {
        id: true,
        publicationId: true,
        pageNumber: true,
        imageData: true,
      },
    })

    console.log(`📄 Pages found: ${pages.length}`)

    /* ---------------- PROGRESS ---------------- */

    const progress = await prisma.pageProgress.findMany({
      where: {
        userId: employeeId,
        page: {
          publicationId: finalPublicationId,
        },
      },
      select: {
        pageId: true,
        completed: true,
      },
    })

    const progressMap = new Map(
      progress.map((p) => [p.pageId, p.completed])
    )

    /* ---------------- FIX IMAGE DATA (IMPORTANT) ---------------- */

    const pagesWithProgress = pages.map((page) => ({
      id: page.id,
      publicationId: page.publicationId,
      pageNumber: page.pageNumber,

      completed: progressMap.get(page.id) || false,

      // 🔥 CRITICAL FIX: convert Bytes → base64
      imageData: page.imageData
        ? Buffer.from(page.imageData).toString("base64")
        : null,
    }))

    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json({
      pages: pagesWithProgress,
      publication: assignedBook.publication,
    })
  } catch (err) {
    console.error("🔥 PAGES API ERROR:", err)

    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}