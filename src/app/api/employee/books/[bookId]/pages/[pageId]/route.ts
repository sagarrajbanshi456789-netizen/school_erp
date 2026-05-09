import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  context: any
) {
  try {
    const { pageId } = context.params

    await prisma.publicationPage.delete({
      where: {
        id: pageId,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}