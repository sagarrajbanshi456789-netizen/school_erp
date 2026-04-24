import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth' // adjust if different

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id

    const assignedBooks = await prisma.assignedBook.findMany({
      where: { employeeId },
      include: {
        publication: {
          include: {
            pages: true,
          },
        },
      },
    })

    const formatted = assignedBooks.map((b) => {
      const totalPages = b.publication.pages.length
      const completedPages = b.completedPages

      return {
        id: b.publication.id,
        title: b.publication.title,
        publication: b.publication.title,
        totalPages,
        completedPages,
      }
    })

    return NextResponse.json({
      assignedBooks: formatted,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}