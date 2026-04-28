import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id
    const { bookId } = params

    const { searchParams } = new URL(req.url)
    const publicationId = searchParams.get('publicationId')

    // 🔍 Validate book assignment
    const assignedBook = await prisma.assignedBook.findFirst({
      where: {
        id: bookId,
        employeeId,
      },
      include: {
        publication: true,
      },
    })

    if (!assignedBook) {
      return NextResponse.json(
        { error: 'Book not found or not assigned' },
        { status: 404 }
      )
    }

    // 📄 Fetch pages
    const pages = await prisma.publicationPage.findMany({
      where: {
        publicationId: publicationId || assignedBook.publicationId,
      },
      orderBy: {
        pageNumber: 'asc',
      },
      select: {
        id: true,
        title: true,
        pageNumber: true,
        contentHtml: true,
        contentJson: true,
        thumbnail: true,
        
      },
    })

    // 📊 Optional progress (future use)
    const progress = await prisma.pageProgress.findMany({
      where: {
        userId: employeeId,
        page: {
          publicationId: publicationId || assignedBook.publicationId,
        },
      },
      select: {
        pageId: true,
        completed: true,
      },
    })

    return NextResponse.json({
      pages,
      progress,
      publication: assignedBook.publication,
    })
  } catch (err) {
    console.error('🔥 PAGES API ERROR:', err)

    return NextResponse.json(
      {
        error: 'Server error',
        details: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    )
  }
}