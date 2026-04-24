import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { bookId: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id

    const book = await prisma.assignedBook.findFirst({
      where: {
        employeeId,
        publicationId: params.bookId,
      },
      include: {
        publication: {
          include: {
            pages: true,
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: book.publication.id,
      title: book.publication.title,
      publication: book.publication.title,
      totalPages: book.publication.pages.length,
      completedPages: book.completedPages,
      pages: book.publication.pages,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}