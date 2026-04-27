import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* ================= GET PAGES ================= */
export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const pages = await prisma.publicationPage.findMany({
      where: {
        publicationId: params.bookId,
      },
      orderBy: {
        pageNumber: "asc",
      },
    })

    return NextResponse.json({ pages })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    )
  }
}

/* ================= CREATE PAGE ================= */
export async function POST(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const body = await req.json()

    const lastPage = await prisma.publicationPage.findFirst({
      where: { publicationId: params.bookId },
      orderBy: { pageNumber: "desc" },
    })

    const page = await prisma.publicationPage.create({
      data: {
        publicationId: params.bookId,
        pageNumber: (lastPage?.pageNumber || 0) + 1,
        title: body?.title || `Page ${(lastPage?.pageNumber || 0) + 1}`,
        // contentHtml: "<p>New Page</p>",
        // contentJson: null,
      },
    })

    return NextResponse.json({ page })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    )
  }
}