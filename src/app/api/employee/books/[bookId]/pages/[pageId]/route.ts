import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* ================= UPDATE PAGE (AUTO SAVE) ================= */
export async function PATCH(
  req: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const body = await req.json()

    const updated = await prisma.publicationPage.update({
      where: {
        id: params.pageId,
      },
      data: {
        // contentHtml: body.contentHtml,
        contentJson: body.contentJson,
        contentText: body.contentText || null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ page: updated })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    )
  }
}

/* ================= DELETE PAGE ================= */
export async function DELETE(
  req: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    await prisma.publicationPage.delete({
      where: { id: params.pageId },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    )
  }
}