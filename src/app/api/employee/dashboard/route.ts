import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const books = await prisma.assignedBook.findMany({
      where: {
        employeeId: session.user.id,
      },
      include: {
        publication: true,
      },
    })

    const assignedBooks = books.map((item) => ({
      id: item.publication.id,
      title: item.publication.title,
    //   totalPages: item.publication.totalPages ?? 0,
    //   completedPages: item.publication.completedPages ?? 0,
      publication: item.publication.title,
    }))

    return NextResponse.json({ assignedBooks })
  } catch (error) {
    console.error('Employee dashboard API error:', error)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}